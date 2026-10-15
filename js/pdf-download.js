const boutonTelechargementPDF = document.getElementById("download-pdf");

if (boutonTelechargementPDF) {
    const mettreAJourDisponibilite = () => {
        boutonTelechargementPDF.hidden = !document.querySelector(".business-card");
    };

    mettreAJourDisponibilite();
    new MutationObserver(mettreAJourDisponibilite).observe(document.body, {
        childList: true,
        subtree: true
    });

    boutonTelechargementPDF.addEventListener("click", () => {
        if (!document.querySelector(".business-card")) {
            throw new Error("Crée une carte avant de la télécharger en PDF.");
        }

        window.print();
    });
}
