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

  /* ---------- panneaux photo (birdie / super coup / eagle) ---------- */
  var SCENE_IMG={putt:'assets/fx/fx_birdie_scene.jpg',drive:'assets/fx/fx_drive_scene.jpg',eagle:'assets/fx/fx_eagle_scene.jpg'};
  var SCENE_WORD={putt:'BIRDIE !',drive:'SUPER COUP !',eagle:'EAGLE !'};
  var SCENE_CONF={putt:{x:.52,y:.6},drive:{x:.64,y:.26},eagle:{x:.5,y:.58}};
  function scenePanel(kind){
    return '<div class="fxphoto"><img src="'+SCENE_IMG[kind]+'" alt=""><div class="fx-word"><b>'+SCENE_WORD[kind]+'</b></div></div>';
  }

  /* ---------- 1. BONNE REPONSE : birdie / super coup / eagle (occasionnel) ---------- */
  function shot(kind,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-dim');
    el.innerHTML='<div class="fxpanel">'+scenePanel(kind)+'</div>';
    var panel=el.firstChild, img=panel.querySelector('img'), word=panel.querySelector('.fx-word');
    var tl=gsap.timeline({onComplete:function(){kill(el);done&&done();}});
    sndWhoosh();
    var f=SCENE_CONF[kind];
    tl.fromTo(el,{opacity:0},{opacity:1,duration:.15})
      .fromTo(panel,{scale:.4,y:80,rotation:-4},{scale:1,y:0,rotation:0,duration:.4,ease:'back.out(1.8)'},0)
      .fromTo(img,{scale:1.14},{scale:1,duration:1.15,ease:'power2.out'},0)
      .call(function(){ sndPlop(); var r=panel.getBoundingClientRect(); confAt(r.left+r.width*f.x,r.top+r.height*f.y,{particleCount:kind==='eagle'?100:65,spread:85,startVelocity:30,scalar:.9}); },null,.55)
      .fromTo(word,{scale:0,opacity:0,rotation:-10},{scale:1,opacity:1,rotation:-3,duration:.5,ease:'back.out(2.4)'},.65)
      .call(function(){ sndCheer(); },null,'-=0.3')
      .to(panel,{scale:.62,y:-60,opacity:0,duration:.3,ease:'power2.in'},'+=0.7')
      .to(el,{opacity:0,duration:.2},'-=0.1');
    skippable(el,tl);
  }

  /* ---------- 2. SERIE DE 3 : celebration + confettis ---------- */
  function foam(streakN,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-arena');
    el.innerHTML=
      '<div class="fx-flash"></div>'+
      '<img class="fx-burst-img" src="assets/fx/fx_burst.jpg" alt="">'+
      '<div class="fx-title"><b>SERIE x'+streakN+' !</b><span>'+streakN+' bonnes reponses d\'affilee</span></div>';
    var q=function(s){return el.querySelector(s);};
    var tl=gsap.timeline({onComplete:function(){kill(el);done&&done();}});
    sndBoom(); setTimeout(sndHorn,250); setTimeout(sndCheer,400);
    tl.fromTo(el,{opacity:0},{opacity:1,duration:.12})
      .fromTo(q('.fx-flash'),{opacity:.95},{opacity:0,duration:.5,ease:'power2.out'},0)
      .fromTo(q('.fx-burst-img'),{scale:0,rotation:-30,opacity:0},{scale:1,rotation:0,opacity:.9,duration:.7,ease:'back.out(1.6)'},0.05)
      .fromTo(q('.fx-title'),{scale:0,rotation:-15},{scale:1,rotation:-4,duration:.8,ease:'elastic.out(1,.45)'},0.2)
      .to(q('.fx-title'),{rotation:0,duration:.4,ease:'sine.inOut'},1.1)
      .call(function(){
        confAt(0,window.innerHeight*0.8,{particleCount:120,angle:60,spread:60,startVelocity:70});
        confAt(window.innerWidth,window.innerHeight*0.8,{particleCount:120,angle:120,spread:60,startVelocity:70});
      },null,0.3)
      .call(function(){ confAt(window.innerWidth/2,window.innerHeight*0.42,{particleCount:90,spread:360,startVelocity:38,shapes:['star'],colors:['#e8c94a','#fff3b0']}); },null,1.0)
      .to([q('.fx-title'),q('.fx-burst-img')],{scale:0,opacity:0,duration:.3,ease:'power2.in'},2.4)
      .to(el,{opacity:0,duration:.2},2.6);
    skippable(el,tl);
  }

  /* ---------- 3. SERIE DE 5 : EN FEU ---------- */
  function fire(streakN,done){
    if(reduce||!hasGsap){ done&&done(); return; }
    var el=stage('fx-fire');
    el.innerHTML='<div class="fx-flash hot"></div>'+
      '<img class="fx-fireball" src="assets/fx/fx_fireball.jpg" alt="">'+
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
