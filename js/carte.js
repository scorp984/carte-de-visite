const container = document.getElementById("shared-card");// Récupère le conteneur où la carte sera affichée
const encodedCard = new URLSearchParams(window.location.search).get("d"); //Récupère la valeur du paramètre "d" dans l'URL

function afficherErreur(message) { // Fonction pour afficher un message d'erreur dans le conteneur
    const erreur = document.createElement("p"); // Crée un élément <p> pour afficher le message d'erreur
    erreur.className = "card-error";// Ajoute une classe CSS pour le style de l'erreur
    erreur.textContent = message;// Définit le texte du message d'erreur
    container.replaceChildren(erreur);// Remplace le contenu du conteneur par le message d'erreur
}

function decoderCarte(encoded) {// Fonction pour décoder les données de la carte encodées en base64
    const binary = atob(encoded);// Décode la chaîne encodée en base64 en une chaîne binaire
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));// Convertit la chaîne binaire en un tableau d'octets (Uint8Array)
    return JSON.parse(new TextDecoder().decode(bytes));// Décode le tableau d'octets en une chaîne JSON et la parse en un objet JavaScript
}

function ajouterInformation(parent, etiquette, valeur, href) { // Fonction pour ajouter une information à la carte
    if (typeof valeur !== "string" || valeur.trim() === "") {// Vérifie si la valeur est une chaîne de caractères non vide
        return;
    }

    const ligne = document.createElement("p");// Crée un élément <p> pour contenir l'information
    const titre = document.createElement("strong");// Crée un élément <strong> pour le titre de l'information
    titre.textContent = `${etiquette} : `;// Définit le texte du titre avec l'étiquette suivie de deux points
    ligne.appendChild(titre);// Ajoute le titre à la ligne

    if (href) {// Vérifie si un lien est fourni
        const lien = document.createElement("a");// Crée un élément <a> pour le lien
        lien.href = href;// Définit l'attribut href du lien
        lien.textContent = valeur;// Définit le texte du lien avec la valeur de l'information
        lien.rel = "noopener noreferrer";// Ajoute des attributs de sécurité pour le lien
        ligne.appendChild(lien);// Ajoute le lien à la ligne
    } else {
        ligne.appendChild(document.createTextNode(valeur));// Ajoute la valeur de l'information en tant que texte à la ligne
    }

    parent.appendChild(ligne);// Ajoute la ligne contenant l'information au parent (la carte)
}

if (!container) {// Vérifie si le conteneur de la carte est présent dans le DOM
    throw new Error("Le conteneur de la carte est introuvable.");// Vérifie si le conteneur de la carte est présent dans le DOM, sinon lance une erreur
}

if (!encodedCard) {// Vérifie si les données de la carte sont présentes dans l'URL
    afficherErreur("Aucune donnée de carte n’a été fournie dans ce lien.");// Affiche un message d'erreur si aucune donnée de carte n'est fournie dans l'URL
} else {
    try {
        const data = decoderCarte(encodedCard);// Décode les données de la carte encodées en base64 et les parse en un objet JavaScript
        if (!data || typeof data !== "object" || Array.isArray(data)) {// Vérifie si les données décodées sont valides (un objet non vide)
            throw new Error("Format de carte invalide.");// Lance une erreur si le format de la carte est invalide
        }

        const card = document.createElement("section");// Crée un élément <section> pour contenir la carte
        card.className = "business-card shared-card";// Ajoute une classe CSS pour le style de la carte

        const heading = document.createElement("h2");// Crée un élément <h2> pour le titre de la carte
        heading.textContent = typeof data.nom === "string" && data.nom ? data.nom : "Carte de visite";
        card.appendChild(heading);// Ajoute le titre à la carte

        ajouterInformation(card, "Email", data.email, data.email ? `mailto:${data.email}` : null);// Ajoute l'information de l'email à la carte avec un lien mailto si l'email est présent
        ajouterInformation(card, "Téléphone", data.telephone, data.telephone ? `tel:${data.telephone}` : null);// Ajoute l'information du téléphone à la carte avec un lien tel si le téléphone est présent
        ajouterInformation(card, "Site web", data.lien, data.lien);// Ajoute l'information du site web à la carte avec un lien si le site web est présent

        if (Array.isArray(data.reseaux) && data.reseaux.length > 0) {// Vérifie si les réseaux sociaux sont présents et non vides
            const title = document.createElement("h3");//   Crée un élément <h3> pour le titre des réseaux sociaux
            title.textContent = "Réseaux sociaux";// Définit le texte du titre des réseaux sociaux
            card.appendChild(title);// Ajoute le titre des réseaux sociaux à la carte

            const list = document.createElement("ul");// Crée un élément <ul> pour contenir la liste des réseaux sociaux
            data.reseaux.forEach((network) => {// Parcourt chaque réseau social dans le tableau des réseaux sociaux
                if (typeof network !== "string" || network.trim() === "") {// Vérifie si le réseau social est une chaîne de caractères non vide
                    return;// Ignore les réseaux sociaux qui ne sont pas des chaînes de caractères non vides
                }
                const item = document.createElement("li");// Crée un élément <li> pour chaque réseau social
                item.textContent = network;// Définit le texte de l'élément <li> avec le nom du réseau social
                list.appendChild(item);// Ajoute l'élément <li> à la liste des réseaux sociaux
            });
            card.appendChild(list);// Ajoute la liste des réseaux sociaux à la carte
        }

        container.replaceChildren(card);// Remplace le contenu du conteneur par la carte générée
    } catch (error) {
        afficherErreur("Impossible de lire les informations de cette carte. Vérifie que le QR code est complet.");
        console.error("Erreur lors du décodage de la carte :", error);
    }
}
