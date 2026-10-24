# Déployer Golf Academy sur Cloudflare (sous-domaine)

Le site est statique : aucun build, aucune dépendance. Le repo contient déjà
la config Cloudflare (`wrangler.jsonc`, `_headers`, `.assetsignore`) et un mini Worker
(`worker.js`) qui ne sert que `/api/pays` : le pays du visiteur (déduit de l'IP par
Cloudflare, rien n'est stocké), utilisé à la première visite pour choisir français ou anglais.

## 1. Créer le projet (une seule fois)

1. Tableau de bord Cloudflare → **Workers & Pages** → **Create** → **Import a repository**.
2. Connecter GitHub si demandé, puis choisir le repo `Golf-quizz-enfant-2`.
3. Écran de configuration :
   - **Project name** : `golf-academy`
   - **Production branch** : `claude/golf-quiz-interactive-49v16x`
   - **Build command** : laisser vide
   - **Deploy command** : `npx wrangler deploy` (valeur par défaut)
4. **Deploy**. Le site est en ligne sur `golf-academy.<ton-compte>.workers.dev`.

## 2. Brancher le sous-domaine

1. Ouvrir le projet `golf-academy` → **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
2. Saisir le sous-domaine voulu, par exemple `golf.ton-domaine.com`.
3. Valider : Cloudflare crée l'enregistrement DNS et le certificat HTTPS tout seul
   (le domaine doit être géré dans le même compte Cloudflare). Compter quelques minutes.

## Ensuite

- Chaque push sur la branche de production redéploie automatiquement.
- Après une modif d'un fichier `css/` ou `js/`, incrémenter le `?v=` dans
  `index.html` pour que les téléphones ne gardent pas l'ancienne version en cache.
- Les fichiers `.md`, `.git`, `.github` et la config ne sont pas publiés (`.assetsignore`).

## Alternative : Cloudflare Pages

(Sans Worker, `/api/pays` n'existe pas : la langue est alors choisie d'après celle du navigateur.)


**Workers & Pages** → **Create** → onglet **Pages** → **Connect to Git** →
même repo, preset **None**, build command vide, **Build output directory** `/`.
Puis **Custom domains** → **Set up a custom domain**. Le fichier `_headers` est pris en compte aussi.
