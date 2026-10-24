/* ============================================================
   LANGUES (francais / anglais)
   Le texte francais sert de cle : t('Texte fr') renvoie l'anglais
   si la langue est 'en', sinon le texte francais tel quel.
   Choix : ?lang=en dans l'URL > choix sauvegarde > langue du navigateur.
   ============================================================ */
var LANG=(function(){
  try{
    var m=/[?&]lang=(fr|en)\b/.exec(location.search);
    if(m){ localStorage.setItem('golf_lang',m[1]); return m[1]; }
    var s=localStorage.getItem('golf_lang'); if(s==='fr'||s==='en') return s;
  }catch(e){}
  return ((navigator.language||'fr').toLowerCase().indexOf('fr')===0)?'fr':'en';
})();

var EN={
  /* --- en-tete / page --- */
  "Golf Academy - L'aventure des Drapeaux avec Coach Tiger":"Golf Academy - The Flags Adventure with Coach Tiger",
  "L'aventure des drapeaux":"The Flags Adventure",
  "Retour au menu":"Back to menu",
  "Son":"Sound",
  /* --- rangs --- */
  "Legende de Coach Tiger":"Coach Tiger Legend",
  "Champion du club":"Club Champion",
  "Pro en herbe":"Budding Pro",
  "Espoir du parcours":"Rising Star",
  "Bourgeon du practice":"Range Rookie",
  /* --- quitter --- */
  "Quitter ce trou ?":"Leave this round?",
  "Les points de cette manche ne seront pas gardes.":"Points from this round won't be kept.",
  "Continuer":"Continue",
  "Quitter":"Leave",
  /* --- profil --- */
  "Equipe":"Equipped",
  "Toucher pour equiper":"Tap to equip",
  "{n} etoiles":"{n} stars",
  "Fond par defaut":"Default background",
  "{n} points en carriere":"{n} career points",
  "Cree ton golfeur":"Create your golfer",
  "Mon profil":"My profile",
  "NIV":"LVL",
  "Salut, moi c'est <b>Tiger</b> ! Je vais t'entrainer aux regles et a la politesse du golf. Comment tu t'appelles ?":"Hi, I'm <b>Tiger</b>! I'll coach you on the rules and etiquette of golf. What's your name?",
  "Tu as {stars} / 15 etoiles et {pts} points en carriere. Continue a jouer pour tout debloquer !":"You have {stars} / 15 stars and {pts} career points. Keep playing to unlock everything!",
  "Ton prenom":"Your first name",
  "Ecris ton prenom":"Type your first name",
  "Ton avatar":"Your avatar",
  "Club house":"Clubhouse",
  "Balles de putting":"Putting balls",
  "C'est parti !":"Let's go!",
  "Retour a l'accueil":"Back to home",
  "Reinitialiser ma progression":"Reset my progress",
  "Sur de toi ? Touche encore pour tout remettre a zero":"Are you sure? Tap again to reset everything",
  /* --- accueil --- */
  "record {n}/5":"best {n}/5",
  "Gagne 1 etoile a l'etape precedente":"Earn 1 star on the previous level",
  "Direction le <b>{flag}</b> ! Tu es pret ?":"Next stop: the <b>{flag}</b>! Ready?",
  "Bravo, tu as debloque toutes les etapes ! Tente le Grand Melange.":"Well done, you've unlocked every level! Try the Grand Mix.",
  "Fond : <b>{bg}</b> &middot; changer":"Background: <b>{bg}</b> &middot; change",
  "Fond : <b>aucun</b> &middot; en choisir un":"Background: <b>none</b> &middot; pick one",
  "Ton parcours en 5 etapes":"Your path in 5 levels",
  /* note affichee uniquement en anglais */
  "NOTE_FFGOLF":"<b>How it works:</b> this learning path is based on the method of the French Golf Federation (ffgolf), which uses coloured flags for each level - from green (safety and etiquette) to white (the full rules). The Rules of Golf themselves are the same everywhere, in the UK, the US and beyond: they are written by The R&amp;A and the USGA.",
  "Grand melange":"Grand Mix",
  "Toutes les etapes melangees - le defi ultime !":"All levels mixed together - the ultimate challenge!",
  "Debloque en reussissant les 5 etapes":"Unlock by completing all 5 levels",
  "Entrainement au putting":"Putting practice",
  "Entrainement":"Practice",
  /* --- jeu --- */
  "Serie x{n}":"Streak x{n}",
  "Touche directement l'image pour repondre":"Tap the picture to answer",
  "Demande un tuyau a Tiger":"Ask Tiger for a tip",
  "EN FEU, +6 ! ":"ON FIRE, +6! ",
  "+{n} ! ":"+{n}! ",
  "Putt bonus !":"Bonus putt!",
  "Putt bonus":"Bonus putt",
  "Question bonus (culture golf)":"Bonus question (golf trivia)",
  "Green de practice":"Final hole",
  "Question suivante":"Next question",
  "Culture golf":"Golf trivia",
  "Culture Golf":"Golf Trivia",
  "Pour le fun":"Just for fun",
  "Une question rien que pour le plaisir - elle ne compte pas dans ton score !":"A question just for fun - it doesn't count towards your score!",
  "Un vrai champion de la culture golf !":"A true golf trivia champion!",
  "Pas grave, c'etait juste pour le fun.":"No worries, it was just for fun.",
  /* --- trou par 3 (intro) --- */
  "Trou par 3":"Par-3 hole",
  "Dernier defi : un trou !":"Final challenge: a real hole!",
  "Tiger : un vrai trou t'attend, <b>par 3</b>. A chaque coup, choisis ton club : le <b>fer</b> pour porter loin depuis le depart (et pourquoi pas rentrer directement !), le <b>putter</b> pour finir en douceur sur le green. Vise juste, moins tu mets de coups, plus tu gagnes de points !":"Tiger: a real <b>par-3</b> hole is waiting for you. For each shot, pick your club: the <b>iron</b> to hit it far from the tee (maybe even straight in!), the <b>putter</b> to finish gently on the green. Aim well - the fewer shots you take, the more points you win!",
  "Aller jouer le trou !":"Play the hole!",
  "Voir mon resultat":"See my result",
  /* --- resultat --- */
  "Partie terminee":"Round complete",
  "Ton golfeur evolue !":"Your golfer is levelling up!",
  "Nouvel avatar debloque : {x} !":"New avatar unlocked: {x}!",
  "Nouveau fond de club house debloque : {x} !":"New clubhouse background unlocked: {x}!",
  "Nouvelle balle debloquee : {x} !":"New ball unlocked: {x}!",
  "Sans-faute total !":"Perfect round!",
  "Parfait du debut a la fin. Tiger applaudit tres fort !":"Perfect from start to finish. Tiger is cheering loudly!",
  "Superbe partie !":"Superb round!",
  "Il ne manque presque rien pour le sans-faute.":"You were so close to a perfect round.",
  "Bien joue !":"Well played!",
  "Continue a t'entrainer pour decrocher les 3 etoiles.":"Keep practising to earn all 3 stars.",
  "On continue de s'entrainer.":"Let's keep practising.",
  "Personne ne reussit du premier coup. Tiger croit en toi, on retente !":"Nobody gets it right first time. Tiger believes in you - let's try again!",
  "Meilleure serie : {n} d'affilee":"Best streak: {n} in a row",
  "NOUVEAU RECORD !":"NEW RECORD!",
  "dont {n} pts au putting":"incl. {n} pts from putting",
  "Rejouer cette etape":"Replay this level",
  "Retour a l'academie":"Back to the academy",
  "Trophee":"Trophy",
  "Un jeu imagine avec Coach Tiger, pour progresser sur les regles et l'etiquette du golf.<br>Inspire du programme des Drapeaux ffgolf / PGA France et des Regles du Golf. Outil de revision.":"A game created with Coach Tiger to learn the rules and etiquette of golf.<br>Based on the French Golf Federation (ffgolf / PGA France) Flags programme and the Rules of Golf (The R&amp;A and USGA). A revision tool.",
  /* --- drapeaux / etapes --- */
  "Drapeau vert":"Green Flag",
  "Drapeau rouge":"Red Flag",
  "Drapeau bleu":"Blue Flag",
  "Drapeau jaune":"Yellow Flag",
  "Drapeau blanc":"White Flag",
  "securite, etiquette, respect":"safety, etiquette, respect",
  "le green, le pitch, le marqueur":"the green, pitch marks, ball markers",
  "depart, ordre de jeu, rythme":"teeing off, order of play, pace",
  "regles du parcours, bunker, eau":"course rules, bunkers, water",
  "autonomie, regles completes":"playing on your own, the full rules",
  /* --- themes des questions --- */
  "Securite":"Safety",
  "Comportement":"Behaviour",
  "Green & pitch":"On the green",
  "Materiel":"Equipment",
  "But du jeu":"Aim of the game",
  "Etiquette":"Etiquette",
  "Regle de jeu":"Rules",
  "Rapidite":"Pace of play",
  "Score":"Score",
  /* --- avatars / fonds / balles --- */
  "Casquette verte":"Green Cap",
  "Casquette rouge":"Red Cap",
  "Bob jaune":"Yellow Bucket Hat",
  "Lunettes de soleil":"Sunglasses",
  "Chat golfeur":"Golfer Cat",
  "Koala cool":"Cool Koala",
  "Chouette pro":"Pro Owl",
  "Champion couronne":"Crowned Champion",
  "Practice au crepuscule":"Range at Dusk",
  "Bord de mer":"Seaside Links",
  "Nuit etoilee":"Starry Night",
  "Bunker dore":"Golden Bunker",
  "Salle des trophees":"Trophy Room",
  "Feu d'artifice":"Fireworks",
  "Automne":"Autumn",
  "Legende doree":"Golden Legend",
  "Classique":"Classic",
  "Jaune fluo":"Neon Yellow",
  "Rose":"Pink",
  "Bleue":"Blue",
  "Verte":"Green",
  "Rouge":"Red",
  "En or":"Gold",
  /* --- grandes animations --- */
  "BIRDIE !":"BIRDIE!",
  "SUPER COUP !":"GREAT SHOT!",
  "EAGLE !":"EAGLE!",
  "SERIE x{n} !":"STREAK x{n}!",
  "{n} bonnes reponses d'affilee":"{n} right answers in a row",
  "EN FEU !":"ON FIRE!",
  "Serie x{n} : tes points comptent double !":"Streak x{n}: your points count double!",
  "RATE !":"MISSED!",
  /* --- mini-jeux de putting --- */
  "Passer":"Skip",
  "Pose ton doigt sur la balle, tire vers l'arriere, relache !":"Put your finger on the ball, pull back, let go!",
  "TROP FORT !":"TOO HARD!",
  "TROP COURT !":"TOO SHORT!",
  "HORS DU GREEN !":"OFF THE GREEN!",
  "CALME-TOI ! 😅":"EASY THERE! 😅",
  "ENCORE UN ESSAI !":"ONE MORE TRY!",
  "Coup {a} / {b}":"Putt {a} / {b}",
  " (essai 2/2)":" (try 2/2)",
  "+{n} POINT":"+{n} POINT",
  "+{n} POINTS":"+{n} POINTS",
  "PUTT EN OR x2 (+{n})":"GOLDEN PUTT x2 (+{n})",
  "Parfait, tout est rentre !":"Perfect, every putt dropped!",
  "Beau parcours !":"Nice round!",
  "Pas facile, le putting...":"Putting is tricky...",
  "{m} putt reussi sur {n}":"{m} of {n} putts holed",
  "{m} putts reussis sur {n}":"{m} of {n} putts holed",
  "Choisis ton club !":"Pick your club!",
  "Fer":"Iron",
  "porte loin":"goes far",
  "precis":"accurate",
  "Tu es dans le bunker : le coup sera moins precis !":"You're in the bunker: this shot will be less accurate!",
  "Tu es loin : le fer porte plus loin.":"You're far away: the iron goes further.",
  "Tu es pres du trou : le putter est plus precis.":"You're close to the hole: the putter is more accurate.",
  "TROU EN UN !":"HOLE IN ONE!",
  "PAR !":"PAR!",
  "Coup {n} - {club}":"Shot {n} - {club}",
  "PLOUF ! A L'EAU":"SPLASH! IN THE WATER",
  "HORS LIMITE !":"OUT OF BOUNDS!",
  "ARRETEE":"STOPPED",
  "Trou en un !!":"Hole in one!!",
  "Birdie !":"Birdie!",
  "Par, joli trou !":"Par, nice hole!",
  "Bogey, pas mal !":"Bogey, not bad!",
  "Trou termine":"Hole finished",
  "Trou non termine":"Hole not finished",
  "En {n} coup":"In {n} shot",
  "En {n} coups":"In {n} shots",
  /* --- etiquettes dans les dessins --- */
  "traces dans le sable":"footprints in the sand",
  "trou":"hole",
  "marqueur":"marker",
  "G.U.R.":"GUR",
  "Flaque":"Puddle",
  "terrain en reparation":"ground under repair",
  "Zone jaune":"Yellow area",
  "Zone rouge":"Red area",
  "Quel est cet objet ?":"What is this object?",
  "Depart":"Tee",
  "balle A":"ball A",
  "balle B":"ball B",
  "joueur devant":"player ahead",
  "la motte":"the divot",
  "trou suivant":"next hole",
  "Chemin":"Path",
  "toi":"you",
  "balle enfoncee":"embedded ball",
  "pitch":"pitch mark",
  "genou":"knee",
  "passage":"crossing point"
};

