/* ============================================================
   MOTEUR DU QUIZ
   Chaque bonne reponse = +3 points (un peu comme un swing reussi).
   Serie de 3  -> petite celebration.
   Serie de 5  -> EN FEU : les reponses valent +6 tant que la serie continue.
   Les etoiles (0 a 3 par etape) restent basees sur le nombre de
   bonnes reponses, comme avant ; les points sont un score en plus,
   avec un record par etape et un total en carriere.
   ============================================================ */
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
var reduceMotion=FX.reduce;
function doShake(){ if(reduceMotion)return; var c=document.getElementById('card'); if(c){c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');} }
function floatPlusOne(target){
  if(reduceMotion || !target) return;
  var r=target.getBoundingClientRect();
  var s=document.createElement('div'); s.className='pluspop'; s.textContent='+1';
  s.style.cssText='position:fixed;z-index:61;font-family:Rubik,sans-serif;font-weight:800;font-size:22px;color:var(--green);text-shadow:0 2px 0 var(--outline);pointer-events:none;left:'+(r.left+r.width/2-16)+'px;top:'+(r.top+6)+'px;animation:plusFloat .9s ease-out forwards';
  document.body.appendChild(s);
  setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},950);
}

/* ===== SAUVEGARDE ===== */
var SAVE_KEY='golf_academy_tiger_v2';
var LEGACY_SAVE_KEYS=['golf_academy_tiger_v1','golf_academy_rina_v1','golf_drapeaux_v6'];
var profile=null;
function blankProfile(){return {name:'',avatar:'a1',background:null,stars:{vert:0,rouge:0,bleu:0,jaune:0,blanc:0},best:{vert:0,rouge:0,bleu:0,jaune:0,blanc:0},
  bestPts:{vert:0,rouge:0,bleu:0,jaune:0,blanc:0,all:0},careerPts:0,played:0,muted:false,createdAt:Date.now()};}
function loadSave(){
  try{
    var s=localStorage.getItem(SAVE_KEY);
    if(s) return JSON.parse(s);
    for(var i=0;i<LEGACY_SAVE_KEYS.length;i++){
      var old=localStorage.getItem(LEGACY_SAVE_KEYS[i]);
      if(old){ var o=JSON.parse(old); var p=blankProfile();
        p.name=o.name||''; p.avatar=o.avatar||'a1';
        if(o.stars) p.stars=o.stars; if(o.best) p.best=o.best; p.played=o.played||0;
        if(typeof o.muted==='boolean') p.muted=o.muted;
        return p;
      }
    }
    return null;
  }catch(e){return null;}
}
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(profile));}catch(e){}}
function totalStars(){var t=0;for(var i=0;i<FLAG_ORDER.length;i++)t+=(profile.stars[FLAG_ORDER[i]]||0);return t;}
function rankName(){var t=totalStars(); if(t>=15)return'Legende de Coach Tiger'; if(t>=12)return'Champion du club'; if(t>=8)return'Pro en herbe'; if(t>=4)return'Espoir du parcours'; return'Bourgeon du practice';}

/* ============================================================
   DOM racine
   ============================================================ */
var view=document.getElementById('view');
var progWrap=document.getElementById('prog');
var progTxt=document.getElementById('progtxt');
var progBar=document.getElementById('progbar');
function hideProg(){progWrap.style.display='none';document.getElementById('quitbtn').style.display='none';}
function showProg(){progWrap.style.display='block';document.getElementById('quitbtn').style.display='flex';}
function setView(html){ view.innerHTML='<div class="fadein">'+html+'</div>'; }
function topbarGradFor(flag){
  if(flag==='all') return 'linear-gradient(120deg,#1f9d55,#c81d25 28%,#1f6feb 52%,#eab308 76%,#c8cdc6)';
  return FLAGS[flag].grad;
}
function setTopbarTheme(flag){
  var tb=document.querySelector('.topbar'); if(!tb) return;
  if(!flag){ tb.style.background=''; tb.classList.remove('topbar-light'); return; }
  tb.style.background=topbarGradFor(flag);
  tb.classList.toggle('topbar-light', flag==='jaune'||flag==='blanc');
}
function applyBackground(){
  var bg=profile.background?bgById(profile.background):null;
  var el=document.getElementById('bgphoto'), card=document.getElementById('card');
  if(bg){
    el.style.backgroundImage='url(assets/backgrounds/'+bg.file+')';
    el.classList.add('show');
    document.body.classList.add('has-bgphoto');
    if(card)card.classList.add('see-bg');
  } else {
    el.classList.remove('show');
    document.body.classList.remove('has-bgphoto');
    if(card)card.classList.remove('see-bg');
  }
}

