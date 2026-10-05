# Nouvelle version - comprendre le code de la carte et du QR code

Ce document explique comment lire les parties importantes du code, ce que font les fonctions et comment les fichiers fonctionnent ensemble.

## 1. La page HTML du formulaire

Dans `html/creation.html`, les champs du formulaire ont un `id` et un `name`.

```html
<input type="url" id="website" name="website" required>
<button id="generate-qr" type="button">Générer le QR code</button>
<div id="qrcode"></div>
```

- `type="url"` demande au navigateur de vérifier que la valeur ressemble à une adresse web.
- `required` rend le champ obligatoire.
- `id` sert au JavaScript à retrouver un élément précis avec `getElementById`.
- `name` sert à récupérer sa valeur dans `FormData`.
- `type="button"` évite que le bouton QR envoie le formulaire.
- `div#qrcode` est la zone où la bibliothèque dessinera le QR.

Les scripts sont chargés avec `defer` :

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" defer></script>
<script src="../js/qr-code.js" defer></script>
<script src="../js/creation.js" defer></script>
```

`defer` fait exécuter les scripts après l’analyse du HTML, tout en respectant leur ordre. La bibliothèque `qrcode.min.js` est donc disponible quand `qr-code.js` en a besoin.

## 2. Générer le QR code : `js/qr-code.js`

### Retrouver la zone QR

```js
const qrBox = document.getElementById("qrcode");
let qr = null;
```

La première ligne garde une référence vers le conteneur HTML. `qr` est une variable qui mémorise l’objet créé par la bibliothèque QR Code.

### Construire le QR

```js
function genererQR(url, cible = qrBox) {
  if (!cible) {
    throw new Error("Le conteneur du QR code est introuvable.");
  }

  if (typeof QRCode === "undefined") {
    throw new Error("La bibliothèque de génération du QR code n’est pas chargée.");
  }

  cible.replaceChildren();
  qr = new QRCode(cible, {
    text: url,
    width: 220,
    height: 220,
    colorDark: "#5a3a1e",
    colorLight: "#f3e3b8",
    correctLevel: QRCode.CorrectLevel.M
  });
}
```

- `url` est le texte que contiendra le QR. Ici, c’est l’adresse du site saisie par l’utilisateur.
- `cible = qrBox` donne une cible par défaut : le QR du formulaire.
- La cible et la bibliothèque sont vérifiées avant de continuer. `throw new Error(...)` rend l’erreur explicite si un élément manque.
- `replaceChildren()` supprime l’ancien QR avant d’en dessiner un nouveau.
- `text`, `width` et `height` définissent le contenu et la taille dessinée.
- `colorDark` et `colorLight` définissent les couleurs.
- `CorrectLevel.M` demande un niveau moyen de correction d’erreur du QR.

La même fonction peut recevoir une autre cible. `creation.js` s’en sert pour dessiner un deuxième QR dans l’aperçu de la carte.

### Réagir au clic

```js
document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.getElementById("generate-qr");
  if (!generateButton) return;

  generateButton.addEventListener("click", () => {
    const websiteInput = document.getElementById("website");
    if (!(websiteInput instanceof HTMLInputElement) || !websiteInput.reportValidity()) {
      return;
    }

    genererQR(websiteInput.value);
  });
});
```

- `DOMContentLoaded` attend que le HTML soit analysé avant de chercher les éléments.
- `addEventListener("click", ...)` exécute une fonction lorsque le bouton est cliqué.
- `instanceof HTMLInputElement` confirme que l’élément trouvé est bien un champ de saisie.
- `reportValidity()` demande au navigateur d’afficher les erreurs de validation, par exemple si l’adresse est vide ou invalide.
- `websiteInput.value` est l’adresse à encoder. Par exemple, `https://github.com/scorp984` fera ouvrir le profil GitHub au scan.

## 3. Construire l’aperçu : `js/creation.js`

### Retrouver les éléments du formulaire

Au début du fichier, les appels à `getElementById` récupèrent les boutons, le formulaire et les zones qui serviront à ajouter ou afficher le contenu. Le `if` qui suit vérifie que ces éléments existent ; sinon, le script s’arrête avec une erreur plutôt que de continuer dans un état incorrect.

