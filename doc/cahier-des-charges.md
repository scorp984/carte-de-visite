# Cahier des charges – Générateur de carte de visite pour développeurs
 
## 1. Contexte et objectif
 
Site web simple qui permet à un utilisateur de créer sa carte de visite de développeur : il saisit ses informations (nom, prénom, titre, liens vers ses réseaux), choisit un design parmi quelques thèmes prédéfinis, et obtient une carte accompagnée d'un **QR code généré automatiquement** qui renvoie vers sa version web.
 
Le site peut aussi servir à réaliser une carte basique, rapide à faire, en attendant d'avoir une vraie carte de visite (imprimée ou professionnelle).
 
Le projet sert aussi de vitrine : il montre mes compétences en développement web (HTML, CSS, JavaScript). Il n'a pas vocation à devenir un gros produit.
 
## 2. Fonctionnalités
 
### Indispensable (v1)
- Formulaire de saisie : nom, prénom, titre, liens vers les réseaux (GitHub, LinkedIn, etc.).
- Choix du réseau dans une liste, avec son icône ; icône générique pour les autres liens.
- 3 thèmes de design : minimaliste, luxe, moderne/tech.
- Aperçu de la carte en direct.
- QR code généré automatiquement à partir des données de la carte.
- Validation des liens : seuls les liens en `https://` sont acceptés.
### Souhaitable
- Sauvegarde de plusieurs cartes dans le navigateur (`localStorage`).
- Export et import des cartes au format JSON.
- Téléchargement du QR code en image.
### Bonus (version ultérieure)
- Comptes utilisateurs et stockage des cartes via un service externe gratuit (par exemple Supabase), pour avoir plusieurs cartes par compte.
- Cette fonctionnalité n'est pas certaine : elle pourra être réalisée plus tard, si le temps le permet. La v1 doit rester complète et utilisable sans elle.
## 3. Contraintes
 
- Gratuit : hébergement sur GitHub (GitHub Pages).
- Technologies : HTML, CSS, JavaScript uniquement, sans backend dans la v1.
- Pas de base de données dans la v1 : les données de la carte sont encodées dans l'URL.
- Polices et icônes sous licence libre ; polices auto-hébergées.
- Le site doit rester simple et lisible sur mobile.
## 4. Hors périmètre
 
- Base de données et serveur propre.
- Paiement ou fonctionnalités commerciales.
- Éditeur de design libre (seuls les thèmes prédéfinis sont proposés).
## 5. Critères de réussite
 
- Le QR code se scanne correctement sur téléphone, sur chacun des 3 thèmes.
- Les accents et caractères spéciaux (é, è, ç, apostrophe) passent dans la carte et dans l'URL.
- Un lien qui n'est pas en `https://` est refusé.
- Le site s'affiche correctement sur mobile et sur ordinateur.
- Les cartes sauvegardées sont retrouvées après rechargement de la page.
## 6. Planning
 
1. Création du dépôt GitHub (README, licence, `.gitignore`).
2. Frontend de base (formulaire, aperçu, thèmes).
3. QR code.
4. Tests.
5. Corrections et améliorations.
6. Relecture du code et retours.
7. Publication sur GitHub Pages.
## 7. Risques et points d'attention
 
- **QR trop dense** si trop de données dans l'URL : limiter le nombre de champs.
- **Sécurité** : valider les URL saisies et afficher le texte utilisateur sans l'interpréter comme du HTML.
- **Lisibilité du QR sur fond sombre** : le placer sur une pastille claire.
- **RGPD** : auto-héberger les polices ; prévoir une politique de confidentialité si des comptes sont ajoutés.
- **Marques déposées** : les logos des réseaux ne servent qu'à désigner leurs services.