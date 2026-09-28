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
      var stopX=ball.x+Math.cos(ang)*dist, stopY=ball.y+Math.sin(ang)*dist;
      ctx.setLineDash([5,6]); ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(ball.x,ball.y); ctx.lineTo(stopX,stopY); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(stopX,stopY,4,0,Math.PI*2); ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.stroke();
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
  return {open:open};
})();
