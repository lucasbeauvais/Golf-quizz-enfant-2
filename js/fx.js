/* ============================================================
   GRANDES ANIMATIONS EN OVERLAY (GSAP + canvas-confetti)
   - shot      : birdie (putt) ou super coup (drive), a chaque bonne reponse
   - foam      : serie de 3 -> celebration + confettis + 1 bonus
   - fire      : serie de 5 -> balle en feu, points x2
   - wrong     : tampon "RATE"
   - flyPoints : le score qui vole jusqu'au compteur
   - fireworks : feu d'artifice (sans-faute)
   ============================================================ */
var FX = (function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasConf = typeof window.confetti === 'function';
  var COLORS = ['#5fd66a','#e8c94a','#e0435f','#4a86e0','#ffffff','#8a63c9'];
  var FIRE = ['#e8c94a','#ff9f1c','#d97a2e','#e0435f','#fff3b0'];

  function stage(cls){
    var el=document.createElement('div'); el.className='fxstage '+(cls||''); document.body.appendChild(el); return el;
  }
  function kill(el){ if(el&&el.parentNode)el.parentNode.removeChild(el); }
  function conf(opts){ if(hasConf&&!reduce)window.confetti(opts); }
  function confAt(x,y,opts){
    opts=opts||{}; opts.origin={x:x/window.innerWidth,y:y/window.innerHeight};
    if(!opts.colors)opts.colors=COLORS; if(!opts.zIndex)opts.zIndex=90; conf(opts);
  }
  function skippable(el,tl){ el.addEventListener('pointerdown',function(){ tl.progress(1); }); }

  /* ---------- panneaux SVG (birdie / super coup) ---------- */
  function puttPanel(){
    return '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">'+
      '<defs><linearGradient id="fxsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3f4"/><stop offset="1" stop-color="#c7ecfa"/></linearGradient></defs>'+
      '<rect width="400" height="260" fill="url(#fxsky)"/>'+
      '<rect y="140" width="400" height="120" fill="#6fa83a"/>'+
      '<ellipse cx="280" cy="150" rx="150" ry="80" fill="#9ad35f"/>'+
      '<ellipse cx="280" cy="150" rx="150" ry="80" fill="none" stroke="#7cb342" stroke-width="3"/>'+
      '<g class="fx-flag">'+
        '<line x1="300" y1="122" x2="300" y2="72" stroke="#c7c8ce" stroke-width="3"/>'+
        '<path d="M300 72 l 26 8 l -26 8 z" fill="#e0435f"/>'+
        '<ellipse cx="300" cy="124" rx="8" ry="4" fill="#12261a"/>'+
      '</g>'+
      '<g class="fx-ball"><ellipse cx="0" cy="3" rx="9" ry="3.6" fill="#000" opacity=".25"/><circle r="8" fill="#fff" stroke="#b7b7a6" stroke-width="1.4"/></g>'+
      '<g class="fx-word" transform="translate(200,205)"><text text-anchor="middle" font-family="Impact,Arial Black,Helvetica" font-size="40" fill="#e8c94a" stroke="#0a0a0a" stroke-width="3" paint-order="stroke">BIRDIE !</text></g>'+
      '</svg>';
  }
  function drivePanel(){
    return '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">'+
      '<defs><linearGradient id="fxsky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb0e8"/><stop offset="1" stop-color="#bfe6fb"/></linearGradient></defs>'+
      '<rect width="400" height="260" fill="url(#fxsky2)"/>'+
      '<rect y="210" width="400" height="50" fill="#6fa83a"/>'+
      '<circle cx="330" cy="55" r="26" fill="#fff3b0" opacity=".85"/>'+
      '<g class="fx-ball"><ellipse cx="60" cy="213" rx="9" ry="3.6" fill="#000" opacity=".2"/><circle cx="60" cy="205" r="8" fill="#fff" stroke="#b7b7a6" stroke-width="1.4"/></g>'+
      '<g class="fx-trail" stroke="#fff" stroke-width="3" stroke-dasharray="7 8" opacity="0" fill="none"><path d="M60 205 Q170 40 340 60"/></g>'+
      '<g class="fx-word" transform="translate(200,225)"><text text-anchor="middle" font-family="Impact,Arial Black,Helvetica" font-size="34" fill="#e8c94a" stroke="#0a0a0a" stroke-width="3" paint-order="stroke">SUPER COUP !</text></g>'+
      '</svg>';
  }
  function eaglePanel(){
    return '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">'+
      '<defs><radialGradient id="fxeg" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#bff0c9"/><stop offset="1" stop-color="#6fa83a"/></radialGradient></defs>'+
      '<rect width="400" height="260" fill="url(#fxeg)"/>'+
      '<ellipse cx="200" cy="150" rx="180" ry="95" fill="#9ad35f"/>'+
      '<ellipse cx="200" cy="150" rx="180" ry="95" fill="none" stroke="#7cb342" stroke-width="3"/>'+
      '<g class="fx-flag">'+
        '<line x1="220" y1="122" x2="220" y2="66" stroke="#c7c8ce" stroke-width="3.4"/>'+
        '<path d="M220 66 l 30 9 l -30 9 z" fill="#e8c94a"/>'+
        '<ellipse cx="220" cy="124" rx="9" ry="4.4" fill="#12261a"/>'+
      '</g>'+
      '<g class="fx-ball"><ellipse cx="0" cy="3" rx="10" ry="4" fill="#000" opacity=".25"/><circle r="9" fill="#fff" stroke="#b7b7a6" stroke-width="1.4"/></g>'+
      '<g class="fx-word" transform="translate(200,220)"><text text-anchor="middle" font-family="Impact,Arial Black,Helvetica" font-size="48" fill="#e8c94a" stroke="#0a0a0a" stroke-width="3.5" paint-order="stroke">EAGLE !</text></g>'+
      '</svg>';
  }

  /* ---------- 1. BONNE REPONSE : birdie / super coup / eagle (serie x3+) ---------- */
  function shot(kind,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-dim');
    el.innerHTML='<div class="fxpanel">'+(kind==='drive'?drivePanel():(kind==='eagle'?eaglePanel():puttPanel()))+'</div>';
    var panel=el.firstChild, svgRoot=panel.querySelector('svg');
    var ball=svgRoot.querySelector('.fx-ball'), word=svgRoot.querySelector('.fx-word'), flag=svgRoot.querySelector('.fx-flag');
    var tl=gsap.timeline({onComplete:function(){kill(el);done&&done();}});
    sndWhoosh();
    tl.fromTo(el,{opacity:0},{opacity:1,duration:.15})
      .fromTo(panel,{scale:.4,y:80,rotation:-4},{scale:1,y:0,rotation:0,duration:.4,ease:'back.out(1.8)'},0);
    if(kind==='drive'){
      var trail=svgRoot.querySelector('.fx-trail');
      tl.fromTo(ball,{x:0,y:0,scale:1},{x:280,y:-150,scale:.35,duration:1.05,ease:'power1.out'},.35)
        .to(trail,{opacity:.7,duration:.3},.4)
        .call(function(){ sndPlop(); var r=panel.getBoundingClientRect(); confAt(r.left+r.width*0.82,r.top+r.height*0.28,{particleCount:60,spread:80,startVelocity:30,scalar:.9}); },null,1.2);
    } else {
      var bx=(kind==='eagle')?220:300, by=124;
      tl.fromTo(ball,{x:-160,y:70,scale:1},{x:bx-140,y:by-100,scale:.15,duration:.85,ease:'power2.in'},.3)
        .call(function(){ sndPlop(); if(flag)gsap.fromTo(flag,{rotation:0},{rotation:-10,duration:.12,yoyo:true,repeat:5,ease:'sine.inOut',transformOrigin:'50% 100%'}); var r=panel.getBoundingClientRect(); confAt(r.left+r.width*(kind==='eagle'?0.55:0.75),r.top+r.height*0.45,{particleCount:kind==='eagle'?110:70,spread:85,startVelocity:32,scalar:.9}); },null,1.05);
    }
    tl.fromTo(word,{scale:0,opacity:0,rotation:-10},{scale:1,opacity:1,rotation:-3,duration:.5,ease:'back.out(2.4)'},kind==='drive'?1.25:1.15)
      .call(function(){ sndCheer(); },null,'-=0.3')
      .to(panel,{scale:.62,y:-60,opacity:0,duration:.3,ease:'power2.in'},'+=0.55')
      .to(el,{opacity:0,duration:.2},'-=0.1');
    skippable(el,tl);
  }

  /* ---------- 2. SERIE DE 3 : celebration + confettis ---------- */
  function foam(streakN,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-arena');
    el.innerHTML=
      '<div class="fx-flash"></div>'+
      '<div class="fx-title"><b>SERIE x'+streakN+' !</b><span>'+streakN+' bonnes reponses d\'affilee</span></div>';
    var q=function(s){return el.querySelector(s);};
    var tl=gsap.timeline({onComplete:function(){kill(el);done&&done();}});
    sndBoom(); setTimeout(sndHorn,250); setTimeout(sndCheer,400);
    tl.fromTo(el,{opacity:0},{opacity:1,duration:.12})
      .fromTo(q('.fx-flash'),{opacity:.95},{opacity:0,duration:.5,ease:'power2.out'},0)
      .fromTo(q('.fx-title'),{scale:0,rotation:-15},{scale:1,rotation:-4,duration:.8,ease:'elastic.out(1,.45)'},0.2)
      .to(q('.fx-title'),{rotation:0,duration:.4,ease:'sine.inOut'},1.1)
      .call(function(){
        confAt(0,window.innerHeight*0.8,{particleCount:120,angle:60,spread:60,startVelocity:70});
        confAt(window.innerWidth,window.innerHeight*0.8,{particleCount:120,angle:120,spread:60,startVelocity:70});
      },null,0.3)
      .call(function(){ confAt(window.innerWidth/2,window.innerHeight*0.42,{particleCount:90,spread:360,startVelocity:38,shapes:['star'],colors:['#e8c94a','#fff3b0']}); },null,1.0)
      .to(q('.fx-title'),{scale:0,opacity:0,duration:.3,ease:'power2.in'},2.4)
      .to(el,{opacity:0,duration:.2},2.6);
    skippable(el,tl);
  }

  /* ---------- 3. SERIE DE 5 : EN FEU ---------- */
  function fire(streakN,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-fire');
    el.innerHTML='<div class="fx-flash hot"></div>'+
      '<svg class="fx-fireball" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">'+
        '<path d="M100 10 Q140 60 120 100 Q160 90 150 140 Q170 180 100 210 Q30 180 50 140 Q40 90 80 100 Q60 60 100 10 Z" fill="#ff9f1c"/>'+
        '<path d="M100 60 Q120 90 108 115 Q135 108 128 140 Q138 165 100 180 Q62 165 72 140 Q65 108 92 115 Q80 90 100 60 Z" fill="#ffd23f"/>'+
        '<circle cx="100" cy="150" r="34" fill="#fff" stroke="#b7b7a6" stroke-width="2"/>'+
      '</svg>'+
      '<div class="fx-title fire"><b>EN FEU !</b><span>Serie x'+streakN+' : tes points comptent double !</span></div>';
    var q=function(s){return el.querySelector(s);};
    var card=document.querySelector('.card');
    var tl=gsap.timeline({onComplete:function(){kill(el);if(card)gsap.set(card,{x:0});done&&done();}});
    sndBoom(); setTimeout(sndCheer,200); setTimeout(sndHorn,500);
    tl.fromTo(el,{opacity:0},{opacity:1,duration:.12})
      .fromTo(q('.fx-flash'),{opacity:1},{opacity:0,duration:.6},0)
      .fromTo(q('.fx-fireball'),{scale:.1,y:300,rotation:-200},{scale:1,y:0,rotation:0,duration:.8,ease:'back.out(1.4)'},0)
      .to(q('.fx-fireball'),{scale:1.08,duration:.2,yoyo:true,repeat:7,ease:'sine.inOut'},0.8)
      .fromTo(q('.fx-title'),{scale:3,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power4.in'},0.5)
      .call(function(){ if(card)gsap.fromTo(card,{x:-10},{x:10,duration:.05,repeat:7,yoyo:true,onComplete:function(){gsap.set(card,{x:0});}}); },null,0.9)
      .call(function(){ var n=0,iv=setInterval(function(){ confAt(Math.random()*window.innerWidth,window.innerHeight,{particleCount:40,angle:90,spread:40,startVelocity:55,colors:FIRE,gravity:1.2}); if(++n>5)clearInterval(iv); },180); },null,0.6)
      .to([q('.fx-fireball'),q('.fx-title')],{scale:0,opacity:0,duration:.35,ease:'power2.in'},2.5)
      .to(el,{opacity:0,duration:.2},2.75);
    skippable(el,tl);
  }

  /* ---------- 4. MAUVAISE REPONSE ---------- */
  function wrong(){
    sndBad();
    if(reduce||!hasGsap)return;
    var el=stage('fx-pass');
    el.innerHTML='<div class="fx-stamp">RATE !</div>';
    var s=el.firstChild;
    gsap.timeline({onComplete:function(){kill(el);}})
      .fromTo(s,{scale:3.5,opacity:0,rotation:-25},{scale:1,opacity:1,rotation:-12,duration:.28,ease:'power4.in'})
      .to(s,{opacity:0,y:-30,duration:.35,delay:.45});
  }

  /* ---------- 5. LE SCORE QUI VOLE JUSQU'AU COMPTEUR ---------- */
  function flyPoints(text,targetEl,onArrive){
    if(reduce||!hasGsap||!targetEl){ onArrive&&onArrive(); return; }
    var el=stage('fx-pass'); el.innerHTML='<div class="fx-pts">'+text+'</div>';
    var p=el.firstChild, t=targetEl.getBoundingClientRect();
    var cx=window.innerWidth/2, cy=window.innerHeight*0.4;
    gsap.set(p,{x:cx,y:cy,xPercent:-50,yPercent:-50});
    gsap.timeline({onComplete:function(){kill(el);}})
      .fromTo(p,{scale:0,rotation:-20},{scale:1.4,rotation:6,duration:.4,ease:'back.out(3)'})
      .to(p,{x:t.left+t.width/2,y:t.top+t.height/2,scale:.4,rotation:0,duration:.5,ease:'power3.in'},'+=0.12')
      .call(function(){ onArrive&&onArrive(); gsap.fromTo(targetEl,{scale:1.7},{scale:1,duration:.5,ease:'elastic.out(1,.4)'}); confAt(t.left+t.width/2,t.top+t.height/2,{particleCount:22,spread:70,startVelocity:18,scalar:.6}); })
      .to(p,{opacity:0,duration:.1});
  }

  /* ---------- 6. FEU D'ARTIFICE (sans-faute) ---------- */
  function fireworks(ms){
    if(reduce||!hasConf)return;
    var end=Date.now()+(ms||2500);
    (function frame(){
      confAt(Math.random()*window.innerWidth,Math.random()*window.innerHeight*0.5,{particleCount:50,spread:360,startVelocity:28,ticks:70,gravity:.8});
      if(Date.now()<end)setTimeout(frame,260);
    })();
    sndCheer();
  }

  return {shot:shot,foam:foam,fire:fire,wrong:wrong,flyPoints:flyPoints,fireworks:fireworks,confAt:confAt,reduce:reduce};
})();
