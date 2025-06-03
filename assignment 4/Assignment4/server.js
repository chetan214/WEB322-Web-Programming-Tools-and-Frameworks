/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: _Chetan Arora________ Student ID: __100976240___ Date: 11/03/2025_____________
*
*  
********************************************************************************/

const siteData = require("./modules/data-service");
const path = require('path');

const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about", {page: '/about'}));

app.get('/sites/:siteId', async (req, res) => {
  try {
    const site = await siteData.getSiteById(req.params.siteId);
    res.render("site", {site: site, page: ''});
  } catch (error) {
    res.status(404).render("404", {message: error, page: ''});
  }
});

app.get('/sites', async (req, res) => {
  try {
    if (req.query.region) {
      const sites = await siteData.getSitesByRegion(req.query.region);
      res.render("sites", {sites: sites, page: '/sites'});
    } else if (req.query.provinceOrTerritory) {
      const sites = await siteData.getSitesByProvinceOrTerritoryName(req.query.provinceOrTerritory);
      res.render("sites", {sites: sites, page: '/sites'});
    } else {
      const allSites = await siteData.getAllSites();
      res.render("sites", {sites: allSites, page: '/sites'});
    }
  } catch (error) {
    res.status(404).render("404", {message: error, page: ''});
  }
});

app.use((req, res) => res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for", page: ''}));

siteData.initialize().then(() => {
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});