const qrBox = document.getElementById("qrcode");// Récupère le conteneur où le QR code sera affiché
let qr = null;// Variable pour stocker l'instance du QR code généré

function encoderCartePourUrl(donneesCarte) {
  if (!donneesCarte || typeof donneesCarte !== "object") {
    throw new Error("Les données de la carte sont invalides.");
  }

  const json = JSON.stringify(donneesCarte);
  const bytes = new TextEncoder().encode(json);
  let binaire = "";
  bytes.forEach((octet) => {
    binaire += String.fromCharCode(octet);
  });

  return btoa(binaire);
}

function construireUrlCarte(donneesCarte) {
  const urlCarte = new URL("carte.html", window.location.href);
  urlCarte.searchParams.set("d", encoderCartePourUrl(donneesCarte));
  return urlCarte.toString();
}

function genererQR(url, cible = qrBox) {
  if (!cible) {// Vérifie si le conteneur cible est présent dans le DOM
    throw new Error("Le conteneur du QR code est introuvable.");
  }

  if (typeof QRCode === "undefined") {// Vérifie si la bibliothèque QRCode est chargée
    throw new Error("La bibliothèque de génération du QR code n’est pas chargée.");
  }

  cible.replaceChildren();// Supprime tout contenu existant dans le conteneur du QR code
  qr = new QRCode(cible, {// Crée un nouveau QR code dans le conteneur cible
    text: url,
    width: 220,
    height: 220,
    colorDark: "#5a3a1e",
    colorLight: "#f3e3b8",
    correctLevel: QRCode.CorrectLevel.M
  });
}

document.addEventListener("DOMContentLoaded", () => {// Attache un écouteur d'événement pour exécuter le code lorsque le DOM est complètement chargé
  const generateButton = document.getElementById("generate-qr");// Récupère le bouton pour générer le QR code
  if (!generateButton) return;// Vérifie si le bouton est présent dans le DOM, sinon quitte la fonction

  generateButton.addEventListener("click", () => {// Attache un écouteur d'événement pour exécuter le code lorsque le bouton est cliqué
    const formulaire = document.getElementById("creation-form");
    if (!(formulaire instanceof HTMLFormElement)) {
      return;
    }

    const donnees = new FormData(formulaire);
    const donneesCarte = {
      nom: donnees.get("name"),
      email: donnees.get("email"),
      telephone: donnees.get("phone"),
      lien: donnees.get("website"),
      theme: donnees.get("theme"),
      reseaux: donnees.getAll("social")
        .filter((reseau) => typeof reseau === "string" && reseau.trim() !== "")
        .slice(0, 3)
    };

    if (!formulaire.reportValidity()) {
      return;
    }

    const urlCarte = construireUrlCarte(donneesCarte);
    genererQR(urlCarte);
  });
});