### Ajouter et supprimer des champs sociaux

`ajouterChamp()` crée un nouveau groupe HTML composé d’un libellé et d’un champ texte. `document.createElement()` fabrique les éléments, puis `append()` et `appendChild()` les insèrent dans la page.

`supprimerChamp()` récupère `lastElementChild`, c’est-à-dire le dernier groupe social ajouté, puis le retire avec `remove()`. Si aucun groupe n’existe, `return` arrête la fonction sans rien supprimer.

À la fin du fichier, ces fonctions sont connectées aux boutons :

```js
boutonAjoutReseau.addEventListener("click", ajouterChamp);
boutonSuppressionReseau.addEventListener("click", supprimerChamp);
```

### Afficher une information

```js
function ajouterInformation(parent, etiquette, valeur) {
    const ligne = document.createElement("p");
    const titre = document.createElement("strong");
    titre.textContent = `${etiquette} : `;
    ligne.append(titre, document.createTextNode(valeur));
    parent.appendChild(ligne);
}
```

Cette fonction crée une ligne, met son étiquette en gras, ajoute la valeur comme texte, puis insère la ligne dans la carte. `textContent` et `createTextNode` insèrent du texte sans l’interpréter comme du HTML.

### Réagir à l’envoi du formulaire

```js
formulaire.addEventListener("submit", (event) => {
    event.preventDefault();
    const donnees = new FormData(formulaire);
    // Création de la carte à partir des champs...
});
```

`submit` est déclenché quand l’utilisateur clique sur « Créer la carte ». `preventDefault()` empêche le navigateur de recharger la page. `new FormData(formulaire)` rassemble les champs du formulaire ; `donnees.get("name")`, par exemple, récupère le champ ayant `name="name"`.

Le script crée une section pour la carte, puis ajoute les informations :

```js
const carte = document.createElement("section");
carte.className = "business-card";

ajouterInformation(carte, "Email", donnees.get("email"));
ajouterInformation(carte, "Téléphone", donnees.get("phone"));
ajouterInformation(carte, "Site web", donnees.get("website"));
```

`className` relie l’élément aux règles CSS `.business-card`. Le nom de l’entreprise est placé dans un titre `<h2>`. Les réseaux sociaux sont récupérés avec `getAll("social")`, car plusieurs champs peuvent porter le même `name`. `filter(...)` élimine les chaînes vides ; `forEach(...)` crée une ligne de liste pour chaque réseau restant.

Enfin, le QR de l’aperçu est construit :

```js
const qrCarte = document.createElement("div");
qrCarte.className = "business-card-qr";
genererQR(donnees.get("website"), qrCarte);
carte.appendChild(qrCarte);
apercuCarte.replaceChildren(carte);
```

Le QR de l’aperçu reçoit la même adresse du site. `replaceChildren(carte)` remplace l’ancien aperçu par la nouvelle carte.

## 4. Mise en forme : `css/creation.css`

Les sélecteurs CSS ciblent les éléments par identifiant ou classe :

- `#creation-form` cible le formulaire dont l’id est `creation-form`.
- `.business-card` cible la carte créée par JavaScript.
- `.business-card-qr` cible le conteneur du QR dans la carte.
- `.business-card-qr canvas, .business-card-qr img` cible le dessin QR produit par la bibliothèque, qu’il soit rendu en canvas ou en image.

La carte utilise une grille :

```css
.business-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1rem 1.5rem;
    align-items: start;
}
```

- `display: grid` organise le contenu en lignes et colonnes.
- `minmax(0, 1fr)` permet à la colonne de texte de rétrécir sans imposer une largeur minimale excessive.
- `auto` donne au QR la largeur dont il a besoin.
- `gap` définit l’espace entre les éléments.
- `align-items: start` aligne le contenu en haut.

`padding`, `border`, `border-radius` et `box-shadow` règlent respectivement l’espace intérieur, la bordure, l’arrondi et l’ombre. `overflow-wrap: anywhere` autorise la coupure d’une longue adresse afin qu’elle ne fasse pas déborder la carte.

