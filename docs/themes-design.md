# Thèmes de design

Le site propose **3 thèmes de base** pour la carte. Ce document explique à quoi ils servent, pourquoi ils ont été choisis, comment ils sont construits et comment en ajouter un.

## 1. Pourquoi ces trois thèmes ?

Le site s'adresse à des **particuliers comme à des entreprises**, avec une cible principale de développeurs. L'objectif n'est pas d'offrir un éditeur de design complet, mais quelques styles simples, déjà prêts, qui couvrent des besoins différents :

| Thème | Besoin couvert | Pour qui ? |
|---|---|---|
| **Minimaliste** | Un rendu sobre, lisible et professionnel, qui va à l'essentiel | Tout le monde ; le choix « sûr » pour un CV, un entretien, un contact pro |
| **Luxe** | Une carte qui marque les esprits, avec un côté haut de gamme | Freelances, indépendants, personnes qui veulent se démarquer |
| **Moderne / tech** | Un style qui parle au monde du code | Développeurs, étudiants en informatique, profils techniques |

Choisir trois styles bien distincts, plutôt que dix styles proches, permet :
- de garder le projet **simple** à développer et à maintenir ;
- de montrer **différentes compétences CSS** (typographie, dégradés, ombres, animations) ;
- de couvrir le cas d'usage « carte rapide à faire en attendant une vraie carte » sans noyer l'utilisateur dans les choix.

Les trois styles s'inspirent des grandes familles de cartes de visite : sobre et épuré, haut de gamme (dorures, finitions soignées), moderne et interactif (QR code, effets).

## 2. Fiche de chaque thème

### 2.1 Minimaliste (`minimal`)

- **Idée** : lignes simples, grands espaces blancs, typographie soignée, couleurs neutres.
- **Pourquoi** : c'est le style le plus polyvalent et le plus lisible. Il fonctionne dans presque tous les contextes professionnels.
- **Palette** :

| Rôle | Couleur |
|---|---|
| Fond | `#FAFAF8` |
| Texte principal | `#1A1A1A` |
| Texte secondaire | `#6B6B6B` |

- **Polices** : Inter (ou IBM Plex Sans) pour les titres et le texte.
- **Effets** : fines lignes de 1 px, marges généreuses. Pas d'animation voyante.
- **QR code** : modules sombres sur fond clair, sans contrainte particulière.

### 2.2 Luxe (`luxe`)

- **Idée** : fond sombre, accents dorés, finitions inspirées des cartes haut de gamme.
- **Pourquoi** : il donne une impression de qualité et de soin. Il reprend à l'écran l'esprit de la dorure et du papier épais des cartes imprimées.
- **Palette** :

| Rôle | Couleur |
|---|---|
| Fond | `#111111` |
| Texte principal | `#F5F0E6` |
| Accent (or) | `#C9A961` |

- **Polices** : Playfair Display pour les titres, Inter pour le texte.
- **Effets** :
  - dégradé doré (`linear-gradient` combiné à `background-clip: text`) sur le nom ou la bordure ;
  - ombre douce autour de la carte pour l'effet « papier épais » ;
  - léger reflet au survol pour imiter un vernis.
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

- **Polices** : Space Grotesk pour les titres, JetBrains Mono pour le texte.
- **Effets** : bordure ou ombre lumineuse (`box-shadow`), petite animation au survol.
- **QR code** : dans une **pastille claire**, comme pour le thème luxe.

## 3. Comment les thèmes sont construits

Il n'y a **qu'une seule structure HTML** pour la carte. Le thème change uniquement l'apparence grâce à un attribut et à des variables CSS :

```html
<div class="card" data-theme="luxe"> ... </div>
```

```css
.card {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-text);
}

.card[data-theme="minimal"] { --bg: #FAFAF8; --text: #1A1A1A; /* ... */ }
.card[data-theme="luxe"]    { --bg: #111111; --text: #F5F0E6; /* ... */ }
.card[data-theme="tech"]    { --bg: #0D1117; --text: #E6EDF3; /* ... */ }
```

Variables principales : `--bg`, `--text`, `--text-muted`, `--accent`, `--font-title`, `--font-text`.

Dans les données, la carte ne stocke que le **nom du thème** (champ `theme`). Voir `format-des-donnees.md`.

## 4. Règles communes à tous les thèmes

- **Contraste** : le texte doit rester lisible. Viser un ratio d'au moins **4,5:1** pour le texte normal (outil de contraste WCAG). À surveiller en particulier pour l'or sur fond sombre et le gris secondaire sur blanc cassé.
- **QR code** : toujours des modules sombres sur fond clair, et une marge claire autour (zone de silence).
- **Responsive** : la carte doit rester lisible sur mobile.
- **Polices** : libres de droits (Google Fonts, le plus souvent sous licence SIL OFL) et **auto-hébergées** dans le dépôt pour ne pas envoyer l'adresse IP des visiteurs à Google.
- **Icônes** : Simple Icons (CC0). Les logos de réseaux ne servent qu'à désigner leur service.
- **Pas de dépendance au thème pour le contenu** : changer de thème ne modifie jamais les données saisies.

## 5. Ajouter un nouveau thème

1. Choisir un nom court en minuscules (par exemple `chaleureux`).
2. Ajouter un bloc `.card[data-theme="chaleureux"]` avec toutes les variables de la section 3.
3. Vérifier le contraste et le scan du QR code sur ce thème.
4. Ajouter le nom dans la liste des thèmes acceptés par la validation (`format-des-donnees.md`, champ `theme`).
5. Ajouter l'option dans le sélecteur de thème du formulaire.
6. Documenter le thème dans ce fichier (idée, pourquoi, palette, polices, effets).
