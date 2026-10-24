/* Petit Worker devant les fichiers statiques.
   Les fichiers existants (index.html, js/, assets/...) sont servis directement par Cloudflare ;
   ce code ne tourne que pour les adresses qui ne correspondent a aucun fichier.
   /api/pays renvoie le pays du visiteur (deduit de son IP par Cloudflare, rien n'est stocke)
   pour choisir la langue a la premiere visite. */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/pays') {
      return new Response(JSON.stringify({ pays: (request.cf && request.cf.country) || null }), {
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
      });
    }
    return env.ASSETS.fetch(request);
  }
};
