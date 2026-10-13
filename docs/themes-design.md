# Thèmes de design

Le site propose trois styles pour la carte : le **style actuel**, ainsi que les thèmes **Luxe** et **Moderne / tech**. Le style actuel reste sélectionné par défaut. Ce document explique à quoi ils servent, comment ils sont construits et comment en ajouter un.

## 1. Pourquoi ces trois thèmes ?

Le site s'adresse à des **particuliers comme à des entreprises**, avec une cible principale de développeurs. L'objectif n'est pas d'offrir un éditeur de design complet, mais quelques styles simples, déjà prêts, qui couvrent des besoins différents :

| Thème | Besoin couvert | Pour qui ? |
|---|---|---|
| **Style actuel** (`classic`) | Fond crème, encre brune et accents bordeaux/ocre, pour une présentation chaleureuse | Tout le monde ; le choix par défaut |
| **Luxe** | Une carte qui marque les esprits, avec un côté haut de gamme | Freelances, indépendants, personnes qui veulent se démarquer |
| **Moderne / tech** | Un style qui parle au monde du code | Développeurs, étudiants en informatique, profils techniques |

Choisir trois styles bien distincts, plutôt que dix styles proches, permet :
- de garder le projet **simple** à développer et à maintenir ;
- de montrer **différentes compétences CSS** (typographie, dégradés, ombres, animations) ;
- de couvrir le cas d'usage « carte rapide à faire en attendant une vraie carte » sans noyer l'utilisateur dans les choix.

Les trois styles s'inspirent des grandes familles de cartes de visite : sobre et épuré, haut de gamme (dorures, finitions soignées), moderne et interactif (QR code, effets).

## 2. Fiche de chaque thème

### 2.1 Style actuel (`classic`)

- **Idée** : fond crème, texte brun et accents bordeaux et ocre.
- **Pourquoi** : c'est le style chaleureux déjà présent sur le site ; il reste le choix par défaut pour préserver l'apparence actuelle.
- **Palette** :

| Rôle | Couleur |
|---|---|
| Fond de carte | `#FBF3E4` |
| Texte principal | `#3A2418` |
| Accent | `#7A2A2E` / `#B9791A` |

- **Polices** : Bricolage Grotesque pour les titres, DM Sans pour le texte.
- **Effets** : format horizontal, coins asymétriques, filet ocre, reflet doux et ombre papier.
- **Présentation** : coordonnées alignées sous le nom ; réseaux présentés en pastilles et QR code dans un cadre clair.
- **QR code** : modules sombres sur fond clair.

### 2.2 Luxe (`luxe`)

- **Idée** : fond sombre, accents dorés, finitions inspirées des cartes haut de gamme.
- **Pourquoi** : il donne une impression de qualité et de soin. Il reprend à l'écran l'esprit de la dorure et du papier épais des cartes imprimées.
- **Palette** :

| Rôle | Couleur |
|---|---|
| Fond | `#111111` |
| Texte principal | `#F5F0E6` |
| Accent (or) | `#C9A961` |

- **Polices** : Georgia pour les titres, avec une police système pour le texte.
- **Effets** :
  - fond profond avec halo doré et fin liseré métallique ;
  - nom et libellés mis en valeur par des accents or ;
  - ombre douce et léger relief au survol pour évoquer un papier épais.
- **QR code** : placé dans une **pastille claire**, car les QR inversés (clairs sur fond sombre) sont mal lus par certains lecteurs.

### 2.3 Moderne / tech (`tech`)

- **Idée** : fond sombre, accent vif, typographie à chasse fixe qui rappelle un terminal.
- **Pourquoi** : c'est le style naturel pour des développeurs. Il montre une sensibilité « tech » dès le premier coup d'œil.
- **Palette** :

| Rôle | Couleur |
|---|---|
| Fond | `#0D1117` |
| Texte principal | `#E6EDF3` |
| Accent (option A) | `#58A6FF` |
| Accent (option B) | `#3DDC97` |

- **Polices** : pile monospace système pour évoquer un terminal.
- **Effets** : trame discrète en grille, halo bleu, liseré lumineux et accents verts façon interface de développement.
- **QR code** : dans une **pastille claire**, comme pour le thème luxe.

## 3. Comment les thèmes sont construits

Il n'y a **qu'une seule structure HTML** pour la carte. Le choix est enregistré avec les données et appliqué à l'aperçu comme à la carte construite depuis ces données. `classic` conserve le style par défaut ; `luxe` et `tech` sont appliqués par l'attribut `data-theme` et des règles CSS :

```html
<section class="business-card" data-theme="luxe"> ... </section>
```

```css
.business-card[data-theme="luxe"] { background: #111; color: #F5F0E6; /* ... */ }
.business-card[data-theme="tech"] { background: #0D1117; color: #E6EDF3; /* ... */ }
```

Dans les données, la carte stocke le nom du thème dans le champ `theme`. Les anciennes cartes sans ce champ gardent le style actuel. Voir `format-des-donnees.md`.

## 4. Règles communes à tous les thèmes

- **Contraste** : le texte doit rester lisible. Viser un ratio d'au moins **4,5:1** pour le texte normal (outil de contraste WCAG). À surveiller en particulier pour l'or sur fond sombre et le gris secondaire sur blanc cassé.
- **QR code** : toujours des modules sombres sur fond clair, et une marge claire autour (zone de silence).
- **Responsive** : la carte doit rester lisible sur mobile.
- **Mouvement** : les effets de survol respectent la préférence système de réduction des animations.
- **Polices** : libres de droits (Google Fonts, le plus souvent sous licence SIL OFL) et **auto-hébergées** dans le dépôt pour ne pas envoyer l'adresse IP des visiteurs à Google.
- **Icônes** : Simple Icons (CC0). Les logos de réseaux ne servent qu'à désigner leur service.
- **Pas de dépendance au thème pour le contenu** : changer de thème ne modifie jamais les données saisies.

## 5. Ajouter un nouveau thème

1. Choisir un nom court en minuscules (par exemple `chaleureux`).
2. Ajouter un bloc `.business-card[data-theme="chaleureux"]` dans `css/creation.css`.
3. Vérifier le contraste et le scan du QR code sur ce thème.
4. Ajouter le nom dans la liste des thèmes acceptés par la validation (`format-des-donnees.md`, champ `theme`).
5. Ajouter l'option dans le sélecteur de thème du formulaire.
6. Documenter le thème dans ce fichier (idée, pourquoi, palette, polices, effets).
