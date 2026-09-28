/* ============================================================
   MINI-JEU DE PUTTING (meme principe que la seance de tirs du
   basket : on pose le doigt sur la balle, on tire vers l'arriere,
   une ligne pointillee montre ou la balle va s'arreter, on relache !
   Putting.open({title, putts:[{x, dist, pts}], onDone:function(points, made){}})
   x    : decalage horizontal du trou par rapport au centre (px, -30 a 30)
   dist : distance a parcourir en pixels (plus loin = plus dur a doser)
   pts  : points gagnes si le putt rentre
   Si la balle passe sur le trou trop vite, elle "lippe" (elle devie,
   ne rentre pas) au lieu de rentrer : il faut aussi doser la puissance.
   ============================================================ */
var Putting = (function(){
  var W=340, H=520, R=9, HOLE_Y=70, HOLE_R=14, FRICTION=230, VMAX=560, PULLMAX=150, CAPTURE_SPEED=140;
  var GREEN_CX=W/2, GREEN_CY=280, GREEN_RX=155, GREEN_RY=270;
  var AIM_VIS=95; /* la ligne de visee s'estompe avant la distance reelle : on doit sentir la puissance, pas juste viser le trou */

  function inGreen(x,y){
    var dx=(x-GREEN_CX)/GREEN_RX, dy=(y-GREEN_CY)/GREEN_RY;
    return dx*dx+dy*dy<=1.05;
  }

  function open(cfg){
    var putts=cfg.putts||[{x:0,dist:220,pts:2}], idx=0, total=0, made=0;
    var root=document.createElement('div'); root.className='mg';
    root.innerHTML=
      '<div class="mg-top"><div class="mg-title">'+(cfg.title||'Green de practice')+'</div><button class="mg-skip">Passer</button></div>'+
      '<div class="mg-wrap"><canvas class="mg-canvas"></canvas><div class="mg-help">Pose ton doigt sur la balle, tire vers l\'arriere, relache !</div></div>'+
      '<div class="mg-end" style="display:none"></div>';
    document.body.appendChild(root);
    var canvas=root.querySelector('canvas'), ctx=canvas.getContext('2d'), help=root.querySelector('.mg-help');
    var scale=1, dpr=Math.min(window.devicePixelRatio||1,2), raf=0, closed=false;

    function resize(){
      var maxW=Math.min(window.innerWidth-16,380), maxH=window.innerHeight-70;
      var w=maxW, h=w*H/W; if(h>maxH){h=maxH;w=h*W/H;}
      canvas.style.width=w+'px'; canvas.style.height=h+'px';
      canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); scale=w/W;
    }
    resize(); window.addEventListener('resize',resize);

    var ball, state, drag=null, floatTxt=[], resultTimer=0, shotTime=0, scored=false, lipped=false, holeX=W/2;
    function cfgFor(){ return putts[idx]||putts[putts.length-1]; }
    function setupShot(){
      var p=cfgFor();
      holeX=GREEN_CX+(p.x||0);
      ball={x:GREEN_CX,y:HOLE_Y+p.dist,vx:0,vy:0};
      state='aim'; drag=null; scored=false; lipped=false; shotTime=0; resultTimer=0;
      help.style.opacity=1;
    }
    setupShot();

    function pt(e){ var r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*W, y:(e.clientY-r.top)/r.height*H}; }
    function launchVec(){
      if(!drag)return null;
      var dx=drag.sx-drag.x, dy=drag.sy-drag.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<1)return {vx:0,vy:0,p:0};
      var p=Math.min(d,PULLMAX)/PULLMAX, v=p*VMAX;
      return {vx:dx/d*v, vy:dy/d*v, p:p};
    }
    canvas.addEventListener('pointerdown',function(e){
      if(state!=='aim')return; e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      var p=pt(e); drag={sx:p.x,sy:p.y,x:p.x,y:p.y}; help.style.opacity=0;
    });
    canvas.addEventListener('pointermove',function(e){ if(!drag)return; var p=pt(e); drag.x=p.x; drag.y=p.y; });
    function release(){
      if(!drag||state!=='aim')return; var v=launchVec(); drag=null;
      if(!v||v.p<0.1)return;
      ball.vx=v.vx; ball.vy=v.vy; state='roll'; sndWhoosh();
    }
    canvas.addEventListener('pointerup',release);
    canvas.addEventListener('pointercancel',function(){drag=null;});

    function step(dt){
      var speed=Math.hypot(ball.vx,ball.vy);
      if(speed>0){
        var ns=Math.max(0,speed-FRICTION*dt), k=ns/speed;
        ball.vx*=k; ball.vy*=k;
      }
      ball.x+=ball.vx*dt; ball.y+=ball.vy*dt;
      var dh=Math.hypot(ball.x-holeX, ball.y-HOLE_Y);
      var sp=Math.hypot(ball.vx,ball.vy);
      if(!scored && dh<HOLE_R){
        if(sp<=CAPTURE_SPEED){
          scored=true; ball.vx=0; ball.vy=0; ball.x=holeX; ball.y=HOLE_Y; onScore();
        } else if(!lipped){
          lipped=true;
          var nx=(ball.x-holeX)/(dh||1), ny=(ball.y-HOLE_Y)/(dh||1);
          ball.vx=nx*sp*0.55; ball.vy=ny*sp*0.55;
          floatTxt.push({x:holeX,y:HOLE_Y-14,t:0,txt:'PRESQUE !'});
          sndBad();
        }
      }
    }
    function onScore(){
      var pts=cfgFor().pts||1; total+=pts; made++;
      floatTxt.push({x:holeX,y:HOLE_Y-18,t:0,txt:'+'+pts});
      sndStar(); setTimeout(sndCheer,80);
      var r=canvas.getBoundingClientRect();
      FX.confAt(r.left+holeX*scale, r.top+HOLE_Y*scale,{particleCount:70,spread:80,startVelocity:26});
    }

    function drawBall(x,y,gold){
      ctx.save(); ctx.translate(x,y);
      ctx.beginPath(); ctx.ellipse(0,3.5,R*0.9,R*0.35,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,.25)'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.fillStyle=gold?'#e8c94a':'#fff'; ctx.fill();
      ctx.lineWidth=1.2; ctx.strokeStyle=gold?'#a8891f':'#b7b7a6'; ctx.stroke();
      ctx.restore();
    }
    function drawGreen(){
      ctx.fillStyle='#3f5a26'; ctx.fillRect(0,0,W,H);
      ctx.save();
      ctx.beginPath(); ctx.ellipse(GREEN_CX,GREEN_CY,GREEN_RX,GREEN_RY,0,0,Math.PI*2); ctx.clip();
      var strp=22;
      for(var x=0,i=0;x<W;x+=strp,i++){ ctx.fillStyle=(i%2===0)?'#6fa83a':'#7cb943'; ctx.fillRect(x,0,strp,H); }
      ctx.restore();
      ctx.beginPath(); ctx.ellipse(GREEN_CX,GREEN_CY,GREEN_RX,GREEN_RY,0,0,Math.PI*2); ctx.strokeStyle='#5c8f38'; ctx.lineWidth=3; ctx.stroke();
    }
    function drawHole(){
      ctx.beginPath(); ctx.ellipse(holeX,HOLE_Y+3,HOLE_R*1.05,HOLE_R*0.4,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,.2)'; ctx.fill();
      ctx.beginPath(); ctx.arc(holeX,HOLE_Y,HOLE_R,0,Math.PI*2); ctx.fillStyle='#12261a'; ctx.fill();
      ctx.lineWidth=2; ctx.strokeStyle='#0a1a10'; ctx.stroke();
      ctx.strokeStyle='#c7c8ce'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(holeX,HOLE_Y-2); ctx.lineTo(holeX,HOLE_Y-64); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(holeX,HOLE_Y-64); ctx.lineTo(holeX+22,HOLE_Y-58); ctx.lineTo(holeX,HOLE_Y-52); ctx.closePath();
      ctx.fillStyle='#e0435f'; ctx.fill();
    }
    function drawAim(){
      var v=launchVec(); if(!v||v.p<0.04)return;
      ctx.strokeStyle='rgba(232,201,74,.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ball.x,ball.y); ctx.lineTo(ball.x-(v.vx/VMAX)*PULLMAX*.5,ball.y-(v.vy/VMAX)*PULLMAX*.5); ctx.stroke();
      var dist=(v.vx*v.vx+v.vy*v.vy)/(2*FRICTION);
      var ang=Math.atan2(v.vy,v.vx);
      var visDist=Math.min(dist,AIM_VIS);
      var visX=ball.x+Math.cos(ang)*visDist, visY=ball.y+Math.sin(ang)*visDist;
      var grad=ctx.createLinearGradient(ball.x,ball.y,visX,visY);
      grad.addColorStop(0,'rgba(255,255,255,.65)'); grad.addColorStop(1,'rgba(255,255,255,0)');
      ctx.setLineDash([5,6]); ctx.strokeStyle=grad; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(ball.x,ball.y); ctx.lineTo(visX,visY); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='rgba(0,0,0,.4)'; ctx.fillRect(ball.x-24,ball.y+22,48,6);
      ctx.fillStyle=v.p>0.92?'#e0435f':'#e8c94a'; ctx.fillRect(ball.x-24,ball.y+22,48*v.p,6);
    }
    function drawHUD(){
      ctx.fillStyle='rgba(10,10,12,.75)'; ctx.fillRect(10,10,W-20,38);
      ctx.strokeStyle='#e8c94a'; ctx.lineWidth=2; ctx.strokeRect(10,10,W-20,38);
      ctx.textAlign='left'; ctx.fillStyle='#fff'; ctx.font='800 13px Rubik,Arial';
      ctx.fillText('Coup '+Math.min(idx+1,putts.length)+' / '+putts.length,22,33);
      ctx.textAlign='right'; ctx.fillStyle='#e8c94a'; ctx.font='900 17px Impact,Arial Black,Helvetica';
      ctx.fillText('+'+total+' PTS',W-22,35);
      if(state==='aim'){
        var cf=cfgFor();
        ctx.textAlign='center'; ctx.font='900 14px Impact,Arial Black,Helvetica'; ctx.fillStyle=cf.gold?'#e8c94a':'#fff';
        ctx.fillText(cf.gold?('PUTT EN OR x2 (+'+cf.pts+')'):('+'+cf.pts+' POINT'+(cf.pts>1?'S':'')),ball.x,ball.y-22);
      }
    }
    function drawFloat(dt){
      for(var i=floatTxt.length-1;i>=0;i--){
        var f=floatTxt[i]; f.t+=dt; if(f.t>1.1){floatTxt.splice(i,1);continue;}
        ctx.globalAlpha=1-f.t/1.1; ctx.textAlign='center'; ctx.font='900 '+(20+f.t*8)+'px Impact,Arial Black,Helvetica';
        ctx.lineWidth=3.5; ctx.strokeStyle='#0a0a0a'; ctx.strokeText(f.txt,f.x,f.y-f.t*44); ctx.fillStyle='#e8c94a'; ctx.fillText(f.txt,f.x,f.y-f.t*44);
      }
      ctx.globalAlpha=1;
    }

    var last=performance.now();
    function frame(now){
      if(closed)return;
      var dt=Math.min(0.033,(now-last)/1000); last=now;
      if(state==='roll'){
        var n=4; for(var i=0;i<n;i++)step(dt/n);
        shotTime+=dt;
        var speed=Math.hypot(ball.vx,ball.vy);
        var off=!inGreen(ball.x,ball.y);
        if(scored&&shotTime>0.08){ resultTimer+=dt; }
        if(off||shotTime>4.5||(scored&&resultTimer>0.9)||(!scored&&speed<4&&shotTime>0.2)){
          state='result'; resultTimer=0;
          if(!scored){ floatTxt.push({x:ball.x,y:ball.y-10,t:0,txt: off?'HORS DU GREEN !':'TROP COURT !'}); }
        }
      } else if(state==='result'){
        resultTimer+=dt;
        if(resultTimer>0.7){ idx++; if(idx>=putts.length){ finish(); return; } setupShot(); }
      }
      ctx.setTransform(scale*dpr,0,0,scale*dpr,0,0);
      drawGreen(); drawHole();
      if(state==='aim')drawAim();
      drawBall(ball.x,ball.y,!!cfgFor().gold);
      drawHUD(); drawFloat(dt);
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);

    function finish(){
      cancelAnimationFrame(raf); var end=root.querySelector('.mg-end');
      var msg=made===putts.length?'Parfait, tout est rentre !':(made?'Beau parcours !':'Pas facile, le putting...');
      end.innerHTML='<div class="mg-endcard"><div class="mg-endtitle">'+msg+'</div>'+
        '<div class="mg-endscore">+'+total+'<small> pts</small></div>'+
        '<div class="mg-endsub">'+made+' putt'+(made>1?'s':'')+' reussi'+(made>1?'s':'')+' sur '+putts.length+'</div>'+
        '<button class="btn big puttbtn" id="pgok">Continuer</button></div>';
      end.style.display='flex';
      if(made)FX.fireworks(made===putts.length?2200:900);
      if(window.gsap)gsap.fromTo(end.firstChild,{scale:.5,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(2)'});
      end.querySelector('#pgok').onclick=close;
    }
    function close(){
      if(closed)return; closed=true; cancelAnimationFrame(raf); window.removeEventListener('resize',resize);
      if(root.parentNode)root.parentNode.removeChild(root);
      cfg.onDone&&cfg.onDone(total,made);
    }
    root.querySelector('.mg-skip').onclick=function(){ if(state!=='done'){ closed=false; finish(); } };
  }

  /* ============================================================
     TROU PAR 3 (fin de manche) : premier coup au choix fer/putter
     depuis le tee, puis on finit au putter. Le fer porte plus loin
     (vol, un rebond, un peu de roule - un chip peut rentrer direct)
     mais est moins precis pres du trou ; le putter est precis mais
     ne porte pas loin.
     Putting.openHole({title, onDone:function(points, strokes){}})
     ============================================================ */
  function openHole(cfg){
    var W2=340, H2=640, HOLE_Y2=70;
    var GX=170, GY=170, GRX=150, GRY=140;
    var TEE_X=170, TEE_Y=580;
    var IRON_CARRY_MAX=480, FLIGHT_DUR=0.8, FLIGHT_H=70, IRON_ROLL_RETAIN=0.4;
    var MAX_STROKES=5;

    function inBounds(x,y){ return x>4 && x<W2-4 && y>-40 && y<H2+10; }

    var strokes=0, holed=false, totalPts=0;
    var root=document.createElement('div'); root.className='mg';
    root.innerHTML=
      '<div class="mg-top"><div class="mg-title">'+(cfg.title||'Trou par 3')+'</div><button class="mg-skip">Passer</button></div>'+
      '<div class="mg-wrap"><canvas class="mg-canvas"></canvas><div class="mg-help">Choisis ton club !</div>'+
      '<div class="mg-clubs" id="mgclubs">'+
        '<button class="btn puttbtn" id="clubIron">&#9971; Fer<span>porte loin</span></button>'+
        '<button class="btn ghost" id="clubPutter">&#9975; Putter<span>precis</span></button>'+
      '</div></div>'+
      '<div class="mg-end" style="display:none"></div>';
    document.body.appendChild(root);
    var canvas=root.querySelector('canvas'), ctx=canvas.getContext('2d'), help=root.querySelector('.mg-help'), clubsUI=root.querySelector('#mgclubs');
    var scale=1, dpr=Math.min(window.devicePixelRatio||1,2), raf=0, closed=false;

    function resize(){
      var maxW=Math.min(window.innerWidth-16,380), maxH=window.innerHeight-70;
      var w=maxW, h=w*H2/W2; if(h>maxH){h=maxH;w=h*W2/H2;}
      canvas.style.width=w+'px'; canvas.style.height=h+'px';
      canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); scale=w/W2;
    }
    resize(); window.addEventListener('resize',resize);

    var ball={x:TEE_X,y:TEE_Y,vx:0,vy:0}, club='iron', state='choose', drag=null, floatTxt=[], resultTimer=0, shotTime=0, scored=false, lipped=false, flight=null;

    function showClubChoice(){
      state='choose'; drag=null;
      var d=Math.hypot(ball.x-GX,ball.y-HOLE_Y2);
      help.textContent = d>220 ? 'Tu es loin : le fer porte plus loin.' : 'Tu es pres du trou : le putter est plus precis.';
      help.style.opacity=1;
      clubsUI.classList.add('show');
    }
    root.querySelector('#clubIron').onclick=function(){ sndClick(); club='iron'; clubsUI.classList.remove('show'); state='aim'; help.style.opacity=0; };
    root.querySelector('#clubPutter').onclick=function(){ sndClick(); club='putter'; clubsUI.classList.remove('show'); state='aim'; help.style.opacity=0; };
    showClubChoice();

    function pt(e){ var r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*W2, y:(e.clientY-r.top)/r.height*H2}; }
    function launchVec(){
      if(!drag)return null;
      var dx=drag.sx-drag.x, dy=drag.sy-drag.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<1)return {vx:0,vy:0,p:0};
      var p=Math.min(d,PULLMAX)/PULLMAX, v=p*VMAX;
      return {vx:dx/d*v, vy:dy/d*v, p:p};
    }
    canvas.addEventListener('pointerdown',function(e){
      if(state!=='aim')return; e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      var p=pt(e); drag={sx:p.x,sy:p.y,x:p.x,y:p.y};
    });
    canvas.addEventListener('pointermove',function(e){ if(!drag)return; var p=pt(e); drag.x=p.x; drag.y=p.y; });
    function release(){
      if(!drag||state!=='aim')return; var v=launchVec(); drag=null;
      if(!v||v.p<0.1)return;
      strokes++; sndWhoosh(); scored=false; lipped=false; shotTime=0; resultTimer=0;
      if(club==='iron'){
        var ang=Math.atan2(v.vy,v.vx), dist=v.p*IRON_CARRY_MAX;
        flight={x0:ball.x,y0:ball.y,x1:ball.x+Math.cos(ang)*dist,y1:ball.y+Math.sin(ang)*dist,t:0,dur:FLIGHT_DUR,ang:ang,rollSpeed:v.p*VMAX*IRON_ROLL_RETAIN};
        state='flight';
      } else {
        ball.vx=v.vx; ball.vy=v.vy; state='roll';
      }
    }
    canvas.addEventListener('pointerup',release);
    canvas.addEventListener('pointercancel',function(){drag=null;});

    function rollStep(dt){
      var speed=Math.hypot(ball.vx,ball.vy);
      if(speed>0){
        var ns=Math.max(0,speed-FRICTION*dt), k=ns/speed;
        ball.vx*=k; ball.vy*=k;
      }
      ball.x+=ball.vx*dt; ball.y+=ball.vy*dt;
      var dh=Math.hypot(ball.x-GX, ball.y-HOLE_Y2);
      var sp=Math.hypot(ball.vx,ball.vy);
      if(!scored && dh<HOLE_R){
        if(sp<=CAPTURE_SPEED){
          scored=true; ball.vx=0; ball.vy=0; ball.x=GX; ball.y=HOLE_Y2; onHoled();
        } else if(!lipped){
          lipped=true;
          var nx=(ball.x-GX)/(dh||1), ny=(ball.y-HOLE_Y2)/(dh||1);
          ball.vx=nx*sp*0.55; ball.vy=ny*sp*0.55;
          floatTxt.push({x:GX,y:HOLE_Y2-14,t:0,txt:'PRESQUE !'});
          sndBad();
        }
      }
    }
    function onHoled(){
      holed=true;
      var label;
      if(strokes===1){label='TROU EN UN !';totalPts=10;}
      else if(strokes===2){label='BIRDIE !';totalPts=6;}
      else if(strokes===3){label='PAR !';totalPts=4;}
      else if(strokes===4){label='BOGEY';totalPts=2;}
      else {label='DOUBLE BOGEY';totalPts=1;}
      floatTxt.push({x:GX,y:HOLE_Y2-18,t:0,txt:label});
      sndStar(); setTimeout(sndCheer,80);
      var r=canvas.getBoundingClientRect();
      FX.confAt(r.left+GX*scale, r.top+HOLE_Y2*scale,{particleCount:90,spread:90,startVelocity:30});
    }

    function drawBallSprite(x,y,h){
      ctx.save(); ctx.translate(x,y);
      var shrink=Math.max(0,1-h/300);
      ctx.beginPath(); ctx.ellipse(0,3.5+h*0.02,R*0.9*shrink,R*0.35*shrink,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,.25)'; ctx.fill();
      ctx.translate(0,-h);
      var sc=1+h/260;
      ctx.beginPath(); ctx.arc(0,0,R*sc,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
      ctx.lineWidth=1.2; ctx.strokeStyle='#b7b7a6'; ctx.stroke();
      ctx.restore();
    }
    function drawScene(){
      var fstrp=34;
      for(var fx=0,fi=0;fx<W2;fx+=fstrp,fi++){ ctx.fillStyle=(fi%2===0)?'#3f5a26':'#476a2b'; ctx.fillRect(fx,0,fstrp,H2); }
      ctx.save();
      ctx.beginPath(); ctx.ellipse(GX,GY,GRX,GRY,0,0,Math.PI*2); ctx.clip();
      var strp=20;
      for(var x=0,i=0;x<W2;x+=strp,i++){ ctx.fillStyle=(i%2===0)?'#9ad35f':'#a6dd6c'; ctx.fillRect(x,0,strp,H2); }
      ctx.restore();
      ctx.beginPath(); ctx.ellipse(GX,GY,GRX,GRY,0,0,Math.PI*2); ctx.strokeStyle='#7cb342'; ctx.lineWidth=3; ctx.stroke();
    }
    function drawHole(){
      ctx.beginPath(); ctx.ellipse(GX,HOLE_Y2+3,HOLE_R*1.05,HOLE_R*0.4,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,.2)'; ctx.fill();
      ctx.beginPath(); ctx.arc(GX,HOLE_Y2,HOLE_R,0,Math.PI*2); ctx.fillStyle='#12261a'; ctx.fill();
      ctx.lineWidth=2; ctx.strokeStyle='#0a1a10'; ctx.stroke();
      ctx.strokeStyle='#c7c8ce'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(GX,HOLE_Y2-2); ctx.lineTo(GX,HOLE_Y2-64); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(GX,HOLE_Y2-64); ctx.lineTo(GX+22,HOLE_Y2-58); ctx.lineTo(GX,HOLE_Y2-52); ctx.closePath();
      ctx.fillStyle='#e0435f'; ctx.fill();
    }
    function drawAim(){
      var v=launchVec(); if(!v||v.p<0.04)return;
      ctx.strokeStyle='rgba(232,201,74,.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ball.x,ball.y); ctx.lineTo(ball.x-(v.vx/VMAX)*PULLMAX*.5,ball.y-(v.vy/VMAX)*PULLMAX*.5); ctx.stroke();
      var ang=Math.atan2(v.vy,v.vx), aimVis=club==='iron'?AIM_VIS*1.6:AIM_VIS;
      var visX=ball.x+Math.cos(ang)*aimVis, visY=ball.y+Math.sin(ang)*aimVis;
      var grad=ctx.createLinearGradient(ball.x,ball.y,visX,visY);
      grad.addColorStop(0,'rgba(255,255,255,.65)'); grad.addColorStop(1,'rgba(255,255,255,0)');
      ctx.setLineDash([5,6]); ctx.strokeStyle=grad; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(ball.x,ball.y); ctx.lineTo(visX,visY); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='rgba(0,0,0,.4)'; ctx.fillRect(ball.x-24,ball.y+22,48,6);
      ctx.fillStyle=v.p>0.92?'#e0435f':'#e8c94a'; ctx.fillRect(ball.x-24,ball.y+22,48*v.p,6);
    }
    function drawHUD(){
      ctx.fillStyle='rgba(10,10,12,.75)'; ctx.fillRect(10,10,W2-20,38);
      ctx.strokeStyle='#e8c94a'; ctx.lineWidth=2; ctx.strokeRect(10,10,W2-20,38);
      ctx.textAlign='left'; ctx.fillStyle='#fff'; ctx.font='800 13px Rubik,Arial';
      ctx.fillText('Coup '+(strokes+ (state==='choose'||state==='aim'?1:0))+' - '+(club==='iron'?'Fer':'Putter'),22,33);
      ctx.textAlign='right'; ctx.fillStyle='#e8c94a'; ctx.font='900 15px Impact,Arial Black,Helvetica';
      var d=Math.round(Math.hypot(ball.x-GX,ball.y-HOLE_Y2)*0.35);
      ctx.fillText(d+' m',W2-22,35);
    }
    function drawFloat(dt){
      for(var i=floatTxt.length-1;i>=0;i--){
        var f=floatTxt[i]; f.t+=dt; if(f.t>1.1){floatTxt.splice(i,1);continue;}
        ctx.globalAlpha=1-f.t/1.1; ctx.textAlign='center'; ctx.font='900 '+(20+f.t*8)+'px Impact,Arial Black,Helvetica';
        ctx.lineWidth=3.5; ctx.strokeStyle='#0a0a0a'; ctx.strokeText(f.txt,f.x,f.y-f.t*44); ctx.fillStyle='#e8c94a'; ctx.fillText(f.txt,f.x,f.y-f.t*44);
      }
      ctx.globalAlpha=1;
    }

    var last=performance.now();
    function frame(now){
      if(closed)return;
      var dt=Math.min(0.033,(now-last)/1000); last=now;
      var h=0;
      if(state==='flight'){
        flight.t+=dt; var ft=Math.min(1,flight.t/flight.dur);
        ball.x=flight.x0+(flight.x1-flight.x0)*ft; ball.y=flight.y0+(flight.y1-flight.y0)*ft;
        h=4*FLIGHT_H*ft*(1-ft); shotTime+=dt;
        if(ft>=1){
          sndPlop();
          ball.vx=Math.cos(flight.ang)*flight.rollSpeed; ball.vy=Math.sin(flight.ang)*flight.rollSpeed;
          state='roll'; flight=null;
        }
      } else if(state==='roll'){
        var n=4; for(var i=0;i<n;i++)rollStep(dt/n);
        shotTime+=dt;
        var speed=Math.hypot(ball.vx,ball.vy);
        var oob=!inBounds(ball.x,ball.y);
        if(scored&&shotTime>0.08){ resultTimer+=dt; }
        if(oob||shotTime>6||(scored&&resultTimer>0.9)||(!scored&&speed<4&&shotTime>0.2)){
          state='result'; resultTimer=0;
          if(!scored){ floatTxt.push({x:ball.x,y:ball.y-10,t:0,txt: oob?'HORS LIMITE !':'ARRETEE'}); }
        }
      } else if(state==='result'){
        resultTimer+=dt;
        if(resultTimer>0.9){
          if(holed){ finish(); return; }
          if(strokes>=MAX_STROKES){ totalPts=0; finish(); return; }
          showClubChoice();
        }
      }
      ctx.setTransform(scale*dpr,0,0,scale*dpr,0,0);
      drawScene(); drawHole();
      if(state==='aim')drawAim();
      drawBallSprite(ball.x,ball.y,h);
      drawHUD(); drawFloat(dt);
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);

    function finish(){
      cancelAnimationFrame(raf); var end=root.querySelector('.mg-end');
      var title=holed?(strokes===1?'Trou en un !!':(strokes===2?'Birdie !':(strokes===3?'Par, joli trou !':(strokes===4?'Bogey, pas mal !':'Trou termine')))):'Trou non termine';
      end.innerHTML='<div class="mg-endcard"><div class="mg-endtitle">'+title+'</div>'+
        '<div class="mg-endscore">+'+totalPts+'<small> pts</small></div>'+
        '<div class="mg-endsub">'+(holed?('En '+strokes+' coup'+(strokes>1?'s':'')):'')+'</div>'+
        '<button class="btn big puttbtn" id="pgok">Continuer</button></div>';
      end.style.display='flex';
      if(holed && strokes<=2)FX.fireworks(strokes===1?3000:1500);
      if(window.gsap)gsap.fromTo(end.firstChild,{scale:.5,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(2)'});
      end.querySelector('#pgok').onclick=close;
    }
    function close(){
      if(closed)return; closed=true; cancelAnimationFrame(raf); window.removeEventListener('resize',resize);
      if(root.parentNode)root.parentNode.removeChild(root);
      cfg.onDone&&cfg.onDone(totalPts,strokes);
    }
    root.querySelector('.mg-skip').onclick=function(){ if(!closed){ holed=false; totalPts=0; finish(); } };
  }

  return {open:open, openHole:openHole};
})();
