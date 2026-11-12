# Lancement du référencement

Le site n’a pas encore de domaine officiel ni de déploiement public validé. La version locale reste volontairement en `noindex, follow`. La compilation de production est testée avec une origine de test isolée ; elle ne publie rien.

## À valider avant publication

1. Acheter le domaine choisi et connecter un hébergement statique avec HTTPS. Servir `dist/` à la racine, avec une seule origine officielle et redirection de sa variante.
2. Compléter les informations légales : responsable de publication, e-mail professionnel et hébergeur. Confirmer les prestations et les informations commerciales.
3. Compiler avec les variables ci-dessous. Le build refuse l’activation publique sans origine HTTPS.

```powershell
$env:SITE_URL = 'https://votre-domaine.fr'
$env:SITE_INDEXABLE = '1'
npm run build
npm run check
```

L’adresse dans cet exemple est une syntaxe d’aide ; la remplacer par le domaine réellement acheté. Ne pas conserver une origine de test dans un site public.

## Contrôles sur le domaine réel

- Vérifier les trente pages, le certificat, le téléphone, les images, le menu mobile et les liens FR/EN. Les douze pages utiles par langue portent une consigne d’indexation et sont dans le sitemap ; les trois pages d’information par langue restent en `noindex`.
- Vérifier `/robots.txt`, `/sitemap.xml`, les URL canoniques et les alternances de langue. Le sitemap public contient vingt-quatre URL.
- Tester les données structurées avec le [test des résultats enrichis de Google](https://search.google.com/test/rich-results). Elles décrivent une seule entreprise située à Gex, avec des zones desservies en France et en Suisse. L’affichage d’un résultat enrichi n’est pas garanti.
- Vérifier la propriété du domaine dans [Google Search Console](https://search.google.com/search-console/about), envoyer le sitemap et inspecter les pages principales. L’inscription et l’indexation réelles restent à faire.
- Remplacer le lien « Site » de la fiche Google par le domaine officiel. Pour mesurer son origine, ajouter `?utm_source=google&utm_medium=organic&utm_campaign=business_profile` au lien ; les canoniques du site gardent l’URL propre. Aucun outil d’analytics n’est actuellement installé.

## Après lancement

Comparer mensuellement les appels et interactions de la fiche, puis les impressions, clics et requêtes dans Search Console. Ces mesures seront disponibles seulement après connexion des propriétés et collecte réelle. Ajouter ensuite des réalisations photographiées avec accord du client, avec une description factuelle des travaux et du secteur.

Les pages régionales doivent rester utiles et distinctes. Ne pas créer une série de pages identiques en changeant seulement la ville, ni des agences fictives en Suisse. Le classement dépend notamment de la pertinence, de la distance et de la notoriété ; aucun rang ni délai n’est promis.

## Sources officielles

- [Améliorer le classement local](https://support.google.com/business/answer/7091?hl=fr).
- [Signaler les versions linguistiques](https://developers.google.com/search/docs/specialty/international/localized-versions).
- [Permettre le crawl pour lire une consigne noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- [Données structurées LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- [Règles antispam et pages satellites](https://developers.google.com/search/docs/essentials/spam-policies).
