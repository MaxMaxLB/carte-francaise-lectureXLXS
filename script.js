// Initialisation de la carte
const map = L.map('map').setView([46.5, 2.5], 6);
let departementActif = null;

// Fond de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Catégories prédéfinies
const categories = [
    { nom: "Stephane Lucquin", couleur: "#ff6666" },
    { nom: "Joachim Lethu", couleur: "#66cc66" },
    { nom: "Dominique Boguta", couleur: "#6699ff" },
    { nom: "Thierry Chevrot", couleur: "#ffcc00" },
    { nom: "François Tofanelli", couleur: "#cc00cc" },
    { nom: "Xavier Piron", couleur: "#00cccc" },
    { nom: "Marinne Pitel", couleur: "#999999" }
];

const prefectures = {
    "01": { nom: "Bourg-en-Bresse", coords: [46.2052, 5.2255] },
    "02": { nom: "Laon", coords: [49.5639, 3.6244] },
    "03": { nom: "Moulins", coords: [46.5667, 3.3333] },
    "04": { nom: "Digne-les-Bains", coords: [44.0933, 6.2328] },
    "05": { nom: "Gap", coords: [44.5586, 6.0786] },
    "06": { nom: "Nice", coords: [43.7102, 7.2620] },
    "07": { nom: "Privas", coords: [44.7383, 4.5975] },
    "08": { nom: "Charleville-Mézières", coords: [49.7750, 4.7203] },
    "09": { nom: "Foix", coords: [42.9667, 1.6000] },
    "10": { nom: "Troyes", coords: [48.2973, 4.0744] },
    "11": { nom: "Carcassonne", coords: [43.2130, 2.3517] },
    "12": { nom: "Rodez", coords: [44.3500, 2.5667] },
    "13": { nom: "Marseille", coords: [43.2965, 5.3698] },
    "14": { nom: "Caen", coords: [49.1829, -0.3707] },
    "15": { nom: "Aurillac", coords: [44.9264, 2.4400] },
    "16": { nom: "Angoulême", coords: [45.6500, 0.1562] },
    "17": { nom: "La Rochelle", coords: [46.1591, -1.1518] },
    "18": { nom: "Bourges", coords: [47.0810, 2.3988] },
    "19": { nom: "Tulle", coords: [45.2667, 1.7667] },
    "2A": { nom: "Ajaccio", coords: [41.9266, 8.7376] },
    "2B": { nom: "Bastia", coords: [42.6973, 9.4509] },
    "21": { nom: "Dijon", coords: [47.3220, 5.0415] },
    "22": { nom: "Saint-Brieuc", coords: [48.5167, -2.7833] },
    "23": { nom: "Guéret", coords: [46.1667, 1.8667] },
    "24": { nom: "Périgueux", coords: [45.1833, 0.7167] },
    "25": { nom: "Besançon", coords: [47.2378, 6.0241] },
    "26": { nom: "Valence", coords: [44.9333, 4.8924] },
    "27": { nom: "Évreux", coords: [49.0241, 1.1508] },
    "28": { nom: "Chartres", coords: [48.4468, 1.4890] },
    "29": { nom: "Quimper", coords: [47.9961, -4.0963] },
    "30": { nom: "Nîmes", coords: [43.8378, 4.3601] },
    "31": { nom: "Toulouse", coords: [43.6047, 1.4442] },
    "32": { nom: "Auch", coords: [43.6467, 0.5864] },
    "33": { nom: "Bordeaux", coords: [44.8378, -0.5792] },
    "34": { nom: "Montpellier", coords: [43.6111, 3.8777] },
    "35": { nom: "Rennes", coords: [48.1113, -1.6808] },
    "36": { nom: "Châteauroux", coords: [46.8167, 1.7000] },
    "37": { nom: "Tours", coords: [47.3941, 0.6848] },
    "38": { nom: "Grenoble", coords: [45.1885, 5.7245] },
    "39": { nom: "Lons-le-Saunier", coords: [46.6736, 5.5569] },
    "40": { nom: "Mont-de-Marsan", coords: [43.8900, -0.4972] },
    "41": { nom: "Blois", coords: [47.5861, 1.3350] },
    "42": { nom: "Saint-Étienne", coords: [45.4339, 4.3903] },
    "43": { nom: "Le Puy-en-Velay", coords: [45.0444, 3.8858] },
    "44": { nom: "Nantes", coords: [47.2184, -1.5536] },
    "45": { nom: "Orléans", coords: [47.9025, 1.9090] },
    "46": { nom: "Cahors", coords: [44.4493, 1.4380] },
    "47": { nom: "Agen", coords: [44.2000, 0.6333] },
    "48": { nom: "Mende", coords: [44.5167, 3.5000] },
    "49": { nom: "Angers", coords: [47.4784, -0.5632] },
    "50": { nom: "Saint-Lô", coords: [49.1170, -1.0900] },
    "51": { nom: "Châlons-en-Champagne", coords: [48.9562, 4.3672] },
    "52": { nom: "Chaumont", coords: [48.1110, 5.1411] },
    "53": { nom: "Laval", coords: [48.0667, -0.7667] },
    "54": { nom: "Nancy", coords: [48.6921, 6.1844] },
    "55": { nom: "Bar-le-Duc", coords: [48.7743, 5.1616] },
    "56": { nom: "Vannes", coords: [47.6582, -2.7608] },
    "57": { nom: "Metz", coords: [49.1193, 6.1757] },
    "58": { nom: "Nevers", coords: [46.9914, 3.1590] },
    "59": { nom: "Lille", coords: [50.6292, 3.0573] },
    "60": { nom: "Beauvais", coords: [49.4300, 2.0800] },
    "61": { nom: "Alençon", coords: [48.4328, 0.0931] },
    "62": { nom: "Arras", coords: [50.2920, 2.7770] },
    "63": { nom: "Clermont-Ferrand", coords: [45.7772, 3.0870] },
    "64": { nom: "Pau", coords: [43.2951, -0.3708] },
    "65": { nom: "Tarbes", coords: [43.2333, 0.0833] },
    "66": { nom: "Perpignan", coords: [42.6986, 2.8956] },
    "67": { nom: "Strasbourg", coords: [48.5734, 7.7521] },
    "68": { nom: "Colmar", coords: [48.0833, 7.3667] },
    "69": { nom: "Lyon", coords: [45.7578, 4.8320] },
    "70": { nom: "Vesoul", coords: [47.6333, 6.1667] },
    "71": { nom: "Mâcon", coords: [46.3060, 4.8281] },
    "72": { nom: "Le Mans", coords: [48.0061, 0.1996] },
    "73": { nom: "Chambéry", coords: [45.5646, 5.9178] },
    "74": { nom: "Annecy", coords: [45.8992, 6.1294] },
    "75": { nom: "Paris", coords: [48.8566, 2.3522] },
    "76": { nom: "Rouen", coords: [49.4431, 1.0993] },
    "77": { nom: "Melun", coords: [48.5394, 2.6608] },
    "78": { nom: "Versailles", coords: [48.8014, 2.1301] },
    "79": { nom: "Niort", coords: [46.3237, -0.4649] },
    "80": { nom: "Amiens", coords: [49.8941, 2.2957] },
    "81": { nom: "Albi", coords: [43.9298, 2.1480] },
    "82": { nom: "Montauban", coords: [44.0174, 1.3554] },
    "83": { nom: "Toulon", coords: [43.1242, 5.9280] },
    "84": { nom: "Avignon", coords: [43.9493, 4.8055] },
    "85": { nom: "La Roche-sur-Yon", coords: [46.6705, -1.4264] },
    "86": { nom: "Poitiers", coords: [46.5833, 0.3333] },
    "87": { nom: "Limoges", coords: [45.8336, 1.2611] },
    "88": { nom: "Épinal", coords: [48.1731, 6.4494] },
    "89": { nom: "Auxerre", coords: [47.7982, 3.5730] },
    "90": { nom: "Belfort", coords: [47.6396, 6.8632] },
    "91": { nom: "Évry-Courcouronnes", coords: [48.6333, 2.4333] },
    "92": { nom: "Nanterre", coords: [48.8924, 2.2060] },
    "93": { nom: "Bobigny", coords: [48.9031, 2.4399] },
    "94": { nom: "Créteil", coords: [48.7904, 2.4556] },
    "95": { nom: "Cergy", coords: [49.0364, 2.0761] }
};

