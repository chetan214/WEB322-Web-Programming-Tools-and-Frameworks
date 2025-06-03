//sequalize
require('dotenv').config();
const Sequelize = require('sequelize');

let sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false }  // ✅ use this style
    }
  }
);


  
  const ProvinceOrTerritory = sequelize.define('ProvinceOrTerritory', {
    code: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    region: Sequelize.STRING,
    capital: Sequelize.STRING
  }, {
    createdAt: false,
    updatedAt: false
  });
  
  const Site = sequelize.define('Site', {
    siteId: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    site: Sequelize.STRING,
    description: Sequelize.TEXT,
    date: Sequelize.INTEGER,
    dateType: Sequelize.STRING,
    image: Sequelize.STRING,
    location: Sequelize.STRING,
    latitude: Sequelize.FLOAT,
    longitude: Sequelize.FLOAT,
    designated: Sequelize.INTEGER,
    provinceOrTerritoryCode: Sequelize.STRING
  }, {
    createdAt: false,
    updatedAt: false
  });
  
  Site.belongsTo(ProvinceOrTerritory, {
    foreignKey: 'provinceOrTerritoryCode'
  });
  



// Function to initialize site data
function initialize() {
  return sequelize.sync()
    .then(() => {
      console.log("DB Synced Successfully");
    })
    .catch((err) => {
      return Promise.reject("Unable to sync DB: " + err);
    });
}


function getAllSites() {
  return Site.findAll({
    include: [ProvinceOrTerritory]
  }).then(sites => {
    return sites;
  }).catch(err => {
    return Promise.reject("Unable to retrieve sites");
  });
}


function getSiteById(id) {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: { siteId: id }
  }).then(site => {
    if (site.length > 0) return site[0];
    else return Promise.reject("Unable to find requested site");
  }).catch(() => Promise.reject("Unable to find requested site"));
}


// Function to get sites by province name (partial, case insensitive)
function getSitesByProvinceOrTerritoryName(name) {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: {
      "$ProvinceOrTerritory.name$": {
        [Sequelize.Op.iLike]: `%${name}%`
      }
    }
  }).then(sites => {
    if (sites.length > 0) return sites;
    else return Promise.reject("No sites found for this province or territory");
  }).catch(() => Promise.reject("Unable to find requested sites"));
}


// Function to get sites by region (partial, case insensitive)
function getSitesByRegion(region) {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: {
      "$ProvinceOrTerritory.region$": {
        [Sequelize.Op.iLike]: region
      }
    }
  }).then(sites => {
    if (sites.length > 0) return sites;
    else return Promise.reject("No sites found for this region");
  }).catch(() => Promise.reject("Unable to find requested sites"));
}

function addSite(siteData) {
  return Site.create(siteData)
    .then(() => {})
    .catch(err => {
      return Promise.reject(err.errors[0].message);
    });
}

function getAllProvincesAndTerritories() {
  return ProvinceOrTerritory.findAll()
    .then(data => data)
    .catch(err => Promise.reject("Unable to retrieve provinces: " + err));
}

function editSite(id, updatedData) {
  return Site.update(updatedData, {
    where: { siteId: id }
  }).then(() => {})
    .catch(err => {
      return Promise.reject(err.errors[0].message);
    });
}


// Export functions
module.exports = { initialize, getAllSites, getSiteById, getSitesByProvinceOrTerritoryName, getSitesByRegion, addSite, getAllProvincesAndTerritories, editSite };
// Code Snippet to insert existing data from NHSiteData / ProvinceAndTerritoryData