function askQuit(){
  if(document.querySelector('.quitask'))return;
  var el=document.createElement('div'); el.className='quitask';
  el.innerHTML='<div class="quitcard"><b>Quitter ce trou ?</b><p>Les points de cette manche ne seront pas gardes.</p>'+
    '<div class="quitrow"><button class="btn ghost" id="qno">Continuer</button><button class="btn" id="qyes">Quitter</button></div></div>';
  document.body.appendChild(el);
  if(window.gsap&&!reduceMotion)gsap.from(el.firstChild,{scale:.8,opacity:0,duration:.25,ease:'back.out(2)'});
  function close(){if(el.parentNode)el.parentNode.removeChild(el);}
  el.onclick=function(e){if(e.target===el)close();};
  el.querySelector('#qno').onclick=close;
  el.querySelector('#qyes').onclick=function(){ close(); sndClick(); screenHome(); };
}
document.getElementById('quitbtn').onclick=function(){ sndClick(); askQuit(); };
document.getElementById('mutebtn').onclick=function(){
  ensureAudio(); profile.muted=!profile.muted; persist(); updateMuteBtn();
  if(!profile.muted) sndClick();
};

/* ============================================================
   ECRAN PROFIL (nom + avatars + club house, le tout au meme endroit)
   ============================================================ */
function screenProfile(){
  hideProg(); setTopbarTheme(null);
  var onboarding=!profile.name;
  var avGrid='';
  for(var i=0;i<MASCOTS.length;i++){
    var m=MASCOTS[i], unlocked=mascotUnlocked(m), sel=(m.id===profile.avatar);
    if(unlocked){
      avGrid+='<button class="mascot'+(sel?' sel':'')+'" data-av="'+m.id+'">'+avatarSVG(m.id,46)+
        '<div class="mtx"><b>'+m.name+'</b><span>'+(sel?'Equipe':'Toucher pour equiper')+'</span></div></button>';
    } else {
      avGrid+='<div class="mascot locked">'+avatarSVG(m.id,46)+'<div class="mtx"><b>'+m.name+'</b><span>&nbsp;</span></div>'+
        '<div class="mlock">'+lockSVG()+m.need+' etoiles</div></div>';
    }
  }
  var bgGrid='<button class="bgcard'+(!profile.background?' sel':'')+'" data-bg="">'+
    '<div style="width:100%;height:118px;display:flex;align-items:center;justify-content:center;background:var(--panel3);color:var(--inkSoft);font-size:26px">&#8709;</div>'+
    '<div class="bgname">Fond par defaut</div>'+
    (!profile.background?'<div class="bgsel-tag">Equipe</div>':'')+
    '</button>';
  for(var bi=0;bi<BACKGROUNDS.length;bi++){
    var b=BACKGROUNDS[bi], bunlocked=bgUnlocked(b), bsel=(profile.background===b.id);
    if(bunlocked){
      bgGrid+='<button class="bgcard'+(bsel?' sel':'')+'" data-bg="'+b.id+'">'+
        '<img src="assets/backgrounds/'+b.file+'" alt="">'+
        '<div class="bgname">'+b.name+'</div>'+
        (bsel?'<div class="bgsel-tag">Equipe</div>':'')+
        '</button>';
    } else {
      bgGrid+='<div class="bgcard locked">'+
        '<img src="assets/backgrounds/'+b.file+'" alt="">'+
        '<div class="bgname">'+b.name+'</div>'+
        '<div class="bglock">'+lockSVG('#e8c94a')+'<span>'+b.need+' points en carriere</span></div>'+
        '</div>';
    }
  }
  setView(
    '<div class="body">'+decorBanner()+'<div class="pad profile">'+
      '<h1>'+(onboarding?'Cree ton golfeur':'Mon profil')+'</h1>'+
      tigerCoach('happy',70, onboarding
        ? 'Salut, moi c\'est <b>Tiger</b> ! Je vais t\'entrainer aux regles et a la politesse du golf. Comment tu t\'appelles ?'
        : 'Tu as '+totalStars()+' / 15 etoiles et '+(profile.careerPts||0)+' points en carriere. Continue a jouer pour tout debloquer !')+
      '<label class="lbl">Ton prenom</label>'+
      '<input id="pname" class="nameinput" maxlength="14" placeholder="Ecris ton prenom" value="'+esc(profile.name)+'">'+
      '<div class="sectitle">Ton avatar</div>'+
      '<div class="mascotgrid">'+avGrid+'</div>'+
      '<div class="sectitle">Club house</div>'+
      '<div class="bggrid">'+bgGrid+'</div>'+
      '<button class="btn big" id="go" style="margin-top:18px">'+(onboarding?'C\'est parti !':'Retour a l\'accueil')+'</button>'+
      (totalStars()>0?'<button class="btn ghost big" id="resetBtn" style="margin-top:22px;border-color:var(--ko);color:var(--ko)">Reinitialiser ma progression</button>':'')+
    '</div></div>'
  );
  var avOpts=view.querySelectorAll('.mascot[data-av]');
  for(var k=0;k<avOpts.length;k++){avOpts[k].onclick=function(){
    sndClick(); profile.avatar=this.getAttribute('data-av'); persist(); screenProfile();
  };}
  var bgOpts=view.querySelectorAll('.bgcard[data-bg]');
  for(var k2=0;k2<bgOpts.length;k2++){bgOpts[k2].onclick=function(){
    sndClick(); profile.background=this.getAttribute('data-bg')||null; persist(); applyBackground(); screenProfile();
  };}
  document.getElementById('go').onclick=function(){
    var v=(document.getElementById('pname').value||'').trim();
    if(!v){ var el=document.getElementById('pname'); el.focus(); el.classList.add('shake'); setTimeout(function(){el.classList.remove('shake');},450); return; }
    ensureAudio();
    profile.name=v; persist(); if(onboarding)sndGood(); screenHome();
  };
  var resetBtn=document.getElementById('resetBtn');
  if(resetBtn){
    var resetArmed=false, resetTimer=null;
    resetBtn.onclick=function(){
      sndClick();
      if(!resetArmed){
        resetArmed=true;
        this.textContent='Sur de toi ? Touche encore pour tout remettre a zero';
        var self=this;
        resetTimer=setTimeout(function(){resetArmed=false;self.textContent='Reinitialiser ma progression';},4000);
        return;
      }
      clearTimeout(resetTimer);
      var keep=profile.name;
      profile=blankProfile(); profile.name=keep;
      persist(); applyBackground();
      doShake();
      screenProfile();
    };
  }
}

