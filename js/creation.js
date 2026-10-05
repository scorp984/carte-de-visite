// Récupère les éléments HTML utilisés pour gérer le formulaire et ses aperçus.
const boutonAjoutReseau = document.getElementById("add-social");
const conteneurReseaux = document.getElementById("social-links");
const boutonSuppressionReseau = document.getElementById("remove-social");
const formulaire = document.getElementById("creation-form");
const apercuCarte = document.getElementById("card-preview");

// Arrête le script immédiatement si la page ne contient pas un élément requis.
if (!boutonAjoutReseau || !conteneurReseaux || !boutonSuppressionReseau || !formulaire || !apercuCarte) {
    throw new Error("Un élément nécessaire au formulaire de création est introuvable.");
}

// Sert à donner un identifiant unique à chaque nouveau champ de réseau social.
let nombreReseaux = 2;

function ajouterChamp() {
    // Crée un groupe contenant le libellé et le champ du nouveau réseau.
    const champId = `social-${nombreReseaux}`;
    const groupe = document.createElement("div");
    groupe.className = "social-link-field";

    // Lie le libellé au champ pour faciliter la saisie, notamment au clavier.
    const label = document.createElement("label");
    label.htmlFor = champId;
    label.textContent = `Réseau social ${nombreReseaux} :`;

    // Le même name="social" permet de récupérer tous les réseaux avec FormData.
    const champ = document.createElement("input");
    champ.type = "text";
    champ.id = champId;
    champ.name = "social";
    champ.placeholder = "Ex. LinkedIn";

    groupe.append(label, champ);
    conteneurReseaux.appendChild(groupe);
    // Incrémente le numéro pour que le prochain identifiant soit différent.
    nombreReseaux += 1;
}

function supprimerChamp() {
    // Retire le dernier groupe ajouté, s'il y en a un.
    const dernierGroupe = conteneurReseaux.lastElementChild;
    if (!dernierGroupe) {
        return;
    }

    dernierGroupe.remove();
    nombreReseaux -= 1;
}

function ajouterInformation(parent, etiquette, valeur) {
    // Construit une ligne d'information en ajoutant le contenu comme texte,
    // sans interpréter les valeurs saisies comme du code HTML.
    const ligne = document.createElement("p");
    const titre = document.createElement("strong");
    titre.textContent = `${etiquette} : `;
    ligne.append(titre, document.createTextNode(valeur));
    parent.appendChild(ligne);
}

// Intercepte l'envoi du formulaire pour afficher la carte sans recharger la page.
formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    // FormData associe chaque valeur saisie à l'attribut name de son champ.
    const donnees = new FormData(formulaire);
    const carte = document.createElement("section");
    carte.className = "business-card";

    // Ajoute le nom comme titre principal de la carte.
    const titre = document.createElement("h2");
    titre.textContent = donnees.get("name");
    carte.appendChild(titre);

    // Ajoute les coordonnées principales à l'aperçu.
    ajouterInformation(carte, "Email", donnees.get("email"));
    ajouterInformation(carte, "Téléphone", donnees.get("phone"));
    ajouterInformation(carte, "Site web", donnees.get("website"));

    // getAll récupère tous les champs portant name="social" ; les champs vides
    // sont ignorés pour ne pas afficher de lignes sans contenu.
    const reseaux = donnees.getAll("social").filter((reseau) => reseau.trim() !== "");
    if (reseaux.length > 0) {// Vérifie si des réseaux sociaux ont été saisis
        const titreReseaux = document.createElement("h3");// Crée un élément <h3> pour le titre des réseaux sociaux
        titreReseaux.textContent = "Réseaux sociaux";// Définit le texte du titre des réseaux sociaux
        carte.appendChild(titreReseaux);// Ajoute le titre des réseaux sociaux à la carte

        const listeReseaux = document.createElement("ul");// Crée un élément <ul> pour contenir la liste des réseaux sociaux
        reseaux.forEach((reseau) => {// Parcourt chaque réseau social saisi
            const element = document.createElement("li");// Crée un élément <li> pour chaque réseau social
            element.textContent = reseau;// Définit le texte de l'élément <li> avec le nom du réseau social
            listeReseaux.appendChild(element);// Ajoute l'élément <li> à la liste des réseaux sociaux
        });
        carte.appendChild(listeReseaux);// Ajoute la liste des réseaux sociaux à la carte
    }

    // Génère le QR de la carte avec la même adresse que celle saisie dans le site.
    const qrCarte = document.createElement("div"); // Conteneur pour le QR code
    qrCarte.className = "business-card-qr";// Ajoute une classe CSS pour le style du QR code
    genererQR(donnees.get("website"), qrCarte);// Appelle la fonction pour générer le QR code et l'ajouter au conteneur
    carte.appendChild(qrCarte);// Ajoute le conteneur du QR code à la carte

    // Remplace l'ancien aperçu par la carte qui vient d'être créée.
    apercuCarte.replaceChildren(carte);
});

// Relie les boutons à leurs actions.
boutonAjoutReseau.addEventListener("click", ajouterChamp);
boutonSuppressionReseau.addEventListener("click", supprimerChamp);