function t(fr){ return (LANG==='en' && EN.hasOwnProperty(fr)) ? EN[fr] : fr; }
function tf(fr,vars){ var s=t(fr); for(var k in vars) s=s.split('{'+k+'}').join(vars[k]); return s; }
function tref(r){ return (LANG==='en' && r) ? r.replace('Regle','Rule') : r; }
function trScene(html){ return (LANG==='en' && html) ? html.replace(/>([^<>]+)<\/text>/g,function(m,s){return '>'+t(s)+'</text>';}) : html; }
/* question dans la langue courante (les traductions anglaises sont dans js/data-en.js) */
function loc(qd){
  if(LANG!=='en' || !qd || !qd.en) return qd;
  var o={}, k; for(k in qd) o[k]=qd[k]; for(k in qd.en) if(k!=='fr') o[k]=qd.en[k];
  return o;
}

/* --- bouton de langue (dans la barre du haut) --- */
var FLAG_SVG={
  en:'<svg width="22" height="14" viewBox="0 0 60 30" aria-hidden="true"><clipPath id="ukc"><path d="M0,0v30h60v-30z"/></clipPath><clipPath id="ukt"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><g clip-path="url(#ukc)"><path d="M0,0v30h60v-30z" fill="#012169"/><path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 60,30M60,0 0,30" clip-path="url(#ukt)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></g></svg>',
  fr:'<svg width="22" height="14" viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ED2939"/></svg>'
};
function applyStaticTexts(){
  document.documentElement.lang=LANG;
  document.title=t("Golf Academy - L'aventure des Drapeaux avec Coach Tiger");
  var sm=document.querySelector('.brand small'); if(sm) sm.textContent=t("L'aventure des drapeaux");
  var q=document.getElementById('quitbtn'); if(q){ q.title=t('Retour au menu'); q.setAttribute('aria-label',t('Retour au menu')); }
  var m=document.getElementById('mutebtn'); if(m){ m.title=t('Son'); m.setAttribute('aria-label',t('Son')); }
  var b=document.getElementById('langbtn');
  if(b){
    var other=LANG==='en'?'fr':'en';
    b.innerHTML=FLAG_SVG[other]+'<span>'+other.toUpperCase()+'</span>';
    b.title=other==='en'?'English version':'Version francaise';
    b.setAttribute('aria-label',b.title);
  }
}
/* chaque ecran qui peut etre redessine sans effet de bord s'enregistre ici */
var rerender=null;
function setLang(l){
  LANG=l;
  try{ localStorage.setItem('golf_lang',l); }catch(e){}
  applyStaticTexts();
  if(rerender) rerender();
}