/* ============================================================
   ECRAN ACCUEIL (carte des etapes)
   ============================================================ */
function nextStageToPlay(){
  for(var i=0;i<FLAG_ORDER.length;i++){var f=FLAG_ORDER[i]; if(stageUnlocked(f) && (profile.stars[f]||0)<3) return f;}
  return null;
}
function screenHome(){
  hideProg(); setTopbarTheme(null);
  var next=nextStageToPlay();
  var rows='';
  for(var i=0;i<FLAG_ORDER.length;i++){
    var f=FLAG_ORDER[i], L=FLAGS[f], unlocked=stageUnlocked(f);
    var rec=profile.best[f]?(' &middot; record '+profile.best[f]+'/5'):'';
    var stateCls=unlocked?'':' locked'; if(unlocked && f===next) stateCls+=' next';
    var node='<div class="node" style="background:'+(unlocked?L.grad:'linear-gradient(135deg,#cfd6d0,#a9b3ac)')+'">'+
        (unlocked?miniFlag('#ffffff'):'')+
      '</div>';
    if(!unlocked){
      node='<div class="node" style="background:linear-gradient(135deg,#cfd6d0,#a9b3ac)">'+
        '<div class="lockbadge">'+lockSVG('#fff')+'</div></div>';
    }
    rows+='<div class="stage'+stateCls+'" data-flag="'+f+'" data-unlocked="'+(unlocked?1:0)+'">'+
      node+
      '<div class="sinfo"><b>'+L.name+'</b><span>'+(unlocked?L.sub+rec:'Gagne 1 etoile a l\'etape precedente')+'</span>'+
      (unlocked?'<div class="sstars">'+starRow(profile.stars[f]||0)+'</div>':'')+
      '</div></div>';
  }
  var mixOn=mixUnlocked();
  var tigerMsg = next
    ? 'Direction le <b>'+FLAGS[next].name.toLowerCase()+'</b> ! Tu es pret ?'
    : 'Bravo, tu as debloque toutes les etapes ! Tente le Grand Melange.';
  var pcBgObj=profile.background?bgById(profile.background):null;
  var pcBg=pcBgObj?'<div class="pc-bg" style="background-image:url(assets/backgrounds/'+pcBgObj.file+')"></div>':'';
  var pcFooter=pcBgObj
    ? '<div class="pc-footer">Fond : <b>'+pcBgObj.name+'</b> &middot; changer</div>'
    : '<div class="pc-footer">Fond : <b>aucun</b> &middot; en choisir un</div>';
  setView(
    '<div class="body"><div class="pad home">'+
      '<button class="playercard big" id="pcard">'+pcBg+
        '<div class="pc-top"><div class="pc-av-wrap"><div class="pc-av">'+avatarSVG(profile.avatar,66)+'</div>'+
        '<div class="pc-lvl">'+levelBadge(totalStars(),32)+'</div></div>'+
        '<div class="pc-txt"><b>'+esc(profile.name)+'</b><span>'+rankName()+'</span><span class="pc-pts">'+(profile.careerPts||0)+' points en carriere</span></div>'+
        '<div class="pc-stars">'+starSVG(true,18)+totalStars()+' / 15</div></div>'+
        pcFooter+
      '</button>'+
      tigerCoach(next?'happy':'happy',56,tigerMsg)+
      '<div class="sectitle">Ton parcours en 5 etapes</div>'+
      '<div class="roadmap">'+rows+'</div>'+
      '<button class="mixcard" id="mix" '+(mixOn?'':'disabled')+'>'+
        '<span style="font-size:26px">'+(mixOn?'&#127942;':'&#128274;')+'</span>'+
        '<span class="mixtxt">Grand melange<span>'+(mixOn?'Toutes les etapes melangees - le defi ultime !':'Debloque en reussissant les 5 etapes')+'</span></span>'+
      '</button>'+
      '<div class="homebtns"><button class="btn big puttbtn" id="train">&#127967; Entrainement au putting</button>'+
      '<button class="btn gold big" id="edit">&#128100; Mon profil</button></div>'+
    '</div></div>'
  );
  var ms=view.querySelectorAll('.stage[data-unlocked="1"]');
  for(var k=0;k<ms.length;k++){ms[k].onclick=function(){sndClick();startRound(this.getAttribute('data-flag'));};}
  var locked=view.querySelectorAll('.stage.locked');
  for(var k2=0;k2<locked.length;k2++){locked[k2].onclick=function(){doShake();};}
  document.getElementById('mix').onclick=function(){ if(mixOn){sndClick();startRound('all');} else { doShake(); } };
  document.getElementById('train').onclick=function(){ sndClick(); Putting.open({title:'Entrainement',putts:practicePutts(),onDone:function(){screenHome();}}); };
  document.getElementById('edit').onclick=function(){sndClick();screenProfile();};
  document.getElementById('pcard').onclick=function(){sndClick();screenProfile();};
}

