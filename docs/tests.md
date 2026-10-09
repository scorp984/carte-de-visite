# Plan de tests

Ce document liste les tests à faire sur le site avant chaque publication. Le projet n'a pas de serveur ni de framework : la majorité des tests sont **manuels**, dans le navigateur, avec la console développeur ouverte (`F12`) pour repérer les erreurs.

## 1. Méthode

- **Quand** : après chaque étape importante (formulaire, QR code, thèmes, sauvegarde) et avant chaque publication sur GitHub Pages.
- **Comment** : suivre les tableaux ci-dessous, noter le résultat dans la colonne *Statut* (`OK`, `KO`, `À faire`) et, en cas d'échec, écrire le bug trouvé dans la section 10.
- **Navigateurs** : au minimum Chrome (ou Edge) et Firefox sur ordinateur, plus un téléphone réel.
- **Console** : aucune erreur rouge ne doit apparaître pendant l'utilisation normale.

## 2. Tests fonctionnels (formulaire et carte)

| ID | Cas | Étapes | Résultat attendu | Statut |
|---|---|---|---|---|
| F1 | Carte minimale | Saisir un prénom et un nom, rien d'autre | La carte s'affiche, sans erreur | À faire |
| F2 | Carte complète | Remplir tous les champs et ajouter plusieurs liens | Tous les éléments apparaissent sur la carte | À faire |
| F3 | Champs obligatoires | Laisser le prénom ou le nom vide | Message d'erreur clair, pas de carte générée | À faire |
| F4 | Aperçu en direct | Modifier un champ | L'aperçu se met à jour sans recharger | À faire |
| F5 | Changement de thème | Passer de `minimal` à `luxe` puis `tech` | Le style change, les données restent identiques | À faire |
| F6 | Ajout de lien | Ajouter un lien d'un type de la liste | L'icône correspondante s'affiche | À faire |
| F7 | Lien d'un site inconnu | Ajouter un lien de type `other` | L'icône générique s'affiche | À faire |
| F8 | Suppression de lien | Supprimer un lien | Il disparaît de la carte et du QR | À faire |
| F9 | Limite de liens | Ajouter plus de 8 liens | Le 9e est refusé avec un message | À faire |

## 3. Tests des données et de l'encodage

| ID | Cas | Étapes | Résultat attendu | Statut |
|---|---|---|---|---|
| D1 | Accents | Nom `Élodie Çelik-Brûlé` | Affichage correct, partout (carte, lien, QR) | À faire |
| D2 | Apostrophe et guillemets | Titre `Dév. "full-stack" d'Arras` | Affichage correct, aucune erreur | À faire |
| D3 | Emoji | Titre avec un emoji | Pas de plantage de l'encodage | À faire |
| D4 | Aller-retour | Générer le lien, l'ouvrir dans un nouvel onglet | La carte est identique à l'originale | À faire |
| D5 | Hash corrompu | Modifier à la main quelques caractères du lien | Message d'erreur propre, pas de page blanche | À faire |
| D6 | Hash vide ou absent | Ouvrir la page sans `#d=` | La page d'accueil ou le formulaire s'affiche normalement | À faire |
| D7 | Données incomplètes | Ouvrir un lien dont le JSON n'a pas tous les champs | Valeurs par défaut ou erreur claire | À faire |
| D8 | Ancienne version | Ouvrir un lien avec `version` inférieure (quand une évolution aura eu lieu) | La carte est migrée et s'affiche | À faire |

## 4. Tests de sécurité

| ID | Cas | Étapes | Résultat attendu | Statut |
|---|---|---|---|---|
| S1 | Lien `javascript:` | Saisir `javascript:alert(1)` comme URL | Refusé, aucun script ne s'exécute | À faire |
| S2 | Lien `http://` | Saisir `http://exemple.com` | Refusé (seul `https://` accepté) | À faire |
| S3 | Lien `data:` | Saisir `data:text/html,...` | Refusé | À faire |
| S4 | HTML dans le nom | Saisir `<img src=x onerror=alert(1)>` comme prénom | Affiché tel quel comme texte, aucune alerte | À faire |
| S5 | HTML dans le titre | Saisir `<script>alert(1)</script>` | Affiché comme texte, aucun script exécuté | À faire |
| S6 | Hash piégé | Construire un lien dont le JSON contient du HTML ou une URL `javascript:` | La validation le neutralise | À faire |
| S7 | Import JSON piégé | Importer un fichier avec des champs malveillants ou inconnus | Cartes invalides refusées, le reste fonctionne | À faire |
| S8 | `localStorage` modifié | Éditer à la main une carte dans les outils du navigateur | La carte est revalidée au chargement | À faire |
| S9 | Liens externes | Cliquer sur un lien de carte | S'ouvre sans exposer la page d'origine (`rel="noopener noreferrer"`) | À faire |
| S10 | Ressources externes | Regarder l'onglet Réseau (`F12`) | Pas de requête vers des services tiers non prévus | À faire |

## 5. Tests du QR code