// Générer la légende automatiquement
function genererLegende() {
    const conteneur = document.getElementById("legende-contenu");
    conteneur.innerHTML = "";

    categories.forEach(cat => {
        const ligne = document.createElement("div");
        ligne.style.display = "flex";
        ligne.style.alignItems = "center";
        ligne.style.marginBottom = "5px";

        const couleur = document.createElement("div");
        couleur.style.width = "18px";
        couleur.style.height = "18px";
        couleur.style.backgroundColor = cat.couleur;
        couleur.style.marginRight = "8px";
        couleur.style.border = "1px solid #999";
        couleur.style.borderRadius = "3px";

        const label = document.createElement("span");
        label.textContent = cat.nom;

        ligne.appendChild(couleur);
        ligne.appendChild(label);
        conteneur.appendChild(ligne);
    });
}

// Données sauvegardées (localStorage)
const sauvegarde = JSON.parse(localStorage.getItem("departementsAttribution")) || {};

// Création du menu déroulant
function creerMenu(layer, feature) {
    const select = document.createElement("select");
    const code = feature.properties.code;

    const optionVide = document.createElement("option");
    optionVide.value = "";
    optionVide.textContent = "-- Choisir une catégorie --";
    select.appendChild(optionVide);

    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.nom;
        opt.textContent = cat.nom;
        if (sauvegarde[code]?.categorie === cat.nom) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    select.onchange = () => {
        const selectedCat = categories.find(c => c.nom === select.value);
        if (selectedCat) {
            // Appliquer la couleur
            layer.setStyle({
                fillColor: selectedCat.couleur,
                fillOpacity: 0.7
            });

            // Sauvegarder la catégorie
            if (!sauvegarde[code]) sauvegarde[code] = {};
            sauvegarde[code].categorie = selectedCat.nom;
            localStorage.setItem("departementsAttribution", JSON.stringify(sauvegarde));

            // Affichage dans le popup
            layer.bindPopup(`<b>${feature.properties.nom}</b><br>${selectedCat.nom}`).openPopup();
        }
    };

    return select;
}