La taille du QR est plafonnée par `max-width: 120px`. Une règle `@media (max-width: 40rem)` adapte la grille aux petits écrans : le texte et le QR s’empilent au lieu de rester côte à côte.

## 5. Bouton d’accueil : `css/style.css`

Le sélecteur `button` applique le style de base : fond dégradé, coins arrondis, ombre et curseur. `button:hover` s’applique au survol de la souris ; `button:active`, pendant le clic ; `:focus-visible`, quand le bouton reçoit le focus clavier.

`transition` anime progressivement les changements de couleur, de position et d’ombre. Le lien à l’intérieur du bouton est ciblé par `button a` pour le centrer, le colorer et retirer son soulignement.

## 6. Fichiers de l’ancienne destination carte

`html/carte.html` et `js/carte.js` forment un ancien parcours : la page lit un paramètre `d` de l’URL, le décode puis construit une carte à partir des données reçues.

Dans la version actuelle, le QR encode directement l’adresse saisie dans « Site web ». Il ouvre donc GitHub (ou l’adresse saisie), et non `carte.html`. Le code de cette page reste dans le projet, mais n’est pas appelé par les QR actuels.

## Parcours complet

1. Le formulaire HTML recueille les informations.
2. Le bouton « Générer le QR code » appelle `genererQR` avec l’adresse du champ « Site web ».
3. Le bouton « Créer la carte » déclenche l’événement `submit` et `creation.js` construit l’aperçu.
4. Le même `genererQR` est appelé une seconde fois avec comme cible le conteneur de QR de la carte.
5. Le téléphone lit l’adresse enregistrée dans le QR et ouvre cette destination.

## 7. Page d’accueil : `html/index.html`

La page d’accueil présente le projet et donne accès au formulaire de création.

```html
<link rel="stylesheet" href="../css/style.css">
```

Cette balise charge la feuille de styles générale. `../` signifie « remonter d’un dossier » depuis `html/`, puis entrer dans `css/`.

```html
<h1>Bienvenue sur le site</h1>
<p>Ce projet est un simple site web...</p>
```

`<h1>` est le titre principal de la page. `<p>` est un paragraphe de présentation.

Le tableau `<table>` contient une ligne `<tr>` et trois cellules d’en-tête `<th>`. Il présente les fonctionnalités annoncées sur la page. Ici, le tableau sert à disposer ces trois éléments en colonnes grâce au CSS.

```html
<button><a href="creation.html">Commencer</a></button>
```

Le lien `href="creation.html"` ouvre la page de création, située dans le même dossier `html/`. Le bouton est le point d’entrée vers le formulaire.

**Langue de la page :** la balise d’ouverture actuelle indique `lang="en"`, alors que le contenu est en français. `lang` aide les lecteurs d’écran et les outils de traduction à choisir la bonne langue ; cette valeur devrait être `fr`.

## 8. Feuille de styles générale : `css/style.css`

Cette feuille définit le thème partagé par l’accueil et la page de création.

### Variables de couleurs et polices

```css
:root {
    --fond: #efd9b6;
    --fond-carte: #fbf3e4;
    --encre: #3a2418;
    --encre-douce: #6b4a36;
    --ocre: #b9791a;
    --bordeaux: #7a2a2e;
}
```

`:root` représente la racine du document. Les propriétés qui commencent par `--` sont des variables CSS. Les autres règles peuvent réutiliser ces valeurs avec `var(--fond)`, ce qui rend la palette plus facile à ajuster de manière cohérente.

Les variables `--police-titre` et `--police-texte` définissent les polices de titre et de texte, suivies de polices de remplacement si la première n’est pas disponible.

