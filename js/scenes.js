/* ============================================================
   BRIQUES SVG (scenes de jeu)
   ============================================================ */
var VB='0 0 400 230';
var SCENE_DEFS='<defs>'+
  '<pattern id="mow" width="34" height="230" patternUnits="userSpaceOnUse"><rect width="34" height="230" fill="#6fa83a"/><rect width="17" height="230" fill="#7cb943"/></pattern>'+
  '<pattern id="mowGreen" width="22" height="230" patternUnits="userSpaceOnUse"><rect width="22" height="230" fill="#9ad35f"/><rect width="11" height="230" fill="#a6dd6c"/></pattern>'+
  '<linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a6fa8"/><stop offset=".55" stop-color="#3a95c9"/><stop offset="1" stop-color="#1a5a85"/></linearGradient>'+
  '<linearGradient id="poleG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4f4f2"/><stop offset=".5" stop-color="#c7c8ce"/><stop offset="1" stop-color="#8a8b8e"/></linearGradient>'+
  '<linearGradient id="flagG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5c78"/><stop offset="1" stop-color="#c21138"/></linearGradient>'+
  '<radialGradient id="sandG" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#f0e2b8"/><stop offset="1" stop-color="#d9c48f"/></radialGradient>'+
  '<filter id="softSh" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>'+
  '</defs>';
