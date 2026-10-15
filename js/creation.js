// Récupère les éléments HTML utilisés pour gérer le formulaire et ses aperçus.
const boutonAjoutReseau = document.getElementById("add-social");
const conteneurReseaux = document.getElementById("social-links");
const boutonSuppressionReseau = document.getElementById("remove-social");
const formulaire = document.getElementById("creation-form");
const apercuCarte = document.getElementById("card-preview");
const LIMITE_RESEAUX = 3;

// Arrête le script immédiatement si la page ne contient pas un élément requis.
if (formulaire && (!boutonAjoutReseau || !conteneurReseaux || !boutonSuppressionReseau || !apercuCarte)) {
    throw new Error("Un élément nécessaire au formulaire de création est introuvable.");
}

// Sert à donner un identifiant unique à chaque nouveau champ de réseau social.
let nombreReseaux = 1;

function mettreAJourBoutonAjout() {
    if (boutonAjoutReseau && conteneurReseaux) {
        boutonAjoutReseau.disabled = conteneurReseaux.querySelectorAll(".social-link-field").length >= LIMITE_RESEAUX;
    }
}

function ajouterChamp() {
    if (conteneurReseaux.querySelectorAll(".social-link-field").length >= LIMITE_RESEAUX) {
        mettreAJourBoutonAjout();
        return;
    }

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
    mettreAJourBoutonAjout();
}

function supprimerChamp() {
    // Retire le dernier groupe ajouté, s'il y en a un.
    const dernierGroupe = conteneurReseaux.lastElementChild;
    if (!dernierGroupe) {
        return;
    }

    dernierGroupe.remove();
    nombreReseaux -= 1;
    mettreAJourBoutonAjout();
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

function recupererDonneesCarteDepuisFormulaire(formulaire) {
    const donnees = new FormData(formulaire);
    return {
        nom: donnees.get("name"),
        email: donnees.get("email"),
        telephone: donnees.get("phone"),
        lien: donnees.get("website"),
        theme: donnees.get("theme"),
        reseaux: donnees.getAll("social")
            .filter((reseau) => typeof reseau === "string" && reseau.trim() !== "")
            .slice(0, LIMITE_RESEAUX)
    };
}

// Intercepte l'envoi du formulaire pour afficher la carte sans recharger la page.
formulaire?.addEventListener("submit", (event) => {
    event.preventDefault();

    const donneesCarte = recupererDonneesCarteDepuisFormulaire(formulaire);
    const carte = document.createElement("section");
    carte.className = "business-card";
    if (donneesCarte.theme === "luxe" || donneesCarte.theme === "tech") {
        carte.dataset.theme = donneesCarte.theme;
    }

    const libelleCarte = document.createElement("p");
    libelleCarte.className = "business-card-label";
    libelleCarte.textContent = "Carte de visite";
    carte.appendChild(libelleCarte);

    // Ajoute le nom comme titre principal de la carte.
    const titre = document.createElement("h2");
    titre.textContent = donneesCarte.nom;
    carte.appendChild(titre);

    // Ajoute les coordonnées principales à l'aperçu.
    ajouterInformation(carte, "Email", donneesCarte.email);
    ajouterInformation(carte, "Téléphone", donneesCarte.telephone);

    // getAll récupère tous les champs portant name="social" ; les champs vides
    // sont ignorés pour ne pas afficher de lignes sans contenu.
    const reseaux = donneesCarte.reseaux;
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

    // Génère le QR de la carte, pas du site web seul.
    const qrCarte = document.createElement("div"); // Conteneur pour le QR code
    qrCarte.className = "business-card-qr";// Ajoute une classe CSS pour le style du QR code
    const urlPartage = construireUrlCarte(donneesCarte);
    genererQR(urlPartage, qrCarte);// Appelle la fonction pour générer le QR code et l'ajouter au conteneur
    carte.appendChild(qrCarte);// Ajoute le conteneur du QR code à la carte

    // Remplace l'ancien aperçu par la carte qui vient d'être créée.
    apercuCarte.replaceChildren(carte);

    try {
        localStorage.setItem("carte-visite", JSON.stringify(donneesCarte));
    } catch (error) {
        console.error("Impossible d'enregistrer la carte dans le navigateur :", error);
        const erreur = document.createElement("p");
        erreur.className = "card-error";
        erreur.textContent = "La carte est affichée, mais n’a pas pu être enregistrée dans ce navigateur.";
        apercuCarte.appendChild(erreur);
    }
});

// Relie les boutons à leurs actions.
if (boutonAjoutReseau) {
    boutonAjoutReseau.addEventListener("click", ajouterChamp);
}
if (boutonSuppressionReseau) {
    boutonSuppressionReseau.addEventListener("click", supprimerChamp);
}
mettreAJourBoutonAjout();
