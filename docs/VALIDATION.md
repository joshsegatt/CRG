# Validation de la révision locale

Contrôles effectués le 11 novembre 2026, avant publication.

| Contrôle                      | Résultat observé                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Prettier 3.10.0               | Sources, tests, scripts et documentation formatés                                                                        |
| `npm run lint`                | Syntaxe des 21 modules JavaScript vérifiée                                                                               |
| `npm test`                    | 21 tests réussis, aucun échec ni test ignoré                                                                             |
| `npm run build`               | 30 pages statiques FR/EN générées                                                                                        |
| `npm run check`               | 810 références internes et couverture de traduction vérifiées                                                            |
| Build public isolé            | 30 URL canoniques et variantes de langue ; 24 URL dans le sitemap ; origine HTTPS exigée                                 |
| Navigateur, 320 px et 1280 px | 30 pages à chaque largeur, sans débordement horizontal                                                                   |
| Navigateur, 390 px            | Menu, Escape, langue, FAQ et contact vérifiés                                                                            |
| Contact                       | Erreurs FR/EN, choix du métier conservé lors du changement de langue, résumé EN et destination SMS +33611499153 vérifiés |
| Console navigateur            | Aucun avertissement ou erreur observé pendant le parcours contrôlé                                                       |
| Revue indépendante            | Approuvée après attaques sur la configuration publique, la localisation et les états du menu                             |

Impeccable 4.8.2 a chargé le contexte puis analysé les pages d’accueil, contact, secteurs et Genève/Veyrier, ainsi que les styles. Les avertissements de petite typographie ont entraîné un passage à 12px minimum pour les textes concernés. Montserrat est conservée conformément à la marque. Les avertissements statiques d’espacement ont été comparés au navigateur : 26px sous les repères, 104px dans les sections approche et secteurs, 67px dans la bande de contact et 24px au-dessus du pied de page. Aucun résultat « zéro avertissement » du détecteur n’est revendiqué.

Les préférences de mouvement réduit sont couvertes par la logique testée et les règles CSS ciblées. Une émulation système de cette préférence n’était pas exposée par le navigateur utilisé. Le SMS a été inspecté comme lien ; aucun message réel n’a été envoyé et l’ouverture sur téléphone physique reste à tester.

Sans JavaScript, les contenus statiques et liens de téléphone restent disponibles, mais le formulaire par étapes et le menu mobile demandent JavaScript. Aucun backend de contact n’est installé.

Non effectué : achat du domaine, déploiement public, indexation réelle, connexion Search Console, modification de la fiche Google ou mesure de positionnement. Les informations légales signalées dans le README restent à compléter avant lancement.