### Règles générales

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}
```

Cette règle applique un calcul de largeur plus prévisible : la largeur déclarée d’un élément comprend aussi son padding et sa bordure.

`html` applique la couleur de fond. `body` limite la largeur générale, centre le contenu avec `margin: 0 auto`, ajoute des marges intérieures adaptatives et définit la couleur, la police et l’interligne.

### Titre et illustration

`h1` définit la taille, la police, la couleur et l’espacement du titre. `clamp(minimum, valeur adaptable, maximum)` permet à la taille de varier selon la largeur de l’écran sans descendre sous le minimum ni dépasser le maximum.

`body::before` crée une petite illustration décorative sans ajouter de balise HTML. Ses dégradés CSS dessinent des lignes qui évoquent une carte de visite. `pointer-events: none` empêche cette décoration de bloquer les clics.

### Tableau, bouton et adaptation

`tr` utilise `display: grid` et trois colonnes pour aligner les fonctionnalités de l’accueil. Les règles `button`, `button:hover`, `button:active` et `:focus-visible` donnent au bouton son apparence normale, son état au survol, son état pendant le clic et son repère de focus clavier.

Les règles `@media` changent le rendu à certaines tailles :

- sous `52rem`, la décoration est masquée ;
- sous `40rem`, les trois colonnes du tableau deviennent une seule colonne et le texte est légèrement réduit.

Cela permet à la page de rester lisible sur téléphone.

## 9. Structure complète du formulaire : `html/creation.html`

La page de création charge `creation.css`, qui importe à son tour `style.css`. Elle charge également la bibliothèque QR et les deux scripts applicatifs.

Chaque champ associe un `<label>` et un `<input>`. L’attribut `for` du label correspond à l’`id` de son champ : cliquer sur le texte du label place ainsi le curseur dans le champ.

- `type="text"` sert au nom et aux réseaux sociaux.
- `type="email"` vérifie que l’adresse a une forme d’email.
- `type="tel"` indique qu’il s’agit d’un numéro de téléphone.
- `type="url"` vérifie que la valeur a une forme d’adresse web.
- `required` demande de remplir le champ avant l’envoi.
- `placeholder` fournit un exemple indicatif dans le champ.

Les boutons d’ajout et de suppression ont `type="button"` : ils exécutent leur action sans envoyer le formulaire. Le bouton « Créer la carte » a `type="submit"` : il déclenche l’événement `submit` traité par `creation.js`.

`#qrcode` accueille le QR généré par le bouton. `#card-preview` accueille ensuite l’aperçu complet construit par le JavaScript. `aria-live="polite"` indique aux technologies d’assistance que le contenu de cette zone peut être mis à jour sans interrompre brutalement la lecture.

## 10. Autres règles de `css/creation.css`

La première ligne importe `style.css` pour réutiliser le thème général.

- `#creation-form` transforme le formulaire en grille verticale, limite sa largeur à `42rem` et lui donne un fond, une bordure et une ombre.
- `#creation-form label` distingue visuellement les intitulés des champs.
- `#social-links` et `.social-link-field` organisent les champs de réseaux sociaux en grille.
- `#creation-form input` fait occuper toute la largeur disponible aux champs et définit leur hauteur, leur fond, leur bordure et leurs espacements.
- `input::placeholder` colore le texte d’exemple.
- `input:focus-visible` met en évidence le champ actif au clavier.
- `#creation-form button` et ses états `:hover` / `:focus-visible` définissent le style et les retours visuels des boutons du formulaire.
- `#card-preview` et `#shared-card` limitent la largeur des zones d’aperçu et de carte partagée.
- `.card-error` met en forme les messages d’erreur créés par `carte.js`.
- `.business-card h2`, `h3`, `p` et `ul` ajustent les titres, paragraphes et listes de la carte.
- `.business-card a` colore le lien du site sur la carte partagée et autorise la coupure des URL très longues.
- `.shared-card` remplace la grille à deux colonnes par une seule, puisqu’une carte ouverte à partir de l’ancien lien encodé n’y affiche pas de QR.
- `.business-card-qr` centre le QR dans une pastille claire.

La règle mobile sous `40rem` fait passer la carte de deux colonnes à une seule et recentre le QR. Les boutons du formulaire s’étirent aussi sur la largeur disponible.

## 11. Page de carte partagée : `html/carte.html`

Cette page est distincte de l’accueil et du formulaire. Elle contient un titre et une zone vide destinée à recevoir la carte :

```html
<main id="shared-card" aria-live="polite"></main>
```

`id="shared-card"` permet à `carte.js` de retrouver cette zone. `aria-live="polite"` annonce son contenu lorsqu’il est ajouté dynamiquement.