function svg(i){return '<svg class="scene" viewBox="'+VB+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">'+SCENE_DEFS+i+'</svg>';}
function grass(){return '<rect x="0" y="0" width="400" height="230" fill="url(#mow)"/><rect x="0" y="0" width="400" height="230" fill="#000" opacity="0.05"/>';}
function fairway(){return '<path d="M120 230 Q150 120 175 30 L245 30 Q235 130 280 230 Z" fill="url(#mow)"/>';}
function ball(x,y){return '<ellipse cx="'+x+'" cy="'+(y+2)+'" rx="8" ry="3.4" fill="#000" opacity=".3" filter="url(#softSh)"/><circle cx="'+x+'" cy="'+y+'" r="7" fill="#fff" stroke="#b7b7a6"/><circle cx="'+(x-2)+'" cy="'+(y-2)+'" r="1.4" fill="#e6e6da"/>';}
function flag(x,y){return '<ellipse cx="'+x+'" cy="'+(y+2)+'" rx="8" ry="3.2" fill="#000" opacity=".28" filter="url(#softSh)"/><line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="'+(y-38)+'" stroke="url(#poleG)" stroke-width="2.6"/><path d="M'+x+' '+(y-38)+' l 20 6 l -20 6 z" fill="url(#flagG)"/><ellipse cx="'+x+'" cy="'+(y+1)+'" rx="7" ry="3" fill="#12261a"/>';}
function markX(x,y){return '<g stroke="#c81d25" stroke-width="3" stroke-linecap="round"><line x1="'+(x-7)+'" y1="'+(y-7)+'" x2="'+(x+7)+'" y2="'+(y+7)+'"/><line x1="'+(x+7)+'" y1="'+(y-7)+'" x2="'+(x-7)+'" y2="'+(y+7)+'"/></g>';}
function label(x,y,t,f){return '<text x="'+x+'" y="'+y+'" font-family="Helvetica,Arial,sans-serif" font-size="12" font-weight="700" fill="'+(f||'#fff')+'" text-anchor="middle">'+t+'</text>';}
function marker(x,y){return '<ellipse cx="'+x+'" cy="'+(y+3)+'" rx="6" ry="2" fill="#000" opacity=".15"/><circle cx="'+x+'" cy="'+y+'" r="5.5" fill="#d33" stroke="#7a1010"/><circle cx="'+x+'" cy="'+y+'" r="2" fill="#fff"/>';}
function bag(x,y,c){c=c||'#2d6a4f';return '<g>'+
  '<ellipse cx="'+x+'" cy="'+(y+24)+'" rx="14" ry="4" fill="#000" opacity=".15"/>'+
  '<line x1="'+(x-4)+'" y1="'+(y-4)+'" x2="'+(x-7)+'" y2="'+(y-22)+'" stroke="#555" stroke-width="2"/>'+
  '<line x1="'+(x+3)+'" y1="'+(y-4)+'" x2="'+(x+6)+'" y2="'+(y-24)+'" stroke="#555" stroke-width="2"/>'+
  '<circle cx="'+(x-7)+'" cy="'+(y-22)+'" r="2.5" fill="#333"/><circle cx="'+(x+6)+'" cy="'+(y-24)+'" r="2.5" fill="#333"/>'+
  '<rect x="'+(x-9)+'" y="'+(y-6)+'" width="18" height="30" rx="8" fill="'+c+'"/>'+
  '<rect x="'+(x-9)+'" y="'+(y+3)+'" width="18" height="6" fill="#fff" opacity=".3"/></g>';}
function person(x,y){return '<g stroke="#20301f" stroke-width="3" stroke-linecap="round" fill="none">'+
  '<circle cx="'+x+'" cy="'+(y-16)+'" r="5" fill="#20301f" stroke="none"/>'+
  '<line x1="'+x+'" y1="'+(y-11)+'" x2="'+x+'" y2="'+(y+2)+'"/>'+
  '<line x1="'+x+'" y1="'+(y-6)+'" x2="'+(x-7)+'" y2="'+(y-1)+'"/><line x1="'+x+'" y1="'+(y-6)+'" x2="'+(x+7)+'" y2="'+(y-1)+'"/>'+
  '<line x1="'+x+'" y1="'+(y+2)+'" x2="'+(x-6)+'" y2="'+(y+14)+'"/><line x1="'+x+'" y1="'+(y+2)+'" x2="'+(x+6)+'" y2="'+(y+14)+'"/></g>';}

function sceneGreen(bx,by,extra){return svg(grass()+
  '<ellipse cx="200" cy="120" rx="150" ry="95" fill="url(#mowGreen)"/>'+
  '<ellipse cx="200" cy="120" rx="150" ry="95" fill="none" stroke="#7cb342" stroke-width="3"/>'+
  flag(250,96)+'<circle cx="250" cy="96" r="6" fill="#12261a"/>'+(extra||'')+ball(bx,by));}
function sceneWaterRed(bx,by,extra){return svg(grass()+fairway()+
  '<path d="M250 40 Q360 60 355 150 Q350 220 250 215 Q300 130 250 40 Z" fill="url(#waterG)"/>'+
  '<path d="M250 40 Q360 60 355 150 Q350 220 250 215 Q300 130 250 40 Z" fill="none" stroke="#c81d25" stroke-width="3" stroke-dasharray="9 6"/>'+
  '<g stroke="#c81d25" stroke-width="3"><line x1="252" y1="42" x2="252" y2="30"/><line x1="300" y1="118" x2="308" y2="110"/><line x1="252" y1="214" x2="252" y2="226"/></g>'+
  label(300,150,"Zone rouge","#0d3b52")+(extra||'')+(bx!==null?ball(bx,by):''));}
function sceneWaterYellow(bx,by,extra){return svg(grass()+fairway()+
  '<path d="M60 150 Q200 120 340 150 L340 210 Q200 185 60 210 Z" fill="url(#waterG)"/>'+
  '<path d="M60 150 Q200 120 340 150" fill="none" stroke="#f2c400" stroke-width="3" stroke-dasharray="9 6"/>'+
  '<g stroke="#e0b000" stroke-width="3"><line x1="90" y1="150" x2="90" y2="138"/><line x1="200" y1="127" x2="200" y2="115"/><line x1="310" y1="150" x2="310" y2="138"/></g>'+
  label(200,190,"Zone jaune","#5a4a00")+(extra||'')+(bx!==null?ball(bx,by):''));}
function sceneBunker(bx,by,extra){return svg(grass()+
  '<ellipse cx="200" cy="150" rx="150" ry="70" fill="url(#sandG)"/>'+
  '<ellipse cx="200" cy="150" rx="150" ry="70" fill="none" stroke="#cbb877" stroke-width="3"/>'+
  '<ellipse cx="200" cy="60" rx="120" ry="45" fill="url(#mowGreen)"/>'+flag(210,52)+
  label(200,150,"Bunker","#8a6d1f")+(extra||'')+ball(bx,by));}
function sceneTee(bx,by,extra){return svg(grass()+
  '<ellipse cx="200" cy="120" rx="140" ry="80" fill="#8bc34a"/>'+
  '<circle cx="120" cy="105" r="8" fill="#1f6feb"/><circle cx="280" cy="105" r="8" fill="#1f6feb"/>'+
  '<line x1="120" y1="105" x2="280" y2="105" stroke="#fff" stroke-width="2" stroke-dasharray="4 6" opacity=".8"/>'+
  label(200,92,"Depart","#20301f")+(extra||'')+ball(bx,by));}
function sceneOB(bx,by,extra){return svg(grass()+
  '<rect x="300" y="0" width="100" height="230" fill="#6d8b4a"/>'+
  '<line x1="300" y1="0" x2="300" y2="230" stroke="#fff" stroke-width="3"/>'+
  '<g fill="#fff" stroke="#cfcfcf"><rect x="296" y="30" width="8" height="26" rx="2"/><rect x="296" y="110" width="8" height="26" rx="2"/><rect x="296" y="190" width="8" height="26" rx="2"/></g>'+
  (extra||'')+ball(bx,by));}
function sceneTrees(bx,by,extra){function tree(x,y,r){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#3f6b2e"/><circle cx="'+(x-r*0.4)+'" cy="'+(y-r*0.3)+'" r="'+(r*0.6)+'" fill="#4c7f36"/>';}
  return svg(grass()+'<rect x="0" y="0" width="400" height="230" fill="#5a7a3a" opacity=".35"/>'+
  tree(90,70,34)+tree(160,50,30)+tree(250,64,36)+tree(320,80,30)+tree(120,130,26)+(extra||'')+ball(bx,by));}
function sceneCartPath(bx,by,extra){return svg(grass()+fairway()+
  '<path d="M40 0 Q120 100 60 230 L110 230 Q150 110 90 0 Z" fill="#c9c9c2"/>'+
  '<path d="M40 0 Q120 100 60 230" fill="none" stroke="#a7a79e" stroke-width="2"/>'+
  label(75,120,"Chemin","#4a4a45")+(extra||'')+ball(bx,by));}
function sceneGUR(bx,by,mode,extra){var z=(mode==='water')
  ? '<ellipse cx="200" cy="130" rx="80" ry="45" fill="#7fc9e8" opacity=".85"/><ellipse cx="200" cy="130" rx="80" ry="45" fill="none" stroke="#3a8db0" stroke-width="2"/>'+label(200,133,"Flaque","#0d3b52")
  : '<ellipse cx="200" cy="130" rx="80" ry="45" fill="#7cb342"/><ellipse cx="200" cy="130" rx="80" ry="45" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5"/>'+label(200,127,"G.U.R.","#fff")+label(200,142,"terrain en reparation","#20301f");
  return svg(grass()+fairway()+z+(extra||'')+ball(bx,by));}
function sceneEmbedded(bx,by){return svg(grass()+fairway()+
  '<ellipse cx="'+bx+'" cy="'+(by+2)+'" rx="16" ry="9" fill="#5a7a3a"/>'+
  '<ellipse cx="'+bx+'" cy="'+(by+2)+'" rx="16" ry="9" fill="none" stroke="#3f5a26" stroke-width="1.5"/>'+
  '<circle cx="'+bx+'" cy="'+by+'" r="7" fill="#fff" stroke="#b7b7a6"/>'+
  label(bx,by-18,"balle enfoncee","#20301f"));}
function sceneFairway(bx,by,extra){return svg(grass()+fairway()+
  '<ellipse cx="210" cy="45" rx="55" ry="26" fill="url(#mowGreen)"/>'+flag(225,40)+(extra||'')+ball(bx,by));}

/* --- scenes specifiques --- */
function sceneSafety(){return svg(grass()+
  '<ellipse cx="240" cy="90" rx="120" ry="58" fill="url(#mowGreen)"/>'+flag(285,78)+
  person(250,120)+label(250,145,"joueur devant","#20301f")+
  ball(80,180)+label(80,205,"toi","#20301f"));}
function sceneBag(){return svg(grass()+
  '<ellipse cx="190" cy="110" rx="120" ry="66" fill="url(#mowGreen)"/>'+flag(190,90)+'<circle cx="190" cy="90" r="6" fill="#12261a"/>'+
  '<line x1="320" y1="55" x2="366" y2="34" stroke="#20301f" stroke-width="2"/><path d="M366 34 l-9 1 l4 6 z" fill="#20301f"/>'+label(350,24,"trou suivant","#20301f")+
  bag(190,118,'#c81d25')+label(190,150,"A","#20301f")+
  bag(340,120,'#2d6a4f')+label(340,152,"B","#20301f")+
  bag(60,185,'#1f6feb')+label(60,214,"C","#20301f"));}
function sceneOrder(){return svg(grass()+
  '<ellipse cx="200" cy="115" rx="145" ry="82" fill="url(#mowGreen)"/>'+flag(200,95)+'<circle cx="200" cy="95" r="6" fill="#12261a"/>'+
  ball(238,122)+label(238,144,"balle A","#20301f")+
  ball(85,178)+label(85,200,"balle B","#20301f"));}
function scenePitch(bx,by,noLabel){return svg(grass()+
  '<ellipse cx="200" cy="120" rx="150" ry="95" fill="url(#mowGreen)"/>'+flag(255,96)+'<circle cx="255" cy="96" r="6" fill="#12261a"/>'+
  '<ellipse cx="'+(bx-26)+'" cy="'+by+'" rx="11" ry="6" fill="#6f8f4a"/>'+
  '<ellipse cx="'+(bx-26)+'" cy="'+by+'" rx="11" ry="6" fill="none" stroke="#4f6a32" stroke-width="1.5"/>'+
  (noLabel?'':label(bx-26,by-13,"pitch","#20301f"))+ball(bx,by));}
function sceneTool(){
  return svg(grass()+
    '<ellipse cx="200" cy="196" rx="55" ry="11" fill="#000" opacity=".1"/>'+
    '<defs><clipPath id="toolClip"><circle cx="200" cy="108" r="72"/></clipPath></defs>'+
    '<circle cx="200" cy="108" r="74" fill="#0a1a10" opacity=".18"/>'+
    '<image href="assets/objects/tool_pitchfork.jpg" x="128" y="36" width="144" height="144" clip-path="url(#toolClip)"/>'+
    '<circle cx="200" cy="108" r="72" fill="none" stroke="#0a1a10" stroke-width="2.5" opacity=".3"/>'+
    label(200,220,"Quel est cet objet ?","#20301f"));}
function sceneDivot(){return svg(grass()+fairway()+
  '<ellipse cx="185" cy="150" rx="22" ry="11" fill="#7a5a34"/>'+
  '<ellipse cx="185" cy="150" rx="22" ry="11" fill="none" stroke="#5a4020" stroke-width="1.5"/>'+
  '<ellipse cx="248" cy="162" rx="17" ry="8" fill="#6b8f3a"/>'+
  '<ellipse cx="248" cy="162" rx="17" ry="8" fill="none" stroke="#4f6a32" stroke-width="1"/>'+
  label(185,135,"trou","#20301f")+label(255,182,"la motte","#20301f"));}
function sceneRake(){return svg(grass()+
  '<ellipse cx="200" cy="150" rx="150" ry="70" fill="url(#sandG)"/>'+
  '<ellipse cx="200" cy="150" rx="150" ry="70" fill="none" stroke="#cbb877" stroke-width="3"/>'+
  '<g stroke="#cbb877" stroke-width="2"><line x1="120" y1="138" x2="175" y2="138"/><line x1="120" y1="150" x2="175" y2="150"/><line x1="120" y1="162" x2="175" y2="162"/></g>'+
  '<line x1="248" y1="105" x2="298" y2="176" stroke="#8a5a2a" stroke-width="4"/>'+
  '<line x1="288" y1="188" x2="316" y2="164" stroke="#8a5a2a" stroke-width="4"/>'+
  '<g stroke="#8a5a2a" stroke-width="2"><line x1="290" y1="184" x2="293" y2="192"/><line x1="297" y1="180" x2="300" y2="188"/><line x1="304" y1="175" x2="307" y2="183"/><line x1="311" y1="170" x2="314" y2="178"/></g>'+
  label(150,150,"traces dans le sable","#8a6d1f"));}
function sceneMarker(noLabel){return svg(grass()+
  '<ellipse cx="200" cy="120" rx="150" ry="95" fill="url(#mowGreen)"/>'+flag(255,96)+'<circle cx="255" cy="96" r="6" fill="#12261a"/>'+
  ball(170,150)+marker(191,155)+(noLabel?'':label(191,176,"marqueur","#20301f")));}

