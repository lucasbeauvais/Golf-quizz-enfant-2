# Golf Academy — brief visuels V2 (style premium façon "rendu 3D")

Suite au niveau de finition vu sur le quiz basket, ce brief régénère les
mêmes personnages (toujours des animaux, non genrés) dans un style plus
premium : rendu 3D façon mascotte de jeu vidéo, au lieu du flat kawaii
actuel.

**Les noms de fichiers restent identiques à `avatars-brief.md`** : une fois
générées, ces images remplacent simplement les fichiers actuels dans
`assets/avatars/` — aucun changement de code nécessaire.

## Méga-prompt (à coller en un seul message dans Gemini)

```
Tu es un illustrateur 3D spécialisé dans les mascottes de jeux vidéo pour
enfants (style Pixar/Disney, rendu doux et cinématique). Génère-moi 13
illustrations séparées, une par une, en gardant EXACTEMENT le même style
sur toutes les images :

STYLE COMMUN A TOUTES LES IMAGES :
Personnage animal rendu en 3D façon animation Pixar/Disney, éclairage
studio doux et cinématique, ombrage lisse et brillant, grands yeux
expressifs et brillants avec reflets, proportions rondes et attachantes,
fourrure/texture détaillée et soignée. Fond : cercle sombre avec un léger
dégradé radial et quelques petites étincelles/paillettes dorées en accent,
pas de décor complexe. Cadrage : portrait buste (épaules et tête), vue de
face légèrement 3/4, centré. Sans texte, sans watermark, sans signature.
Contenu 100% adapté aux enfants de 7-12 ans : aucune violence, aucun
élément effrayant, aucune connotation adulte. Format carré, haute
résolution, rendu professionnel et chaleureux.

Pour chaque image ci-dessous, indique en légende le nom de fichier donné
(ex: "a1_lion.png") pour que je m'y retrouve.

1. a1_lion.png — Un lionceau avec une crinière dorée bien fournie et
douce, portant une casquette de golf verte, grand sourire chaleureux,
tenue de golf (polo vert) visible sur les épaules.

2. a2_renard.png — Un renardeau orange avec des oreilles pointues et une
bavette blanche sur le museau, portant une casquette de golf rouge,
sourire malicieux, polo rouge.

3. a3_ours.png — Un ourson brun avec de petites oreilles rondes et un
museau plus clair, portant un bob de golf jaune, expression douce et
joviale, polo jaune.

4. a4_elephant.png — Un éléphanteau gris avec de grandes oreilles
tombantes et une petite trompe recourbée, portant des lunettes de soleil
noires stylées, sourire cool, polo gris/blanc.

5. a5_chat.png — Un chaton orange avec des moustaches fines et des
oreilles pointues, portant une petite visière de golf verte, sourire
malicieux, polo vert clair.

6. a6_koala.png — Un koala gris avec de grandes oreilles rondes et
duveteuses et un gros nez noir, portant un bandeau de sport violet,
quelques petites étincelles dorées flottant autour, polo blanc/violet.

7. a7_chouette.png — Une chouette/hibou brun avec de très grands yeux
ronds expressifs et de petites aigrettes en forme d'oreilles, bec orange,
expression studieuse et attentive.

8. a8_aigle.png — Un aiglon blanc et gris avec un bec orange, portant
fièrement une couronne dorée de champion, expression fière et joyeuse.

9. a9_tigre.png — Un tigreau orange avec des rayures noires douces et un
ventre crème, portant une casquette de golf verte, sourire éclatant,
moustaches fines, polo vert.

10. coach_tiger_happy.png — Personnage EN PIED (corps entier, pas juste
la tête) : le même tigre que a9 mais en version mascotte complète, debout
dans une tenue de golf complète (polo vert, short/pantalon assorti),
portant sa casquette verte, un bras levé en signe d'encouragement, très
grand sourire joyeux, pose dynamique. Fond cercle sombre identique au
style ci-dessus.

11. coach_tiger_sad.png — Même personnage en pied que le 10, même tenue,
mais expression triste et déçue, sourcils tombants, posture légèrement
affaissée — reste doux et jamais effrayant, juste un peu déçu.

12. coach_tiger_neutral.png — Même personnage en pied que le 10, même
tenue, mais expression neutre et attentive, sourire léger, posture de
repos, prêt à donner une explication.

13. badge_culture_golf.png — Une balle de golf blanche ronde avec un
visage mignon et expressif (grands yeux, sourire), portant un petit
chapeau de diplômé noir (mortier de graduation) incliné sur le dessus,
rendu 3D glossy, sur un badge circulaire doré brillant, ambiance ludique
"expert/champion du savoir".
```

## Points d'attention

- Génère en fond carré plein (cercle sombre avec dégradé), pas transparent
  — c'est ce qui se fond le mieux dans le thème actuel de l'app.
- Une fois les images reçues, redimensionne-les si besoin (les fichiers
  actuels font 320×320, pas besoin de plus grand pour un avatar affiché
  à 30-130px) et envoie-les moi avec les noms de fichiers ci-dessus : je
  les remplace directement dans `assets/avatars/`, sans toucher au code.
- Les fonds de parcours (à débloquer avec les points, façon "vestiaire"
  du quiz basket) viendront dans un brief séparé une fois cette phase-là
  lancée — inutile de les générer maintenant.
