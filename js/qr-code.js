const qrBox = document.getElementById("qrcode");// Récupère le conteneur où le QR code sera affiché
let qr = null;// Variable pour stocker l'instance du QR code généré

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
    const websiteInput = document.getElementById("website");// Récupère le champ de saisie pour l'URL du site web
    if (!(websiteInput instanceof HTMLInputElement) || !websiteInput.reportValidity()) {// Vérifie si le champ de saisie est valide, sinon quitte la fonction
      return;// Quitte la fonction si le champ de saisie n'est pas valide
    }

    genererQR(websiteInput.value);// Appelle la fonction pour générer le QR code avec l'URL saisie dans le champ de saisie
  });
});