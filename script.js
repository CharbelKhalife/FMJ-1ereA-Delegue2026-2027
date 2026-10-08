// 1) Lien Google Form 
const GOOGLE_FORM_URL = "https://forms.gle/pyx3NTE9iRVZrwcL9";

// 2) Prénoms affichés (hero et bas de page)
const CANDIDAT  = "Charbel Khalife";
const SUPPLEANT = "Raymond Khoury";

// 3) Propositions affichées dans « Vos propositions »
//    statut : "transmise" | "discussion" | "delai" | "acceptee" | "refusee"
//    reponse : optionnel (texte court). exemple: true affiche l'étiquette « Exemple ».
//    Pour ne rien afficher : PROPOSITIONS = []
const PROPOSITIONS = [
  { texte: "Afficher les dates des contrôles à un endroit visible de la salle.", statut: "transmise", exemple: false },
  { texte: "Creation d'un club de Maths.", statut: "discussion", reponse: "La direction étudie la question.", exemple: false },
  { texte: "Créer un espace de partage des cours en cas d'absence.", statut: "complete", exemple: false },
];

/* ===================================================== */

const STATUTS = {
  transmise: "Transmise",
  discussion: "En discussion",
  delai: "Plus de temps nécessaire",
  acceptee: "Acceptée",
  refusee: "Refusée",
  complete: "Complétée"
};

// Prénoms
document.querySelectorAll('[data-bind="candidat"]').forEach(el => el.textContent = CANDIDAT);
document.querySelectorAll('[data-bind="suppleant"]').forEach(el => el.textContent = SUPPLEANT);

// Boutons vers le Google Form
const formulaireOk = /^https?:\/\//.test(GOOGLE_FORM_URL);
if (formulaireOk) {
  document.querySelectorAll("[data-form-link]").forEach(a => {
    a.href = GOOGLE_FORM_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });
} else {
  console.warn("GOOGLE_FORM_URL n'est pas encore remplacé dans script.js.");
}

// Photo absente : on affiche un cadre pointillé au lieu d'une image cassée
const photo = document.querySelector(".photo img");
const verifierPhoto = () => {
  if (photo.complete && photo.naturalWidth === 0) photo.closest(".photo").classList.add("vide");
};
photo.addEventListener("error", verifierPhoto);
verifierPhoto();

// Liste des propositions (textContent : aucun risque d'injection HTML)
const liste = document.getElementById("liste-propositions");
if (PROPOSITIONS.length === 0) {
  const vide = document.createElement("li");
  vide.className = "doux";
  vide.textContent = "Les propositions de la classe apparaîtront ici.";
  liste.append(vide);
}
PROPOSITIONS.forEach(p => {
  const li = document.createElement("li");
  li.className = "prop";
  const texte = document.createElement("p");
  texte.textContent = p.texte;
  const tag = document.createElement("span");
  tag.className = "tag s-" + p.statut;
  tag.textContent = STATUTS[p.statut] || p.statut;
  li.append(texte, tag);
  if (p.exemple) {
    const ex = document.createElement("span");
    ex.className = "exemple";
    ex.textContent = "Exemple";
    li.append(ex);
  }
  if (p.reponse) {
    const rep = document.createElement("small");
    rep.textContent = "Réponse : " + p.reponse;
    li.append(rep);
  }
  liste.append(li);
});

// QR code (généré dans le navigateur à partir de GOOGLE_FORM_URL)
const boiteQR = document.getElementById("qr");
const boutonQR = document.getElementById("qr-telecharger");
if (formulaireOk && typeof QRCode !== "undefined") {
  new QRCode(boiteQR, {
    text: GOOGLE_FORM_URL, width: 512, height: 512,
    colorDark: "#000000", colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M,
  });
  boutonQR.hidden = false;
  boutonQR.addEventListener("click", () => {
    const source = boiteQR.querySelector("canvas");
    if (!source) return;
    const marge = 48; // bord blanc obligatoire autour d'un QR code
    const c = document.createElement("canvas");
    c.width = c.height = source.width + marge * 2;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(source, marge, marge);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "qr-code-idees.png";
    a.click();
  });
} else {
  boiteQR.classList.add("vide");
  boiteQR.textContent = "Le QR code apparaîtra ici quand le lien du formulaire sera ajouté.";
}