/* ============================================================
   JEU
   ============================================================ */
var TARGET=5, ROUND=5, order=[], current=0, score=0, points=0, results=[], answered=false, curFlag="vert";
var streak=0, maxStreak=0, shotCount=0, puttPts=0;
function startRound(flag){
  curFlag=flag;
  order=buildRound(flag);
  ROUND=order.length; current=0; score=0; points=0; results=[]; streak=0; maxStreak=0; shotCount=0; puttPts=0;
  bonusQ=pickBonus();
  setTopbarTheme(flag);
  showProg();
  renderQuestion();
}
function onFire(){ return streak>=5; }
function playHeader(){
  return '<div class="playbar"><div class="pb-av">'+avatarSVG(profile.avatar,30)+'</div>'+
    '<div class="pb-name">'+esc(profile.name)+'</div>'+
    '<div class="pb-score" id="pbscore">'+points+' pts</div>'+
    (streak>=2?'<div class="pb-streak'+(onFire()?' fire':'')+'" id="pbstreak">'+(onFire()?'&#128293; ':'')+'Serie x'+streak+'</div>':'')+'</div>';
}
function refreshBar(){
  var s=document.getElementById('pbscore'); if(s)s.textContent=points+' pts';
  var st=document.getElementById('pbstreak');
  if(streak>=2){
    var html='<div class="pb-streak'+(onFire()?' fire':'')+'" id="pbstreak">'+(onFire()?'&#128293; ':'')+'Serie x'+streak+'</div>';
    if(st)st.outerHTML=html; else { var bar=document.querySelector('.playbar'); if(bar)bar.insertAdjacentHTML('beforeend',html); }
  } else if(st){ st.remove(); }
}
function flagBadge(){
  if(curFlag==='all')return '<span class="leveldot"><i style="background:linear-gradient(90deg,#2e9e5b,#c81d25,#1f6feb,#eab308,#dfe3e0)"></i>Grand melange</span>';
  var L=FLAGS[curFlag];return '<span class="leveldot"><i style="background:'+L.color+'"></i>'+L.name+'</span>';
}
function renderQuestion(){
  answered=false;
  var qd=order[current];
  progTxt.textContent='Question '+(current+1)+' / '+ROUND;
  progBar.style.width=(current/ROUND*100)+'%';
  var refBadge=qd.ref?'<span class="badge ref">'+qd.ref+'</span>':'';
  var body;
  if(qd.type==='place'){
    body='<div class="tapzone" id="tapzone">'+qd.scene+'</div>'+
      '<div class="qtext">'+qd.q+'</div>'+
      '<div class="tapinstruct">&#128072; Touche directement l\'image pour repondre</div>';
  } else {
    var idx=shuffle([0,1,2,3].slice(0,qd.choices.length));
    var letters=['A','B','C','D'], ch='';
    for(var i=0;i<idx.length;i++){var oi=idx[i];ch+='<button class="choice" data-oi="'+oi+'"><span class="letter">'+letters[i]+'</span><span>'+qd.choices[oi]+'</span></button>';}
    body=(qd.scene||'')+'<div class="qtext">'+qd.q+'</div>'+'<div class="choices">'+ch+'</div>';
  }
  setView(
    '<div class="pad">'+playHeader()+
    '<div class="meta"><span class="badge theme">'+qd.theme+'</span>'+refBadge+flagBadge()+'</div>'+
    body+
    '<div class="tools"><button class="hintbtn" id="hintbtn"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10c.7.7 1 1.5 1 2h6c0-.5.3-1.3 1-2a6 6 0 0 0-4-10z"/></svg>Demande un tuyau a Tiger</button></div>'+
    '<div class="hintzone" id="hintzone"></div>'+
    '<div class="explain" id="explain"><div class="ebadge"></div><div class="ebubble"><b id="verdict"></b><span id="exptxt"></span></div></div>'+
    '<div class="nextrow" id="nextrow"><button class="btn" id="nextbtn"></button></div></div>'
  );
  if(qd.type==='place'){
    document.getElementById('tapzone').onclick=onScenePlace;
  } else {
    var btns=view.querySelectorAll('.choice');
    for(var b=0;b<btns.length;b++)btns[b].onclick=onAnswer;
  }
  document.getElementById('hintbtn').onclick=function(){
    sndClick();
    document.getElementById('hintzone').innerHTML=tigerCoach('happy',52,qd.hint);
    document.getElementById('hintzone').classList.add('show');
    this.style.opacity='.5'; this.disabled=true;
  };
}
/* les grosses celebrations plein ecran (serie x3, en feu x5) restent a chaque fois ;
   le petit ecran birdie/super coup n'arrive que de temps en temps pour ne pas saturer,
   les autres bonnes reponses ont juste un petit effet discret pres du score */
