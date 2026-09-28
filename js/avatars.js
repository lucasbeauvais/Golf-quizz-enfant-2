/* ============================================================
   AVATARS, MASCOTTE COACH TIGER, PETITS SVG UTILITAIRES
   ============================================================ */
var MASCOTS=[
  {id:'a1',name:'Casquette verte', need:0},
  {id:'a2',name:'Casquette rouge', need:0},
  {id:'a3',name:'Bob jaune',   need:0},
  {id:'a4',name:'Lunettes de soleil',need:0},
  {id:'a5',name:'Chat golfeur',     need:3},
  {id:'a6',name:'Koala cool',    need:6},
  {id:'a7',name:'Chouette pro',         need:9},
  {id:'a8',name:'Champion couronne', need:12},
  {id:'a9',name:'Mini Tiger',        need:15}
];
function mascotById(id){for(var i=0;i<MASCOTS.length;i++)if(MASCOTS[i].id===id)return MASCOTS[i];return MASCOTS[0];}
function mascotUnlocked(m){return totalStars()>=m.need;}

/* ============================================================
   CLUB HOUSE : fonds d'ecran a debloquer avec les points en carriere
   ============================================================ */
var BACKGROUNDS=[
  {id:'bg1',name:'Practice au crepuscule',file:'bg1_practice.jpg',need:0},
  {id:'bg2',name:'Bord de mer',file:'bg2_links.jpg',need:50},
  {id:'bg3',name:'Nuit etoilee',file:'bg3_starry.jpg',need:120},
  {id:'bg4',name:'Bunker dore',file:'bg4_bunker_gold.jpg',need:220},
  {id:'bg5',name:'Salle des trophees',file:'bg5_trophy_room.jpg',need:350},
  {id:'bg6',name:'Feu d\'artifice',file:'bg6_fireworks.jpg',need:500},
  {id:'bg7',name:'Automne',file:'bg7_autumn.jpg',need:700},
  {id:'bg8',name:'Legende doree',file:'bg8_legend_gold.jpg',need:1000}
];
function bgById(id){for(var i=0;i<BACKGROUNDS.length;i++)if(BACKGROUNDS[i].id===id)return BACKGROUNDS[i];return null;}
function bgUnlocked(b){return (profile.careerPts||0)>=b.need;}
function starPts(cx,cy,r){var p='';for(var i=0;i<5;i++){var a=-Math.PI/2+i*2*Math.PI/5;var a2=a+Math.PI/5;p+=(cx+Math.cos(a)*r).toFixed(1)+','+(cy+Math.sin(a)*r).toFixed(1)+' '+(cx+Math.cos(a2)*r*0.46).toFixed(1)+','+(cy+Math.sin(a2)*r*0.46).toFixed(1)+' ';}return p;}
var AVATAR_FILES={a1:'a1_lion.png',a2:'a2_renard.png',a3:'a3_ours.png',a4:'a4_elephant.png',a5:'a5_chat.png',a6:'a6_koala.png',a7:'a7_chouette.png',a8:'a8_aigle.png',a9:'a9_tigre.png'};
var AVATAR_EVOLVES=['a1','a2','a3','a4'];
function tierFor(stars){stars=(typeof stars==='number')?stars:totalStars();return stars>=10?3:(stars>=5?2:1);}
function evoOverlay(tier){
  tier=tier||1; var s='';
  if(tier>=2){ s+='<g fill="#ffd23f" opacity=".9"><polygon points="'+starPts(51,11,3.2)+'"/></g>'; }
  if(tier>=3){
    s+='<circle cx="32" cy="30" r="27" fill="none" stroke="#ffd23f" stroke-width="1.4" opacity=".4"/>'+
      '<g fill="#ffd23f" opacity=".95"><polygon points="'+starPts(13,11,2.8)+'"/><polygon points="'+starPts(53,23,2.4)+'"/></g>'+
      '<path d="M24 51 Q32 57 40 51" stroke="#e8c94a" stroke-width="2" fill="none"/><circle cx="32" cy="56" r="2" fill="#e8c94a" stroke="#a8891f"/>';
  }
  return s;
}
function avatarSVG(id,size,tier){
  size=size||64;
  var file=AVATAR_FILES[id]||AVATAR_FILES.a1;
  var overlay=(AVATAR_EVOLVES.indexOf(id)!==-1)?evoOverlay(tier||tierFor()):'';
  return '<span style="position:relative;display:inline-block;width:'+size+'px;height:'+size+'px;flex:0 0 auto">'+
    '<img src="assets/avatars/'+file+'" width="'+size+'" height="'+size+'" alt="" style="display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;background:#2c2d2e">'+
    (overlay?'<svg width="'+size+'" height="'+size+'" viewBox="0 0 64 64" style="position:absolute;inset:0;pointer-events:none">'+overlay+'</svg>':'')+
    '</span>';
}

/* ============================================================
   BADGE "CULTURE GOLF" (bandeau des questions bonus)
   ============================================================ */
