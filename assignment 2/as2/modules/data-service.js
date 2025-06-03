const siteData = require("../data/NHSiteData.json");
const provinceAndTerritoryData = require("../data/provinceAndTerritoryData.json");
let sites = [];
function initialize() 
{
    return new Promise((resolve, reject) => {
        try 
        {
            siteData.forEach(site => {
                const provinceOrTerritoryObj = provinceAndTerritoryData.find(province => province.code === site.provinceOrTerritoryCode);
                site.provinceOrTerritoryObj = provinceOrTerritoryObj;
                sites.push(site);
            });
            resolve();
        } catch (err) 
        {
            reject("Initialization failed: " + err);
        }
    });
}
function getAllSites(){
    return new Promise((resolve, reject) => {
        if (sites.length > 0) 
            {
            resolve(sites);
            } else 
            {
            reject("No sites found");
            }
    });
}
function getSiteById(id) {
    return new Promise((resolve, reject) => {
        const site = sites.find(site => site.siteId === id);
        if (site) 
            {
            resolve(site);
            }
        else 
        {
            reject("Unable to find requested site");
        }
    });
}
function getSitesByProvinceOrTerritoryName(name){
    return new Promise((resolve, reject) => 
        {
        const filteredSites = sites.filter(site => 
            site.provinceOrTerritoryObj.name.toLowerCase().includes(name.toLowerCase())
        );
        if (filteredSites.length > 0) 
        {
            resolve(filteredSites);
        }
         else 
        {
            reject("No sites found for the specified province or territory");
        }
    });
}
function getSitesByRegion(region)
{
    return new Promise((resolve, reject) => 
        {
        const filteredSites = sites.filter(site => 
            site.provinceOrTerritoryObj.region.toLowerCase().includes(region.toLowerCase())
        );
        if (filteredSites.length > 0) 
        {
            resolve(filteredSites);
        }
         else 
        {
            reject("No sites found for the specified region");
        }
    });
}
module.exports = { initialize, getAllSites, getSiteById, getSitesByProvinceOrTerritoryName, getSitesByRegion };