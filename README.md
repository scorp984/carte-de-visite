# Carte de visite

Petit site pour créer rapidement une carte de visite numérique avec un **QR code généré automatiquement**.
Le tout en **HTML, CSS et JavaScript pur** : pas de backend, pas de base de données, pas de framework.

## Fonctionnalités

- **Création rapide** : un formulaire (nom, email, téléphone, site web) et la carte s'affiche tout de suite.
- **3 thèmes** : classique (sable/bordeaux), luxe (noir et or) et moderne/tech.
- **Réseaux sociaux** : jusqu'à 3 réseaux, ajoutables et supprimables dynamiquement.
- **QR code automatique** : il contient l'adresse de la carte, scanner le QR affiche donc la carte sur le téléphone.
- **Page de partage** (`carte.html`) : affiche une carte à partir de l'URL du QR code, ou de la dernière carte enregistrée dans le navigateur.
- **Export PDF** : bouton de téléchargement basé sur l'impression du navigateur, avec une mise en page au format carte de visite.
- **Site web cliquable** : le lien n'est activé que s'il commence par `https://`.

## Comment ça marche

Il n'y a aucun serveur : toutes les infos de la carte sont encodées **dans l'URL** du QR code.

1. Le formulaire est transformé en objet JSON.
2. Le JSON est encodé en base64 (compatible accents et caractères spéciaux).
3. Il est placé dans le paramètre `d` : `carte.html?d=...`.
4. Le QR code est généré avec cette URL.
5. `carte.html` lit le paramètre `d`, le décode et reconstruit la carte.

La dernière carte créée est aussi sauvegardée dans le `localStorage` du navigateur.

> Les infos (email, téléphone...) sont donc dans l'URL du QR code : une carte déjà partagée ne peut pas être supprimée.

## Structure du projet

```
carte-de-visite/
├── html/
│   ├── index.html       # Page d'accueil
│   ├── creation.html    # Formulaire de création + aperçu
│   └── carte.html       # Page de partage (ouverte via le QR code)
├── css/
│   ├── style.css        # Style de la page d'accueil et des boutons
│   └── creation.css     # Formulaire, carte, thèmes, mise en page d'impression
└── js/
    ├── creation.js      # Formulaire, réseaux sociaux, aperçu de la carte
    ├── carte.js         # Lecture et affichage de la carte depuis l'URL
    ├── qr-code.js       # Encodage de la carte et génération du QR code
    └── pdf-download.js  # Bouton de téléchargement PDF
```

## Lancer le projet

Pas d'installation. Ouvre `html/index.html` dans ton navigateur, ou lance un petit serveur local :

```bash
python -m http.server 8000
```

Puis va sur `http://localhost:8000/html/index.html`.

> **Important :** en local, le QR code pointe vers `localhost` ou `file://`, donc il ne fonctionnera pas sur un autre appareil.
> Pour qu'il soit scannable depuis un téléphone, le site doit être en ligne (voir ci-dessous).

## Technologies

- HTML5, CSS3 (grid, variables CSS, media queries, styles d'impression)
- JavaScript (DOM, `FormData`, `URLSearchParams`, `localStorage`, `TextEncoder`)
- [qrcodejs](https://github.com/davidshimjs/qrcodejs) 1.0.0 via cdnjs pour la génération du QR code
- Polices Google Fonts : Bricolage Grotesque et DM Sans

## Sécurité

- Les données saisies ou lues dans l'URL sont ajoutées avec `textContent`, jamais avec `innerHTML` : pas d'injection HTML.
- Seuls les liens `https://` sont rendus cliquables.
- Les données d'une carte partagée sont validées (objet attendu, 3 réseaux maximum, thèmes limités à une liste connue).

## Pistes d'amélioration

- Séparer le nom en **prénom / nom** et ajouter un champ **métier / titre** (le champ actuel est « nom de l'entreprise »).
- Réseaux sociaux avec **nom + lien cliquable** (GitHub, LinkedIn...) au lieu de simples pastilles de texte.
- Vérifier la lisibilité du QR code à l'impression (le QR est dense quand il y a beaucoup de données) : couleurs plus contrastées, niveau de correction plus bas ou clés JSON plus courtes.
- Ajouter une empreinte d'intégrité (SRI) sur le script du CDN, ou passer à une bibliothèque QR maintenue.
- Plus tard, éventuellement : comptes utilisateurs et plusieurs cartes par compte (backend à prévoir).

## Auteur

Projet réalisé par Noah, ([scorp984](https://github.com/scorp984)).