function cultureBadge(size){
  size=size||64;
  return '<span style="position:relative;display:inline-block;width:'+size+'px;height:'+size+'px;flex:0 0 auto">'+
    '<img src="assets/avatars/badge_culture_golf.png" width="'+size+'" height="'+size+'" alt="" style="display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;background:#d9c34a">'+
    '</span>';
}
function cultureBanner(text){
  return '<div class="tiger-wrap"><div class="tiger">'+cultureBadge(66)+'</div>'+
    '<div class="bubble"><b>Culture Golf</b><br>'+text+'</div></div>';
}
function starSVG(filled,size,pop){size=size||18;var c=filled?'#ffcf3f':'#eadfc2',s=filled?'#e0a800':'#d6cba8';return '<svg class="'+(pop?'starpop':'')+'" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="'+starPts(12,12,10)+'" fill="'+c+'" stroke="'+s+'" stroke-width="1"/></svg>';}
function starRow(n){var h='';for(var i=0;i<3;i++)h+=starSVG(i<n,15,false);return h;}
var __lvlIdSeq=0;
function levelBadge(n,size){
  size=size||54; var gid='lvlgrad'+(__lvlIdSeq++);
  return '<svg width="'+size+'" height="'+Math.round(size*1.08)+'" viewBox="0 0 60 65" xmlns="http://www.w3.org/2000/svg">'+
    '<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#faff85"/><stop offset="1" stop-color="#d4d800"/></linearGradient></defs>'+
    '<path d="M30 2 L56 12 L56 33 Q56 53 30 63 Q4 53 4 33 L4 12 Z" fill="url(#'+gid+')" stroke="#0a0a0c" stroke-width="3.5"/>'+
    '<text x="30" y="26" font-family="Rubik, sans-serif" font-size="10" font-weight="800" fill="#4a4a06" text-anchor="middle" letter-spacing="1">NIV</text>'+
    '<text x="30" y="48" font-family="Rubik, sans-serif" font-size="22" font-weight="800" fill="#2a2a06" text-anchor="middle">'+n+'</text>'+
    '</svg>';
}
function miniFlag(color){return '<svg width="30" height="36" viewBox="0 0 30 36" aria-hidden="true"><ellipse cx="8" cy="33" rx="6" ry="2" fill="#000" opacity=".3"/><line x1="8" y1="4" x2="8" y2="33" stroke="#0a0a0c" stroke-width="2.4"/><path d="M8 4 L26 9 L8 15 Z" fill="'+color+'" stroke="#0a0a0c" stroke-width="1"/></svg>';}
function lockSVG(c){return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="'+(c||'#7a6a3a')+'" stroke-width="2.4"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';}

/* tiger coach illustre, avec bulle de dialogue optionnelle */
function tigerCoach(mood,size,text,extraCls){
  size=size||74;
  var file=mood==='happy'?'coach_tiger_happy.png':(mood==='sad'?'coach_tiger_sad.png':'coach_tiger_neutral.png');
  var mk='<img src="assets/avatars/'+file+'" width="'+size+'" height="'+(size*1.35)+'" alt="" style="display:block;width:'+size+'px;height:'+(size*1.35)+'px;object-fit:contain">';
  var cls='tiger'+(mood==='happy'?' happy':(mood==='sad'?' sad':''))+(extraCls?' '+extraCls:'');
  var html='<div class="'+cls+'">'+mk+'</div>';
  if(text) html='<div class="tiger-wrap">'+html+'<div class="bubble">'+text+'</div></div>';
  return html;
}

/* decor de parcours (banniere animee) */
function decorBanner(){
  return '<div class="decor"><svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" width="100%" height="120" xmlns="http://www.w3.org/2000/svg">'+
    '<defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3b3c"/><stop offset="1" stop-color="#17181a"/></linearGradient></defs>'+
    '<rect width="400" height="120" fill="url(#skyg)"/>'+
    '<circle cx="70" cy="28" r="30" fill="#5a5b5d" opacity=".18"/>'+
    '<circle cx="334" cy="32" r="20" fill="#5fd66a" opacity=".5"/>'+
    '<circle cx="334" cy="32" r="20" fill="none" stroke="#9fe8a4" stroke-width="2" opacity=".5"/>'+
    '<rect x="0" y="70" width="60" height="50" fill="#17181d"/>'+
    '<rect x="45" y="50" width="40" height="70" fill="#101114"/>'+
    '<rect x="85" y="78" width="55" height="42" fill="#1c1d22"/>'+
    '<rect x="230" y="60" width="50" height="60" fill="#17181d"/>'+
    '<rect x="270" y="40" width="36" height="80" fill="#101114"/>'+
    '<rect x="306" y="72" width="60" height="48" fill="#1c1d22"/>'+
    '<rect x="360" y="55" width="40" height="65" fill="#17181d"/>'+
    '<rect x="0" y="106" width="400" height="14" fill="#221f22"/>'+
    '<line x1="0" y1="113" x2="400" y2="113" stroke="#3a3540" stroke-width="1"/>'+
    '<g class="flagwig">'+flag(56,100)+'</g><g class="flagwig">'+flag(300,104)+'</g>'+
    '<circle cx="150" cy="112" r="4" fill="#5fd66a" stroke="#0a0a0c" stroke-width="1.5"/>'+
  '</svg></div>';
}
