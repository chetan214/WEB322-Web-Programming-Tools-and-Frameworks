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


const express = require("express");
const siteData = require("./modules/data-service");

const app = express();
const port = 3000;

siteData.initialize().then(() => {
    console.log("Success: Data initialized");

    app.get("/", (req, res) => {
        res.send("Assignment 2: NAME- Chetan Arora, ID- 100976240");
    });

    app.get("/sites", (req, res) => {
        siteData.getAllSites().then(sites => {
            res.json(sites);
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    app.get("/sites/site-id-demo", (req, res) => {
        siteData.getSiteById("ON016").then(site => {
            res.json(site);
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    app.get("/sites/province-or-territory-demo", (req, res) => {
        siteData.getSitesByProvinceOrTerritoryName("Ontario").then(sites => {
            res.json(sites);
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    app.get("/sites/region-demo", (req, res) => {
        siteData.getSitesByRegion("Prairie Provinces").then(sites => {
            res.json(sites);
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    app.listen(port, () => {
        console.log(`Running on port: ${port}`);
    });
    
}).catch(error => {
    console.log("Failed to initialize data:", error);
});