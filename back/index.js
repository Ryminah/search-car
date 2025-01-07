const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Importer CORS

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:3000', // Autoriser seulement votre front-end
    methods: ['GET', 'POST'], // Méthodes autorisées
    allowedHeaders: ['Content-Type'], // En-têtes autorisés
}));

app.get('/api/vehicle/:plate', async (req, res) => {
    const plate = req.params.plate;

    if (!plate) {
        return res.status(400).json({ error: "Plate number is required" });
    }

    try {
        // Lancer Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Accéder à Oscaro
        await page.goto('https://www.oscaro.com/');

        // Remplir le champ d'immatriculation
        const inputSelector = '#vehicle-input-plate';
        await page.type(inputSelector, plate);

        // Cliquer sur le bouton
        const buttonSelector = '#root > main > div.flex-container > div.homebox-bg > div > form.plate > div > button';
        await page.click(buttonSelector);

        // Attendre l'apparition des informations du véhicule
        const vehicleNameSelector = '#root > main > div.flex-container.landing > div.toast-banner.toast-banner-nav > div.vehicle-selected > div > p';
        await page.waitForSelector(vehicleNameSelector);

        // Récupérer les informations du véhicule
        const vehicleInfo = await page.evaluate(() => {
            return {
                carName: document.querySelector('#root > main > div.flex-container.landing > div.toast-banner.toast-banner-nav > div.vehicle-selected > div > p').textContent.trim(),
                carDetails: document.querySelector('#root > main > div.flex-container.landing > div.toast-banner.toast-banner-nav > div.vehicle-selected > div > div').textContent.trim(),
            };
        });

        await browser.close();

        // Retourner les informations au front-end
        res.json(vehicleInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur s'est produite lors du scraping" });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
