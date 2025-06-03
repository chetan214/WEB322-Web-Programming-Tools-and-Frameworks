/****************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  
* 
*  Name: Chetan Arora   Student ID: 100976240   Date:04/02/2025
*
****************************/

const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const path = require('path');
const siteData = require("./modules/data-service");
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static(__dirname + '/public'));

siteData.initialize().then(() => {
    console.log("Success: Initialization has been completed.");
    app.listen(HTTP_PORT, () => {
        console.log(`Server is running at: http://localhost:${HTTP_PORT}`);
    });
}).catch(error => {
    console.error("Error: Initialization has failed.", error);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/sites', (req, res) => {
    if (req.query.region) {
        siteData.getSitesByRegion(req.query.region)
            .then(sites => res.json(sites))
            .catch(error => res.status(404).send(error));
    } else if (req.query.provinceOrTerritory) {
        siteData.getSitesBySubRegionName(req.query.provinceOrTerritory)
            .then(sites => res.json(sites))
            .catch(error => res.status(404).send(error));
    } else {
        siteData.getAllSites()
            .then(sites => res.json(sites))
            .catch(error => res.status(500).send(error));
    }
});

app.get('/sites/:siteId', (req, res) => {
    siteData.getSiteById(req.params.siteId)
        .then(site => res.json(site))
        .catch(error => res.status(404).send(error));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});