// Chargement du GeoJSON des départements
fetch('departements1.geojson')
    .then(res => res.json())
    .then(data => {
        //Centrer le numéro du département sur la préfecture
        Object.entries(prefectures).forEach(([code, info]) => {
            L.tooltip({
                permanent: true,
                direction: "center",
                className: "departement-label"
            })
                .setLatLng(info.coords)
                .setContent(code)
                .addTo(map);
        });
        L.geoJSON(data, {
            style: feature => {
                const code = feature.properties.code;
                const cat = categories.find(c => c.nom === sauvegarde[code]?.categorie);
                return {
                    color: "#444",
                    weight: 1,
                    fillColor: cat ? cat.couleur : "#ffffff", //blanc si pas de catégorie
                    fillOpacity: cat ? 0.7 : 0.2              //presque transaparent
                };
            },
            onEachFeature: (feature, layer) => {
                const code = feature.properties.code;
                const nom = feature.properties.nom;

                layer.on('click', () => {
                    // Réinitialiser le style du précédent département actif
                    if (departementActif && departementActif !== layer) {
                        const codePrec = departementActif.feature.properties.code;
                        const catPrec = categories.find(c => c.nom === sauvegarde[codePrec]?.categorie);
                        departementActif.setStyle({
                            color: "#444",
                            weight: 1,
                            fillColor: catPrec ? catPrec.couleur : "#ffffff",
                            fillOpacity: catPrec ? 0.7 : 0.1
                        });
                    }

                    // Mettre à jour la variable active
                    departementActif = layer;

                    // Assombrir ou surligner le département cliqué
                    layer.setStyle({
                        color: "#000",        // contour plus sombre
                        weight: 3,
                        fillOpacity: 0.9      // plus opaque
                    });

                    const code = feature.properties.code;
                    const nom = feature.properties.nom;

                    // Champ de saisie pour clients
                    const clientsInput = document.createElement("input");
                    clientsInput.type = "number";
                    clientsInput.min = 0;
                    clientsInput.placeholder = "Nombre de clients";
                    clientsInput.value = sauvegarde[code]?.clients || "";

                    clientsInput.addEventListener("change", () => {
                        if (!sauvegarde[code]) sauvegarde[code] = {};
                        sauvegarde[code].clients = parseInt(clientsInput.value) || 0;
                        localStorage.setItem("departementsAttribution", JSON.stringify(sauvegarde));
                    });

                    const select = creerMenu(layer, feature);

                    // Créer le contenu
                    const panel = document.getElementById("info-panel");
                    panel.innerHTML = `<b>${nom} (${code})</b><br><br>
                    <label>Nombre de clients :</label><br>`;
                    panel.appendChild(clientsInput);
                    panel.appendChild(document.createElement("br"));
                    panel.appendChild(document.createElement("br"));
                    panel.appendChild(document.createTextNode("Attribuer une catégorie :"));
                    panel.appendChild(document.createElement("br"));
                    panel.appendChild(select);
                    panel.style.display = "block"; // on l'affiche
                });

                // Si une catégorie est déjà définie, afficher un popup simple
                const nomCat = sauvegarde[code]?.categorie;
                if (nomCat) {
                    layer.bindPopup(`<b>${feature.properties.nom}</b><br>${nomCat}`);
                }
            }
        }).addTo(map);

        genererLegende(); // ← ICI
    });