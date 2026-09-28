/* ============================================================
   SON (WebAudio, sans fichier externe) + VOIX DE COACH TIGER
   ============================================================ */
var GOOD=["Dans le mille, champion !","Tiger est fier de toi !","Beau swing de reponse !","Birdie de logique, bravo !","Tu assures a fond !","Superbe, comme une pro !","Coup parfait, bien joue !","Tiger te fait un high-five !"];
var BAD=["Oups, un petit passage par le rough...","Pas grave, meme les pros ratent parfois !","Presque ! On retient la bonne reponse pour la prochaine fois.","Une petite balle perdue, on en reprend une !","Ce n'est qu'un entrainement, on progresse a chaque coup.","Tiger te glisse un tuyau pour la prochaine question."];

var actx=null;
function ensureAudio(){ if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ actx=null; } } return actx; }
function beep(freq,dur,type,vol,delay){
  if(profile && profile.muted) return;
  var ac=ensureAudio(); if(!ac) return;
  var t0=ac.currentTime+(delay||0);
  var osc=ac.createOscillator(), g=ac.createGain();
  osc.type=type||'sine'; osc.frequency.setValueAtTime(freq,t0);
  g.gain.setValueAtTime(0,t0);
  g.gain.linearRampToValueAtTime(vol||0.12,t0+0.015);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  osc.connect(g); g.connect(ac.destination);
  osc.start(t0); osc.stop(t0+dur+0.02);
}
function noiseFx(dur,vol,filterFreq,type,delay,q){
  if(profile && profile.muted) return;
  var ac=ensureAudio(); if(!ac) return;
  var t0=ac.currentTime+(delay||0), len=Math.floor(ac.sampleRate*dur), buf=ac.createBuffer(1,len,ac.sampleRate), d=buf.getChannelData(0);
  for(var i=0;i<len;i++)d[i]=Math.random()*2-1;
  var src=ac.createBufferSource(); src.buffer=buf;
  var f=ac.createBiquadFilter(); f.type=type||'bandpass'; f.frequency.value=filterFreq||1000; f.Q.value=q||1;
  var g=ac.createGain(); g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(vol||0.2,t0+dur*0.25); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  src.connect(f); f.connect(g); g.connect(ac.destination); src.start(t0); src.stop(t0+dur+0.05);
}
function sndClick(){ beep(520,.06,'triangle',.08); }
function sndGood(){ beep(523,.11,'triangle',.11,0); beep(659,.13,'triangle',.11,.08); beep(784,.18,'triangle',.12,.16); }
function sndBad(){ beep(220,.16,'sawtooth',.09,0); beep(160,.22,'sawtooth',.08,.09); }
function sndStar(){ beep(880,.1,'sine',.1,0); beep(1046,.16,'sine',.11,.1); }
function sndWhoosh(){ noiseFx(.28,.14,700,'bandpass',0,.5); }
function sndPlop(){ noiseFx(.12,.12,2600,'lowpass',0,.6); beep(300,.1,'sine',.1,.05); }
function sndCheer(){ noiseFx(1.4,.2,900,'bandpass',0,.6); noiseFx(1.1,.1,2200,'bandpass',.15,.8); }
function sndHorn(){ beep(233,.45,'sawtooth',.1); beep(294,.45,'sawtooth',.08,.02); beep(349,.6,'sawtooth',.09,.05); }
function sndBoom(){ beep(90,.5,'sine',.4,0); noiseFx(.4,.3,400,'lowpass'); }
function sndSplash(){ noiseFx(.35,.22,700,'lowpass',0,.7); beep(180,.22,'sine',.12,.05); beep(110,.28,'sine',.09,.12); }
function updateMuteBtn(){
  var b=document.getElementById('mutebtn'); if(!b) return;
  b.innerHTML=profile.muted
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><line x1="16" y1="9" x2="21" y2="15"/><line x1="21" y1="9" x2="16" y2="15"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18 6a9 9 0 0 1 0 12"/></svg>';
}