function celebrateGood(pts,milestone,done){
  var next=function(){ FX.flyPoints('+'+pts,document.getElementById('pbscore'),function(){refreshBar();}); done&&done(); };
  if(milestone==='fire'){ FX.fire(streak,next); return; }
  if(milestone==='foam'){ FX.foam(streak,next); return; }
  shotCount++;
  if(shotCount%3===0){
    FX.shot(shotCount%6===0?'drive':'putt',next);
  } else {
    var sc=document.getElementById('pbscore'), r=sc&&sc.getBoundingClientRect();
    if(r)FX.confAt(r.left+r.width/2,r.top+r.height/2,{particleCount:16,spread:55,startVelocity:18,scalar:.55});
    next();
  }
}
function finishAnswer(good,qd){
  results.push({ok:good,theme:qd.theme});
  var exp=document.getElementById('explain'); exp.className='explain show '+(good?'good':'bad');
  var vtxt,milestone=null,pts=0;
  if(good){
    streak++; if(streak>maxStreak)maxStreak=streak;
    pts=onFire()?6:3; points+=pts;
    if(streak%5===0)milestone='fire'; else if(streak%3===0)milestone='foam';
    sndGood();
    celebrateGood(pts,milestone);
    vtxt=(pts===6?'EN FEU, +6 ! ':'+'+pts+' ! ')+pick(GOOD);
    if(reduceMotion)refreshBar();
  } else {
    streak=0; doShake(); FX.wrong(); vtxt=pick(BAD);
    refreshBar();
  }
  exp.querySelector('.ebadge').outerHTML='<div class="ebadge">'+tigerCoach(good?'happy':'sad',52)+'</div>';
  document.getElementById('verdict').innerHTML=vtxt;
  document.getElementById('exptxt').textContent=qd.explain;
  var last=(current+1>=ROUND);
  var row=document.getElementById('nextrow');
  row.innerHTML=(milestone==='foam'?'<button class="btn puttbtn" id="bonusputt">&#127967; Putt bonus !</button>':'')+
    '<button class="btn" id="nextbtn">'+(last?(bonusQ?'Question bonus (culture golf)':'Green de practice'):'Question suivante')+'</button>';
  row.classList.add('show');
  var bp=document.getElementById('bonusputt');
  if(bp)bp.onclick=function(){
    sndClick();
    Putting.open({title:'Putt bonus',putts:[{x:0,dist:240,pts:2}],onDone:function(p){ puttPts+=p; points+=p; refreshBar(); bp.parentNode.removeChild(bp); }});
  };
  document.getElementById('nextbtn').onclick=function(){ sndClick(); if(!last){current++;renderQuestion();} else if(bonusQ){renderBonus();} else {screenPuttingGreen();} };
}
function onAnswer(){
  if(answered)return; answered=true;
  var qd=order[current];
  var chosen=parseInt(this.getAttribute('data-oi'),10);
  var good=(chosen===qd.correct);
  if(good)score++;
  var btns=view.querySelectorAll('.choice');
  for(var i=0;i<btns.length;i++){var oi=parseInt(btns[i].getAttribute('data-oi'),10);btns[i].setAttribute('disabled','disabled');if(oi===qd.correct)btns[i].className='choice correct';else if(btns[i]===this)btns[i].className='choice wrong';}
  if(good) floatPlusOne(this);
  finishAnswer(good,qd);
}
function onScenePlace(e){
  if(answered)return; answered=true;
  var qd=order[current];
  var zone=document.getElementById('tapzone');
  zone.classList.add('answered');
  var svgEl=zone.querySelector('svg');
  var rect=svgEl.getBoundingClientRect();
  var scale=rect.width/400;
  var px=e.clientX-rect.left, py=e.clientY-rect.top;
  var t=qd.target;
  var dist=Math.hypot(px/scale-t.x, py/scale-t.y);
  var good=dist<=t.r;
  if(good)score++;
  var mark=document.createElement('div');
  mark.className='tapmark '+(good?'good':'bad');
  mark.style.left=px+'px'; mark.style.top=py+'px';
  zone.appendChild(mark);
  if(!good){
    var d=t.r*2*scale;
    var tgt=document.createElement('div');
    tgt.className='taptarget';
    tgt.style.width=d+'px'; tgt.style.height=d+'px';
    tgt.style.left=(t.x*scale-d/2)+'px'; tgt.style.top=(t.y*scale-d/2)+'px';
    zone.appendChild(tgt);
  }
  if(good) floatPlusOne(mark);
  finishAnswer(good,qd);
}
function renderBonus(){
  var qd=bonusQ;
  progTxt.textContent='Culture golf'; progBar.style.width='100%';
  var idx=shuffle([0,1,2,3].slice(0,qd.choices.length)), letters=['A','B','C','D'], ch='';
  for(var i=0;i<idx.length;i++){var oi=idx[i];ch+='<button class="choice" data-oi="'+oi+'"><span class="letter">'+letters[i]+'</span><span>'+qd.choices[oi]+'</span></button>';}
  setView(
    '<div class="pad">'+playHeader()+
    '<div class="meta"><span class="badge theme" style="background:#8a6d1f">Bonus</span><span class="badge ref">Culture golf</span><span class="leveldot"><i style="background:#8a6d1f"></i>Pour le fun</span></div>'+
    cultureBanner('Une question rien que pour le plaisir - elle ne compte pas dans ton score !')+
    '<div class="qtext">'+qd.q+'</div>'+
    '<div class="choices">'+ch+'</div>'+
    '<div class="explain" id="explain"><div class="ebadge"></div><div class="ebubble"><b id="verdict"></b><span id="exptxt"></span></div></div>'+
    '<div class="nextrow" id="nextrow"><button class="btn" id="nextbtn">Green de practice</button></div></div>'
  );
  var btns=view.querySelectorAll('.choice');
  for(var b=0;b<btns.length;b++)btns[b].onclick=onBonusAnswer;
  document.getElementById('nextbtn').onclick=function(){sndClick();screenPuttingGreen();};
}
function onBonusAnswer(){
  var qd=bonusQ;
  var chosen=parseInt(this.getAttribute('data-oi'),10), good=(chosen===qd.correct);
  var btns=view.querySelectorAll('.choice');
  for(var i=0;i<btns.length;i++){var oi=parseInt(btns[i].getAttribute('data-oi'),10);btns[i].setAttribute('disabled','disabled');if(oi===qd.correct)btns[i].className='choice correct';else if(btns[i]===this)btns[i].className='choice wrong';}
  var exp=document.getElementById('explain'); exp.className='explain show '+(good?'good':'bad');
  if(good){ sndGood(); var r=(btns[0]&&btns[0].getBoundingClientRect())||{left:window.innerWidth/2,top:window.innerHeight*.3,width:0}; FX.confAt(r.left+r.width/2,r.top,{particleCount:60,spread:80,startVelocity:28}); } else { doShake(); FX.wrong(); }
  exp.querySelector('.ebadge').outerHTML='<div class="ebadge">'+tigerCoach(good?'happy':'sad',52)+'</div>';
  document.getElementById('verdict').textContent=good?'Un vrai champion de la culture golf !':'Pas grave, c\'etait juste pour le fun.';
  document.getElementById('exptxt').textContent=qd.explain;
  document.getElementById('nextrow').classList.add('show');
}

