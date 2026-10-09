# Format des données

Ce document décrit comment une carte de visite est représentée, stockée, partagée et validée dans le projet.

## 1. Principe

Le site n'a ni serveur ni base de données (v1). Une carte est un simple **objet JSON** qui vit à trois endroits :

| Où | Pourquoi | Durée de vie |
|---|---|---|
| **L'URL** (partie après `#`) | Partager la carte et alimenter le QR code | Aussi longtemps que le lien existe |
| **`localStorage`** du navigateur | Retrouver ses cartes en rouvrant le site | Jusqu'à ce que l'utilisateur vide son navigateur |
| **Un fichier `.json`** exporté | Sauvegarde et transfert vers un autre appareil | Choisie par l'utilisateur |

## 2. Modèle d'une carte

```json
{
  "id": "c1f6a0e2-8d4b-4c1a-9b7e-2f3a5d6e7f80",
  "version": 1,
  "firstName": "Camille",
  "lastName": "Durand",
  "title": "Développeuse web",
  "theme": "minimal",
  "links": [
    { "type": "github", "url": "https://github.com/exemple" },
    { "type": "linkedin", "url": "https://www.linkedin.com/in/exemple" }
  ],
  "createdAt": "2026-10-09"
}
```

### Description des champs

| Champ | Type | Obligatoire | Règles |
|---|---|---|---|
| `id` | texte (UUID) | oui | Généré par le site, jamais saisi par l'utilisateur. Sert de clé pour retrouver la carte. |
| `version` | nombre | oui | Version du format (actuellement `1`). Permet de lire d'anciennes cartes après une évolution. |
| `firstName` | texte | oui | 1 à 50 caractères, espaces en début et fin supprimés. |
| `lastName` | texte | oui | 1 à 50 caractères, espaces en début et fin supprimés. |
| `title` | texte | non | 0 à 80 caractères (par exemple « Développeur web »). |
| `theme` | texte | oui | Un des thèmes existants : `minimal`, `luxe`, `tech`. Valeur inconnue = `minimal` par défaut. |
| `links` | tableau | non | 0 à 8 liens. |
| `links[].type` | texte | oui | Réseau choisi dans la liste (voir ci-dessous). |
| `links[].url` | texte | oui | Doit commencer par `https://`. |
| `createdAt` | texte (AAAA-MM-JJ) | oui | Date de création, générée par le site. |

### Types de liens

`github`, `linkedin`, `instagram`, `x`, `youtube`, `website`, `other`.

Chaque type correspond à une icône. `other` utilise une icône générique « lien » pour les sites qui ne sont pas dans la liste.

> **Choix à noter** : les adresses e-mail (`mailto:`) et numéros de téléphone (`tel:`) ne sont pas pris en charge en v1, car la règle « `https://` uniquement » les exclut. Ils pourront être ajoutés plus tard avec une règle de validation dédiée.

## 3. Règles de validation

Toute donnée reçue (formulaire, URL, fichier importé, `localStorage`) est **vérifiée avant d'être utilisée**. On ne fait jamais confiance au contenu.

1. **URL** : seuls les liens commençant par `https://` sont acceptés. Les autres (`http://`, `javascript:`, `data:`, etc.) sont refusés.
2. **Longueurs** : les limites du tableau ci-dessus sont appliquées ; au-delà, la saisie est refusée ou tronquée avec un message.
3. **Thème** : s'il n'existe pas, on retombe sur `minimal`.
4. **Type de lien** : s'il n'est pas connu, on utilise `other`.
5. **Affichage** : le texte saisi par l'utilisateur est affiché comme du **texte** (`textContent`), jamais interprété comme du HTML (`innerHTML`). Cela évite l'injection de code (XSS).
6. **Champs inconnus** : ignorés.

## 4. Partage par l'URL et QR code

Les données de la carte sont placées dans la partie **hash** de l'URL :

```
https://<adresse-du-site>/#d=<données encodées>
```

