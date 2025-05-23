// Initialisation carte Leaflet
const map = L.map('map').setView([46.5, 2.5], 6);

// Exemple de catégories
const categories = [
    { nom: "Stephane Lucquin", couleur: "#ff6666" },
    { nom: "Joachim Lethu", couleur: "#66cc66" },
    { nom: "Dominique Boguta", couleur: "#6699ff" },
    { nom: "Thierry Chevrot", couleur: "#ffcc00" },
    { nom: "François Tofanelli", couleur: "#cc00cc" },
    { nom: "Xavier Piron", couleur: "#00cccc" },
    { nom: "Marinne Pitel", couleur: "#999999" }
];

// Objet global pour stocker les couches par code département
const departementsLayers = {};

// Sauvegarde des attributions dans le localStorage
let sauvegarde = JSON.parse(localStorage.getItem("departementsAttribution")) || {};

// Chargement GeoJSON des départements
fetch('departements1.geojson')
    .then(resp => resp.json())
    .then(geojson => {
        L.geoJSON(geojson, {
            style: feature => {
                const codeDept = feature.properties.code; // adapte 'code' au champ exact de ton geojson
                // Si département colorié via localStorage
                if (sauvegarde[codeDept]) {
                    const cat = categories.find(c => c.nom === sauvegarde[codeDept].categorie);
                    return {
                        color: "#666",
                        fillColor: cat ? cat.couleur : "#ccc",
                        weight: 1,
                        fillOpacity: 0.7
                    };
                }
                return {
                    color: "#666",
                    fillColor: "#ccc",
                    weight: 1,
                    fillOpacity: 0.2
                };
            },
            onEachFeature: (feature, layer) => {
                const codeDept = feature.properties.code;
                departementsLayers[codeDept] = layer;
            }
        }).addTo(map);
    });

// Fonction pour lire le fichier Excel et colorier la carte
function lireExcel(event) {
    const fichier = event.target.files[0];
    const lecteur = new FileReader();

    lecteur.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const nomFeuille = workbook.SheetNames[0];
        const feuille = workbook.Sheets[nomFeuille];
        const jsonData = XLSX.utils.sheet_to_json(feuille);

        // Reset styles des départements
        Object.values(departementsLayers).forEach(layer => {
            layer.setStyle({
                fillColor: "#ccc",
                fillOpacity: 0.2
            });
        });

        sauvegarde = {}; // reset sauvegarde

        jsonData.forEach(row => {
            const nomRep = row["REPRES"];
            const codePostal = row["CODI"];

            let codeDept = null;
            if (typeof codePostal === "string" || typeof codePostal === "number") {
                const cpStr = codePostal.toString();
                if (cpStr.startsWith("20")) {
                    codeDept = "2A"; // simplification
                } else {
                    codeDept = cpStr.substring(0, 2);
                }
            }

            if (codeDept && categories.find(c => c.nom === nomRep) && departementsLayers[codeDept]) {
                const cat = categories.find(c => c.nom === nomRep);

                departementsLayers[codeDept].setStyle({
                    fillColor: cat.couleur,
                    fillOpacity: 0.7
                });

                sauvegarde[codeDept] = { categorie: cat.nom };
            }
        });

        // Sauvegarder dans localStorage
        localStorage.setItem("departementsAttribution", JSON.stringify(sauvegarde));
    };

    lecteur.readAsArrayBuffer(fichier);
}

// Évènement sur input pour charger le fichier
document.getElementById('inputExcel').addEventListener('change', lireExcel);