/* ============================================================
   TROU PAR 3 (mini-jeu en fin de manche)
   ============================================================ */
function practicePutts(){
  return [{x:0,dist:180,pts:1},{x:-20,dist:260,pts:2},{x:20,dist:260,pts:2},{x:0,dist:380,pts:3}];
}
function screenPuttingGreen(){
  hideProg(); setTopbarTheme(null);
  progTxt.textContent='Trou par 3'; progBar.style.width='100%';
  setView(
    '<div class="pad puttintro">'+
    '<img src="assets/minigame/minigame_hole_course.jpg" class="puttbanner" alt="">'+
    tigerCoach('happy',90)+
    '<h2 class="h1">Dernier defi : un trou !</h2>'+
    '<p>Tiger : un vrai trou t\'attend, <b>par 3</b>. A chaque coup, choisis ton club : le <b>fer</b> pour porter loin depuis le depart (et pourquoi pas rentrer directement !), le <b>putter</b> pour finir en douceur sur le green. Vise juste, moins tu mets de coups, plus tu gagnes de points !</p>'+
    '<button class="btn big puttbtn" id="goputt">&#9971; Aller jouer le trou !</button>'+
    '<button class="btn ghost big" id="skipputt" style="margin-top:10px">Voir mon resultat</button></div>'
  );
  sndHorn();
  document.getElementById('goputt').onclick=function(){
    sndClick();
    Putting.openHole({title:'Trou par 3',onDone:function(p){ puttPts+=p; points+=p; resultScreen(); }});
  };
  document.getElementById('skipputt').onclick=function(){ sndClick(); resultScreen(); };
}

