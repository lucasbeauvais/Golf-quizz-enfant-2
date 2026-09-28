# Golf Academy — brief visuels FX, textures, mini-jeu, fonds d'écran

Même principe que `avatars-brief-v2-premium.md` : un méga-prompt à coller
dans Gemini, puis les prompts détaillés en secours. Les noms de fichiers
sont donnés pour chaque image — garde-les exacts, je les intègre
directement une fois reçus.

> ℹ️ Contrairement aux avatars, ces images ne remplacent pas du code
> existant à l'identique : je devrai adapter `js/fx.js`, `js/scenes.js`,
> `js/putting.js` et (plus tard) le club-house pour les utiliser. Envoie
> les images par lot (FX d'abord si tu veux prioriser, ou tout d'un coup)
> et dis-le moi, je m'occupe de l'intégration.

---

## Méga-prompt (à coller en un seul message dans Gemini)

```
Tu es un illustrateur 3D spécialisé dans les jeux vidéo pour enfants
(style Pixar/Disney). Génère-moi les 20 images suivantes, une par une,
en gardant un style cohérent sur l'ensemble (mêmes couleurs, même
ambiance chaleureuse et premium). Indique en légende le nom de fichier
donné pour chacune.

=== GROUPE 1 : EFFETS DE CÉLÉBRATION (7 images, cadrage carré sauf
mention contraire, fond cercle sombre avec léger dégradé radial et
quelques étincelles dorées, sans texte) ===

1. fx_ball.png — Gros plan sur une balle de golf blanche brillante en
rendu 3D, petits reflets de lumière sur sa surface alvéolée, légère
traînée de vitesse, ambiance dynamique et premium.

2. fx_fireball.png — Une balle de golf blanche entourée de flammes
oranges et dorées stylisées en 3D, effet de chaleur et d'énergie,
spectaculaire mais toujours ludique (pas effrayant).

3. fx_burst.png — Une explosion stylisée de confettis et d'étoiles
dorées/vertes en 3D, effet "boom" joyeux et festif, sans flammes ni
fumée agressive.

4. fx_trophy.png — Un trophée de golf doré et brillant en rendu 3D avec
une petite balle de golf posée dessus, éclat de lumière autour,
ambiance de victoire chaleureuse.

5. fx_birdie_scene.png — FORMAT PAYSAGE LARGE. Un green de golf vu de
légèrement au-dessus, trou et drapeau rouge bien visibles, une balle de
golf blanche qui roule vers le trou avec un léger effet de mouvement,
ciel bleu lumineux en arrière-plan, ambiance de réussite.

6. fx_drive_scene.png — FORMAT PAYSAGE LARGE. Un départ de golf (tee)
avec une balle qui s'envole haut dans un ciel bleu éclatant avec
quelques nuages, vue depuis le sol vers le ciel, sensation de puissance
et de distance.

7. fx_eagle_scene.png — FORMAT PAYSAGE LARGE. Un green de golf avec le
trou et un drapeau doré, entouré d'étincelles et petites étoiles
dorées flottantes, ambiance de moment exceptionnel et magique, ciel
lumineux.

=== GROUPE 2 : TEXTURES DE TERRAIN (4 images, vue de dessus stricte,
format carré, texture SEAMLESS/TILEABLE - doit se répéter sans coupure
visible dans toutes les directions, sans ombre d'objet, sans texte) ===

8. texture_grass.png — Herbe de fairway de golf tondue avec des rayures
de tonte alternées (bandes plus claires et plus foncées), vert naturel
et lumineux.

9. texture_green.png — Herbe de green de golf (très courte et dense),
motif de tonte en cercles ou bandes fines très régulières, vert plus
clair et lumineux que le fairway.

10. texture_sand.png — Sable de bunker de golf, grain doré/beige avec
de légères ondulations de râteau.

11. texture_water.png — Eau d'un obstacle d'eau de golf, bleu profond
avec de légers reflets et ondulations.

=== GROUPE 3 : MINI-JEU (1 image, format portrait vertical, plus haut
que large) ===

12. minigame_hole_course.png — Vue aérienne complète d'un trou de golf
par 3, du départ (tee) jusqu'au green avec le trou et le drapeau,
fairway avec rayures de tonte, un petit bunker de sable sur le côté,
vue du dessus légèrement inclinée, sans texte, sans personnage.

=== GROUPE 4 : FONDS D'ÉCRAN (8 images, FORMAT PORTRAIT VERTICAL ratio
9:16 façon fond d'écran de téléphone, détails les plus intéressants
dans le tiers inférieur de l'image, sans texte, sans personnage
identifiable) ===

13. bg1_practice.png — Un practice de golf au crépuscule, ciel orange
et violet, lampadaires qui s'allument, paniers de balles de golf
empilés au premier plan, ambiance calme et chaleureuse.

14. bg2_links.png — Un parcours de golf en bord de mer (links), herbes
hautes dorées, dunes, océan bleu turquoise à l'horizon, ambiance de
grand air.

15. bg3_starry.png — Un parcours de golf la nuit sous un ciel étoilé,
silhouettes d'arbres, green éclairé doucement par la lune, ambiance
magique et paisible.

16. bg4_bunker_gold.png — Un bunker de sable doré au coucher du soleil,
ombres longues et chaudes, ciel orange flamboyant.

17. bg5_trophy_room.png — Une salle de trophées de golf chaleureuse,
étagères en bois avec trophées dorés et balles de golf en vitrine,
lumière douce, ambiance de fierté.

18. bg6_fireworks.png — Un feu d'artifice coloré au-dessus d'un
parcours de golf de nuit, explosions de lumière dorées/vertes/roses,
ambiance de grande fête.

19. bg7_autumn.png — Un parcours de golf en automne, arbres aux
feuilles orange/rouge/dorées, lumière chaude d'après-midi.

20. bg8_legend_gold.png — Un parcours de golf baigné dans une lumière
dorée éclatante, particules dorées scintillantes dans l'air, ambiance
triomphale et prestigieuse - le fond le plus impressionnant de tous.
```

---

## Récapitulatif — tous les fichiers attendus (20 au total)

```
fx_ball.png
fx_fireball.png
fx_burst.png
fx_trophy.png
fx_birdie_scene.png
fx_drive_scene.png
fx_eagle_scene.png
texture_grass.png
texture_green.png
texture_sand.png
texture_water.png
minigame_hole_course.png
bg1_practice.png
bg2_links.png
bg3_starry.png
bg4_bunker_gold.png
bg5_trophy_room.png
bg6_fireworks.png
bg7_autumn.png
bg8_legend_gold.png
```

## Ce que je ferai une fois les images reçues

- **Groupe 1 (FX)** : remplace les formes dessinées en code dans
  `js/fx.js` — les panneaux `birdie_scene`/`drive_scene`/`eagle_scene`
  deviennent l'arrière-plan des célébrations plein écran, `fireball`
  remplace le dessin canvas du mode "EN FEU", `ball`/`burst`/`trophy`
  s'utilisent en accents ponctuels.
- **Groupe 2 (textures)** : deviennent des motifs de remplissage
  (`<pattern>` SVG) dans `js/scenes.js`, à la place des aplats/dégradés
  actuels — les éléments interactifs (balle, drapeau, zones cliquables)
  restent en vectoriel pour garder la précision du jeu.
- **Groupe 3 (mini-jeu)** : remplace les rayures dessinées au canvas
  dans `js/putting.js` (fond du trou par 3).
- **Groupe 4 (fonds d'écran)** : prêts pour la phase 3 (club-house), pas
  encore branchés dans le code — je les intègre quand on construit cet
  écran.
