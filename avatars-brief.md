# Golf Academy — brief visuels (avatars & personnages)

Ce fichier sert de référence commune : les prompts à coller dans Gemini,
et le **nom de fichier exact** à utiliser pour chaque image générée. En
gardant ces noms, il me suffira de les recevoir pour savoir exactement où
les intégrer dans le code (`index.html`), sans confusion possible.

## Comment procéder

1. Copie le **bloc de style** ci-dessous au début de chaque prompt (colle-le
   une fois dans Gemini puis enchaîne les prompts un par un dans la même
   conversation, si l'outil le permet — sinon recolle-le à chaque fois).
2. Génère chaque image en **carré**, fond plein (pas transparent) si possible.
3. Renomme le fichier téléchargé exactement comme indiqué dans la colonne
   **Nom de fichier**.
4. Envoie-moi les fichiers (tous d'un coup ou au fur et à mesure) — je les
   intègre directement grâce au nom.

> ⚠️ Changement d'archi à anticiper : le jeu est aujourd'hui 100% en SVG
> généré par code, sans aucune image externe (fichier unique, très léger).
> Passer à des PNG générés par IA veut dire intégrer de vrais fichiers
> images dans le projet — c'est faisable, mais on en reparle quand tu as
> les images (base64 embarqué dans le fichier, ou dossier `assets/` à part).

---

## Bloc de style (à coller au début de chaque prompt)

```
Style : illustration 2D flat "kawaii chibi", contours épais noir/anthracite,
couleurs vives et pastel saturées, très grands yeux ronds brillants avec un
petit reflet blanc, petites joues roses, proportions rondes et douces (tête
large, corps petit), rendu vectoriel propre façon icône d'application mobile
pour enfants. Cadrage : portrait buste/tête, vue de face légèrement 3/4,
centré. Fond : cercle uni gris anthracite foncé (#2c2d2e), pas de décor.
Sans texte, sans watermark, sans signature. Contenu 100% adapté aux enfants
de 7-12 ans : aucune violence, aucun élément effrayant, aucune connotation
adulte. Format carré, haute résolution, fond du cercle plein (pas de
transparence).
```

---

## 1. Avatars joueur (roster complet, 9 avatars)

Id code = valeur `id` dans `MASCOTS` / `avatarSVG()` dans `index.html`.

| Nom de fichier | Id code | Débloqué à | Description |
|---|---|---|---|
| `a1_lion.png` | `a1` | 0 étoile (départ) | Lion avec casquette de golf verte |
| `a2_renard.png` | `a2` | 0 étoile (départ) | Renard avec casquette de golf rouge |
| `a3_ours.png` | `a3` | 0 étoile (départ) | Ours avec bob de golf jaune |
| `a4_elephant.png` | `a4` | 0 étoile (départ) | Éléphant avec lunettes de soleil |
| `a5_chat.png` | `a5` | 3 étoiles | Chat avec visière de golf verte |
| `a6_koala.png` | `a6` | 6 étoiles | Koala avec bandeau violet + étoiles |
| `a7_chouette.png` | `a7` | 9 étoiles | Chouette studieuse |
| `a8_aigle.png` | `a8` | 12 étoiles | Aigle avec couronne dorée de champion |
| `a9_tigre.png` | `a9` | 15 étoiles (max) | Tigre avec casquette de golf verte |

### Prompts

**a1_lion.png**
```
Un lion mignon kawaii avec une crinière dorée bien fournie et douce,
portant une casquette de golf verte vissée sur la tête, grand sourire
chaleureux.
```

**a2_renard.png**
```
Un renard mignon kawaii orange avec des oreilles pointues et une bavette
blanche sur le museau, portant une casquette de golf rouge, sourire
malicieux.
```

**a3_ours.png**
```
Un ourson mignon kawaii brun avec de petites oreilles rondes et un museau
plus clair, portant un bob de golf jaune, expression douce et joviale.
```

**a4_elephant.png**
```
Un éléphanteau mignon kawaii gris avec de grandes oreilles tombantes et
une petite trompe recourbée, portant des lunettes de soleil noires
stylées, sourire cool.
```

**a5_chat.png**
```
Un chaton mignon kawaii orange avec des moustaches fines et des oreilles
pointues, portant une petite visière de golf verte, sourire malicieux.
```

**a6_koala.png**
```
Un koala mignon kawaii gris avec de grandes oreilles rondes et duveteuses
et un gros nez noir, portant un bandeau de sport violet, entouré de
petites étoiles dorées scintillantes, ambiance décontractée/cool.
```

**a7_chouette.png**
```
Une chouette/hibou mignon kawaii brun avec de très grands yeux ronds
expressifs et de petites aigrettes en forme d'oreilles, bec orange,
expression appliquée/studieuse.
```

**a8_aigle.png**
```
Un aiglon mignon kawaii blanc et gris avec un bec orange, portant
fièrement une couronne dorée de champion sur la tête, expression fière
et joyeuse.
```

**a9_tigre.png**
```
Un tigreau mignon kawaii orange avec des rayures noires douces et un
ventre crème, portant une casquette de golf verte, sourire éclatant,
moustaches fines.
```

---

## 2. Mascotte coach (guide du jeu — Coach Tiger)

Personnage utilisé dans les bulles de dialogue/tutoriel, **en pied**
(corps entier, pas juste la tête), 3 expressions nécessaires.

| Nom de fichier | Utilisation dans le code | Description |
|---|---|---|
| `coach_tiger_happy.png` | `tigerCoach('happy', ...)` | Tigre debout, bras levé, très joyeux |
| `coach_tiger_sad.png` | `tigerCoach('sad', ...)` | Tigre debout, déçu mais doux |
| `coach_tiger_neutral.png` | `tigerCoach(null/'', ...)` | Tigre debout, neutre/attentif |

### Prompts

**coach_tiger_happy.png**
```
Un tigre mignon kawaii en pied (corps entier, pas juste la tête), rayures
orange et noires, ventre crème, portant une casquette de golf verte
snapback, debout, un bras levé en signe d'encouragement, très grand
sourire joyeux, pose dynamique et accueillante.
```

**coach_tiger_sad.png**
```
Même personnage que ci-dessus (tigre mignon kawaii en pied, casquette de
golf verte, ventre crème) mais avec une expression triste et déçue,
petits sourcils tombants, bouche en accent circonflexe inversé, posture
légèrement affaissée — reste doux et jamais effrayant, juste un peu déçu.
```

**coach_tiger_neutral.png**
```
Même personnage (tigre mignon kawaii en pied, casquette de golf verte,
ventre crème) avec une expression neutre/attentive, sourire léger,
posture debout de repos, prêt à donner une explication.
```

---

## 3. Badge "Culture Golf" (questions bonus)

| Nom de fichier | Utilisation dans le code | Description |
|---|---|---|
| `badge_culture_golf.png` | `cultureBadge()` | Balle de golf diplômée sur badge doré |

### Prompt

**badge_culture_golf.png**
```
Une balle de golf blanche ronde avec un visage kawaii mignon (grands
yeux, petites joues roses, sourire), portant un petit chapeau de
diplômé noir (mortier de graduation) incliné sur le dessus, le tout sur
un badge circulaire doré, ambiance ludique "expert/champion du savoir".
```

---

## Récapitulatif — tous les fichiers attendus (13 au total)

```
a1_lion.png
a2_renard.png
a3_ours.png
a4_elephant.png
a5_chat.png
a6_koala.png
a7_chouette.png
a8_aigle.png
a9_tigre.png
coach_tiger_happy.png
coach_tiger_sad.png
coach_tiger_neutral.png
badge_culture_golf.png
```