/* ============================================================
   RESULTAT + ETOILES + SAUVEGARDE
   ============================================================ */
function starsFromScore(s,total){ if(s>=total)return 3; if(s>=total-1)return 2; if(s>=Math.ceil(total*0.6))return 1; return 0; }
function animateCount(el,to,dur){
  if(reduceMotion){ el.textContent=to; return; }
  var t0=performance.now();
  function step(t){
    var p=Math.min(1,(t-t0)/dur);
    el.textContent=Math.round(p*to);
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function resultScreen(){
  progTxt.textContent='Partie terminee'; progBar.style.width='100%';
  var earned=starsFromScore(score,ROUND);
  var unlockMsg=''; var evoHtml=''; var record=false;
  var ptsBefore=profile.careerPts||0;
  profile.careerPts=ptsBefore+points;
  var key=curFlag;
  if(points>(profile.bestPts[key]||0)){ profile.bestPts[key]=points; record=true; }
  if(curFlag!=='all'){
    var before=totalStars();
    profile.played=(profile.played||0)+1;
    if(score>(profile.best[curFlag]||0)) profile.best[curFlag]=score;
    if(earned>(profile.stars[curFlag]||0)) profile.stars[curFlag]=earned;
    var after=totalStars();
    var tierBefore=tierFor(before), tierAfter=tierFor(after);
    if(tierAfter>tierBefore && AVATAR_EVOLVES.indexOf(profile.avatar)!==-1){
      evoHtml='<div class="evorow"><div class="evolabel">Ton golfeur evolue !</div>'+
        '<div class="evorow-imgs">'+avatarSVG(profile.avatar,64,tierBefore)+
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8c94a" stroke-width="3"><path d="M4 12h14M12 6l6 6-6 6"/></svg>'+
        avatarSVG(profile.avatar,72,tierAfter)+'</div></div>';
      sndStar();
    }
    for(var i=0;i<MASCOTS.length;i++){ if(MASCOTS[i].need>before && MASCOTS[i].need<=after){ unlockMsg='Nouvel avatar debloque : '+MASCOTS[i].name+' !'; } }
  }
  var bgUnlockMsg='';
  for(var bi=0;bi<BACKGROUNDS.length;bi++){ if(BACKGROUNDS[bi].need>ptsBefore && BACKGROUNDS[bi].need<=profile.careerPts){ bgUnlockMsg='Nouveau fond de club house debloque : '+BACKGROUNDS[bi].name+' !'; } }
  persist();
  var starsHtml='';
  for(var s=0;s<3;s++)starsHtml+=starSVG(s<earned,34,s<earned);
  var msg,sub,mood;
  if(score===ROUND){msg='Sans-faute total !';sub='Parfait du debut a la fin. Tiger applaudit tres fort !';mood='happy';}
  else if(earned===2){msg='Superbe partie !';sub='Il ne manque presque rien pour le sans-faute.';mood='happy';}
  else if(earned===1){msg='Bien joue !';sub='Continue a t\'entrainer pour decrocher les 3 etoiles.';mood='happy';}
  else {msg='On continue de s\'entrainer.';sub='Personne ne reussit du premier coup. Tiger croit en toi, on retente !';mood='sad';}
  var rows='';
  for(var r=0;r<results.length;r++){rows+='<div class="row"><div class="n">'+(r+1)+'</div><div class="t">'+results[r].theme+'</div><div class="m '+(results[r].ok?'y':'x')+'">'+(results[r].ok?'&#10003;':'&#10007;')+'</div></div>';}
  var lvl=(curFlag==='all')?'Grand melange':FLAGS[curFlag].name;
  var bestLine=(maxStreak>=2)?'<div style="text-align:center"><span class="bestrow">&#128293; Meilleure serie : '+maxStreak+' d\'affilee</span></div>':'';
  var unlockLine=unlockMsg?'<div class="unlock">'+starSVG(true,18)+unlockMsg+'</div>':'';
  var bgUnlockLine=bgUnlockMsg?'<div class="unlock">&#127968; '+bgUnlockMsg+'</div>':'';
  var starBlock=(curFlag!=='all')?'<div class="starsbig">'+starsHtml+'</div>':'';
  var trophyHtml=(score===ROUND)?'<img src="assets/fx/fx_trophy.jpg" class="result-trophy starpop" alt="Trophee">':'';
  setView(
    '<div class="pad result"><h2>'+msg+'</h2>'+trophyHtml+
    '<div class="tiger-wrap center">'+tigerCoach(mood,84)+'</div>'+
    starBlock+
    '<div class="scorebig"><span id="scnum">0</span><small>/'+ROUND+'</small></div>'+
    '<div class="ptsbig"><span id="ptsnum">0</span> points'+(record?' <span class="recordtag">NOUVEAU RECORD !</span>':'')+'</div>'+
    (puttPts>0?'<div class="bestrow" style="margin-bottom:6px">&#127967; dont '+puttPts+' pts au putting</div>':'')+
    '<div class="verdict">'+lvl+' &middot; '+sub+'</div>'+
    evoHtml+unlockLine+bgUnlockLine+bestLine+
    '<div class="scorecard">'+rows+'</div>'+
    '<button class="btn big" id="again">Rejouer cette etape</button>'+
    '<button class="btn ghost big" id="home" style="margin-top:10px">Retour a l\'academie</button>'+
    '<div class="footer">Un jeu imagine avec Coach Tiger, pour progresser sur les regles et l\'etiquette du golf.<br>Inspire du programme des Drapeaux ffgolf / PGA France et des Regles du Golf. Outil de revision.</div></div>'
  );
  animateCount(document.getElementById('scnum'),score,700);
  animateCount(document.getElementById('ptsnum'),points,900);
  if(score===ROUND){ FX.fireworks(3200); sndStar(); }
  else if(earned>=2){ FX.fireworks(1200); sndStar(); }
  document.getElementById('again').onclick=function(){sndClick();startRound(curFlag);};
  document.getElementById('home').onclick=function(){sndClick();screenHome();};
}

/* ============================================================
   BOOT
   ============================================================ */
function boot(){
  var s=loadSave();
  if(s && s.name){ profile=s;
    if(!profile.stars)profile.stars={vert:0,rouge:0,bleu:0,jaune:0,blanc:0};
    if(!profile.best)profile.best={vert:0,rouge:0,bleu:0,jaune:0,blanc:0};
    if(!profile.bestPts)profile.bestPts={vert:0,rouge:0,bleu:0,jaune:0,blanc:0,all:0};
    if(typeof profile.careerPts!=='number')profile.careerPts=0;
    if(typeof profile.muted!=='boolean')profile.muted=false;
    if(typeof profile.background==='undefined')profile.background=null;
    updateMuteBtn(); applyBackground();
    screenHome();
  } else { profile=blankProfile(); updateMuteBtn(); applyBackground(); screenProfile(); }
}
boot();