Le script `../js/carte.js` est chargé avec `defer`, donc après l’analyse du HTML. La feuille `creation.css` est liée pour partager le thème et réutiliser les styles de carte.

## 12. Comprendre les commentaires et le code : `js/carte.js`

Cette page utilise l’ancien format de lien qui contient les données de carte dans un paramètre d’URL nommé `d`. **Le QR actuel ouvre directement l’adresse du champ « Site web » ; il ne mène pas vers cette page.** Cette page n’affichera donc les données que si on lui fournit un lien encodé correspondant à son format.

### Lire l’URL et retrouver le conteneur

```js
const container = document.getElementById("shared-card");
const encodedCard = new URLSearchParams(window.location.search).get("d");
```

La première ligne retrouve la zone HTML à remplir. La deuxième lit la chaîne de requête après le `?` dans l’URL, puis cherche la valeur du paramètre `d`.

### Afficher une erreur

```js
function afficherErreur(message) {
    const erreur = document.createElement("p");
    erreur.className = "card-error";
    erreur.textContent = message;
    container.replaceChildren(erreur);
}
```

Les commentaires présents dans le fichier indiquent le rôle des instructions juste après eux. Cette fonction crée un paragraphe, lui donne la classe CSS prévue pour les erreurs, lui assigne un message en texte, puis remplace le contenu du conteneur par ce message.

`textContent` ajoute du texte sans l’interpréter comme du code HTML. `replaceChildren()` enlève le contenu précédent avant d’insérer le message.

### Décoder les données

```js
function decoderCarte(encoded) {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
}
```

Les commentaires de `decoderCarte` expliquent les trois étapes :

1. `atob` décode la chaîne Base64 en contenu binaire.
2. `Uint8Array.from(...)` transforme ce contenu en octets.
3. `TextDecoder` reconstruit le texte UTF-8, puis `JSON.parse` transforme le JSON en objet JavaScript.

### Ajouter une ligne et ses liens

`ajouterInformation(parent, etiquette, valeur, href)` ignore les valeurs qui ne sont pas du texte ou qui sont vides. Elle crée ensuite une ligne avec son étiquette en gras.

Quand `href` est fourni, un élément `<a>` est créé : `href` définit sa destination et `textContent` son texte visible. `rel="noopener noreferrer"` applique des protections lorsque le lien est suivi. Sans `href`, la valeur est ajoutée comme simple texte.

Les commentaires dans cette fonction décrivent la création de la ligne, du titre et du lien, ainsi que leur insertion dans le parent.

### Vérifier puis construire la carte

Le bloc `if (!container)` arrête le script avec une erreur explicite si la page HTML ne contient pas le conteneur attendu.

Si le paramètre `d` manque, `afficherErreur(...)` affiche un message. Sinon, un bloc `try` tente de décoder les données. Le code vérifie que le résultat est bien un objet et non un tableau ; un format incorrect déclenche une erreur.

Le script crée ensuite une section `.business-card`, ajoute le nom comme `<h2>`, puis utilise `ajouterInformation` pour l’email, le téléphone et le site. Les préfixes `mailto:` et `tel:` créent des liens pour envoyer un email ou appeler.

Pour les réseaux, `Array.isArray(data.reseaux)` vérifie que la valeur est une liste. `forEach` parcourt chaque entrée ; les valeurs non textuelles ou vides sont ignorées, et les autres sont ajoutées comme `<li>`.

À la fin, `container.replaceChildren(card)` affiche la carte. Si une erreur survient pendant le décodage ou la construction, `catch` affiche un message lisible et `console.error` conserve les détails techniques dans la console du navigateur.

## 13. Rôle des commentaires dans le code

Un commentaire JavaScript commence avec `//` et explique le code aux personnes qui le lisent ; il n’est pas exécuté par le navigateur. Par exemple :

```js
const encodedCard = new URLSearchParams(window.location.search).get("d"); // Récupère le paramètre « d »
```

Le commentaire explicite l’intention de la ligne, mais ce sont les appels JavaScript (`URLSearchParams`, `get`) qui font réellement le travail. Les commentaires HTML s’écrivent `<!-- commentaire -->` et les commentaires CSS `/* commentaire */`.
