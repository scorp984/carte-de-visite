const boutonAjoutReseau = document.getElementById("add-social");
const conteneurReseaux = document.getElementById("social-links");

if (!boutonAjoutReseau || !conteneurReseaux) {
    throw new Error("Le bouton ou le conteneur des réseaux sociaux est introuvable.");
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

boutonAjoutReseau.addEventListener("click", ajouterChamp);

function supprimerChamp() {
    if (nombreReseaux > 2) {
        nombreReseaux -= 1;
        const dernierChamp = document.getElementById(`social-${nombreReseaux}`);
        if (dernierChamp) {
            dernierChamp.parentElement.remove();
        }
    } else {
        alert("Vous devez avoir au moins deux réseaux sociaux.");
    }
}
const boutonSuppressionReseau = document.getElementById("remove-social");
if (boutonSuppressionReseau) {
    boutonSuppressionReseau.addEventListener("click", supprimerChamp);
}