| ID | Cas | Étapes | Résultat attendu | Statut |
|---|---|---|---|---|
| Q1 | Scan standard | Scanner le QR avec l'appareil photo d'un téléphone | La carte s'ouvre via le bon lien | À faire |
| Q2 | Un test par thème | Scanner le QR sur `minimal`, `luxe`, `tech` | Scan réussi pour chacun | À faire |
| Q3 | Plusieurs téléphones | Tester sur un téléphone Android et un iPhone si possible | Scan réussi | À faire |
| Q4 | Petite taille | Réduire l'affichage du QR | Reste lisible à une taille raisonnable | À faire |
| Q5 | Carte chargée | Remplir tous les champs au maximum | Le QR se génère et se scanne (sinon, réduire les données) | À faire |
| Q6 | Mise à jour | Modifier la carte | Le QR change en conséquence | À faire |
| Q7 | Téléchargement | Télécharger le QR (si la fonction existe) | L'image obtenue se scanne aussi | À faire |
| Q8 | Distance et éclairage | Scanner depuis un écran d'ordinateur et en lumière faible | Scan toujours possible | À faire |

## 6. Tests de sauvegarde (`localStorage`, export, import)

| ID | Cas | Étapes | Résultat attendu | Statut |
|---|---|---|---|---|
| L1 | Persistance | Créer une carte, recharger la page | La carte est retrouvée | À faire |
| L2 | Plusieurs cartes | Créer 3 cartes différentes | Elles sont toutes listées et ouvrables | À faire |
| L3 | Suppression | Supprimer une carte | Elle disparaît, les autres restent | À faire |
| L4 | Export | Exporter les cartes | Un fichier `.json` valide est téléchargé | À faire |
| L5 | Import | Importer ce même fichier dans un navigateur vierge | Les cartes réapparaissent | À faire |
| L6 | Import en doublon | Importer deux fois le même fichier | Le site demande quoi faire ou évite les doublons | À faire |
| L7 | Fichier invalide | Importer un fichier qui n'est pas du JSON | Message d'erreur clair, rien n'est cassé | À faire |
| L8 | Stockage vide ou refusé | Tester en navigation privée ou avec le stockage bloqué | Le site fonctionne, sans sauvegarde, avec un message | À faire |

## 7. Tests d'affichage et de compatibilité

| ID | Cas | Étapes | Résultat attendu | Statut |
|---|---|---|---|---|
| A1 | Mobile | Ouvrir sur téléphone (ou mode responsive de `F12`) | Pas de défilement horizontal, textes lisibles | À faire |
| A2 | Tablette | Largeur autour de 768 px | Mise en page correcte | À faire |
| A3 | Grand écran | Largeur 1920 px | La carte reste bien proportionnée | À faire |
| A4 | Navigateurs | Chrome, Firefox, Edge, Safari si possible | Rendu cohérent | À faire |
| A5 | Polices | Couper l'accès Internet après le premier chargement | Les polices auto-hébergées s'affichent encore | À faire |
| A6 | Longs textes | Nom et titre très longs | Le texte passe à la ligne ou est tronqué proprement, sans déborder | À faire |
| A7 | Zoom | Zoomer à 200 % | La page reste utilisable | À faire |

## 8. Tests d'accessibilité

| ID | Cas | Étapes | Résultat attendu | Statut |
|---|---|---|---|---|
| X1 | Contraste | Mesurer le contraste texte/fond de chaque thème | Au moins 4,5:1 pour le texte normal | À faire |
| X2 | Clavier | Naviguer avec `Tab`, valider avec `Entrée` | Tout est accessible, le focus est visible | À faire |
| X3 | Libellés | Vérifier que chaque champ a un `label` | Les champs sont bien décrits | À faire |
| X4 | Texte alternatif | Vérifier les icônes et le QR | Un texte alternatif ou un `aria-label` est présent | À faire |
| X5 | Lecteur d'écran (optionnel) | Tester avec un lecteur d'écran | Le contenu est compréhensible | À faire |

## 9. Tests de performance et de déploiement

| ID | Cas | Étapes | Résultat attendu | Statut |
|---|---|---|---|---|
| P1 | Chargement | Ouvrir l'onglet Réseau et recharger | Page légère, chargée rapidement | À faire |
| P2 | Console | Parcourir tout le site avec la console ouverte | Aucune erreur ni avertissement bloquant | À faire |
| P3 | Chemins relatifs | Publier sur GitHub Pages | CSS, JS, polices et images se chargent (pas d'erreur 404) | À faire |
| P4 | Lien partagé | Ouvrir un lien de carte sur le site publié | La carte s'affiche | À faire |
| P5 | Après modification | Refaire les tests critiques (F1, D4, S1, S4, Q1) | Rien n'a régressé | À faire |

## 10. Journal des bugs

À remplir au fur et à mesure.

| Date | Test concerné | Bug observé | Cause | Correction | Statut |
|---|---|---|---|---|---|
| | | | | | |

## 11. Tests prioritaires (à ne jamais sauter)

Avant toute publication : **F1, D1, D4, S1, S4, Q1 et Q2, L1, A1, P3**.