Par exemple, une fois le site publié sur GitHub Pages : `https://scorp984.github.io/carte-de-visite/#d=...` (adresse à confirmer au moment de la publication).

### Encodage (création du lien)

1. Prendre l'objet carte (sans champs inutiles).
2. Le transformer en texte JSON.
3. Convertir ce texte en **UTF-8** (important pour les accents).
4. Encoder en **base64 « URL-safe »** (remplacer `+` par `-`, `/` par `_`, retirer les `=` de fin).
5. Ajouter le résultat après `#d=` dans l'URL.

### Décodage (ouverture du lien)

Étapes inverses : lire `location.hash`, retirer `#d=`, décoder le base64, décoder l'UTF-8, parser le JSON, **valider** (section 3), puis afficher.

### Pourquoi le hash ?

- Il n'est pas envoyé au serveur lors de la visite : les données de la carte ne transitent pas par GitHub.
- Aucune base de données n'est nécessaire.

### Limites à connaître

- Plus l'URL est longue, plus le **QR code est dense** et difficile à scanner. Un QR contient au maximum environ 2 900 octets, mais **en pratique il vaut mieux rester bien en dessous** (quelques centaines de caractères) pour qu'il se scanne facilement sur un petit écran.
- Les données sont **lisibles par toute personne qui a le lien** : ne rien y mettre de confidentiel.
- Le lien contient la carte entière : si la carte change, il faut régénérer le lien et le QR.

## 5. Stockage dans le navigateur (`localStorage`)

- Les cartes de l'utilisateur sont conservées sous forme de liste d'objets carte.
- Au chargement, chaque carte lue est **revalidée** (section 3) : une carte corrompue ou modifiée à la main est ignorée ou corrigée.
- La taille disponible est limitée (de l'ordre de quelques Mo selon le navigateur), ce qui reste très large pour des cartes de quelques centaines d'octets.
- Les données sont propres à un navigateur sur un appareil : les cartes ne sont pas synchronisées.

## 6. Export et import JSON

**Export** : le site génère un fichier `.json` contenant un objet de ce type :

```json
{
  "format": "carte-de-visite",
  "version": 1,
  "cards": [ { "...": "carte 1" }, { "...": "carte 2" } ]
}
```

**Import** :
1. Lire le fichier choisi par l'utilisateur.
2. Vérifier que c'est du JSON valide et que `format` et `version` sont reconnus.
3. **Valider chaque carte** (section 3).
4. Si un `id` existe déjà, demander à l'utilisateur d'écraser ou de garder les deux.
5. Afficher le nombre de cartes importées et celles refusées.

## 7. Option : export vCard (contact)

Une carte peut aussi être exportée au format **vCard 3.0** (`.vcf`) pour être ajoutée directement au répertoire d'un téléphone.

| Champ de la carte | Champ vCard |
|---|---|
| `firstName`, `lastName` | `N` et `FN` |
| `title` | `TITLE` |
| `links[].url` | `URL` (un par lien) |

Exemple :

```
BEGIN:VCARD
VERSION:3.0
N:Durand;Camille;;;
FN:Camille Durand
TITLE:Développeuse web
URL:https://github.com/exemple
END:VCARD
```

## 8. Évolution du format

- Le champ `version` permet de savoir quel format une carte utilise.
- Quand un champ est ajouté ou modifié, on incrémente `version` et on écrit une fonction de **migration** qui transforme les anciennes cartes au chargement.
- Les nouveaux champs doivent avoir une valeur par défaut pour que les anciens liens et fichiers continuent de fonctionner.

## 9. Préparation d'une éventuelle base de données (bonus)

Si des comptes sont ajoutés plus tard (par exemple avec Supabase), le modèle de carte reste le même : `id` devient la clé primaire, et une colonne `owner` (identifiant utilisateur) s'ajoute côté base. Les règles de validation de la section 3 restent obligatoires côté site.
