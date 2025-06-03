/*********************************************************************************
*  WEB322 – Assignment 06
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
*  Name: Chetan Arora   Student ID: 100976240   Date: 2025-04-12
*  Published URL: https://your-vercel-url.vercel.app/
********************************************************************************/

require('pg');
require("dotenv").config();
const express = require('express');
const path = require("path");
const clientSessions = require("client-sessions");
const app = express();
const authData = require("./modules/auth-service");
const siteData = require("./modules/data-service");

const HTTP_PORT = process.env.PORT || 8080;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(clientSessions({
  cookieName: "session",
  secret: "web322_as6_manas_secret",
  duration: 2 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 20
}));

// Make session available in all EJS views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware to protect routes
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// Pages
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// Auth Routes
app.get("/register", (req, res) => {
  res.render("register", { page: "/register" });
});


app.post("/register", (req, res) => {
  authData.registerUser(req.body)
    .then(() => {
      res.render("register", {
        successMessage: "User created",
        page: "/register"
      });
      
    })
    .catch(err => {
      res.render("register", {
        errorMessage: err,
        userName: req.body.userName,
        page: "/register"
      });
      
    });
});

app.get("/login", (req, res) => {
  res.render("login", { page: "/login" });
});


app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");
  authData.checkUser(req.body)
    .then(user => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      };
      res.redirect("/sites");
    })
    .catch(err => {
      res.render("login", {
        errorMessage: err,
        userName: req.body.userName,
        page: "/login"
      });
      
    });
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory", { page: "/userHistory" });
});

// Site Collection Routes
app.get("/sites", async (req, res) => {
  try {
    let sites;
    if (req.query.region) {
      sites = await siteData.getSitesByRegion(req.query.region);
    } else if (req.query.provinceOrTerritory) {
      sites = await siteData.getSitesByProvinceOrTerritoryName(req.query.provinceOrTerritory);
    } else {
      sites = await siteData.getAllSites();
    }
    res.render("sites", { sites, page: "/sites" });
  } catch (err) {
    res.status(500).render("404", { message: "Unable to retrieve sites." });
  }
});

app.get("/sites/:id", async (req, res) => {
  try {
    let site = await siteData.getSiteById(req.params.id);
    if (!site) {
      return res.status(404).render("404", { message: "Site not found." });
    }
    res.render("site", { site });
  } catch (err) {
    res.status(500).render("404", { message: "Error fetching site details." });
  }
});

// Add Site (Protected)
app.get("/addSite", ensureLogin, (req, res) => {
  siteData.getAllProvincesAndTerritories()
    .then(provinces => {
      res.render("addSite", { provincesAndTerritories: provinces });
    })
    .catch(err => {
      res.render("500", { message: `Error loading form: ${err}` });
    });
});

app.post("/addSite", ensureLogin, (req, res) => {
  siteData.addSite(req.body)
    .then(() => res.redirect("/sites"))
    .catch(err => res.render("500", { message: `Error adding site: ${err}` }));
});

// Edit Site (Protected)
app.get("/editSite/:id", ensureLogin, (req, res) => {
  Promise.all([
    siteData.getSiteById(req.params.id),
    siteData.getAllProvincesAndTerritories()
  ])
    .then(([site, provinces]) => {
      res.render("editSite", {
        site: site,
        provincesAndTerritories: provinces
      });
    })
    .catch(err => {
      res.status(404).render("404", { message: err });
    });
});

app.post("/editSite", ensureLogin, (req, res) => {
  siteData.editSite(req.body.siteId, req.body)
    .then(() => res.redirect("/sites"))
    .catch(err => res.render("500", { message: `Error updating site: ${err}` }));
});

// Delete Site (Protected)
app.get("/deleteSite/:id", ensureLogin, (req, res) => {
  siteData.deleteSite(req.params.id)
    .then(() => res.redirect("/sites"))
    .catch(err => res.render("500", { message: `Error deleting site: ${err}` }));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found." });
});

// DB Initialization + Server Start
siteData.initialize()
  .then(authData.initialize)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`App listening on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to start server:", err);
  });
