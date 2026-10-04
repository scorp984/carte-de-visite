const boutonAjoutReseau = document.getElementById("add-social");
const conteneurReseaux = document.getElementById("social-links");
const boutonSuppressionReseau = document.getElementById("remove-social");
const formulaire = document.getElementById("creation-form");
const apercuCarte = document.getElementById("card-preview");

if (!boutonAjoutReseau || !conteneurReseaux || !boutonSuppressionReseau || !formulaire || !apercuCarte) {
    throw new Error("Un élément nécessaire au formulaire de création est introuvable.");
}

let nombreReseaux = 2;

function ajouterChamp() {
    const champId = `social-${nombreReseaux}`;
    const groupe = document.createElement("div");
    groupe.className = "social-link-field";

    const label = document.createElement("label");
    label.htmlFor = champId;
    label.textContent = `Réseau social ${nombreReseaux} :`;

    const champ = document.createElement("input");
    champ.type = "text";
    champ.id = champId;
    champ.name = "social";
    champ.placeholder = "Ex. LinkedIn";

    groupe.append(label, champ);
    conteneurReseaux.appendChild(groupe);
    nombreReseaux += 1;
}

function supprimerChamp() {
    const dernierGroupe = conteneurReseaux.lastElementChild;
    if (!dernierGroupe) {
        return;
    }

    dernierGroupe.remove();
    nombreReseaux -= 1;
}

function ajouterInformation(parent, etiquette, valeur) {
    const ligne = document.createElement("p");
    const titre = document.createElement("strong");
    titre.textContent = `${etiquette} : `;
    ligne.append(titre, document.createTextNode(valeur));
    parent.appendChild(ligne);
}

formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    const donnees = new FormData(formulaire);
    const carte = document.createElement("section");
    carte.className = "business-card";

    const titre = document.createElement("h2");
    titre.textContent = donnees.get("name");
    carte.appendChild(titre);

    ajouterInformation(carte, "Email", donnees.get("email"));
    ajouterInformation(carte, "Téléphone", donnees.get("phone"));
    ajouterInformation(carte, "Site web", donnees.get("website"));

    const reseaux = donnees.getAll("social").filter((reseau) => reseau.trim() !== "");
    if (reseaux.length > 0) {
        const titreReseaux = document.createElement("h3");
        titreReseaux.textContent = "Réseaux sociaux";
        carte.appendChild(titreReseaux);

        const listeReseaux = document.createElement("ul");
        reseaux.forEach((reseau) => {
            const element = document.createElement("li");
            element.textContent = reseau;
            listeReseaux.appendChild(element);
        });
        carte.appendChild(listeReseaux);
    }

    apercuCarte.replaceChildren(carte);
});

boutonAjoutReseau.addEventListener("click", ajouterChamp);
boutonSuppressionReseau.addEventListener("click", supprimerChamp);
