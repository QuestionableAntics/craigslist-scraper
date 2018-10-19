"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var CraigslistScrape_service_1 = require("../services/CraigslistScrape.service");
var router = express_1.Router();
var craigslistScrapeService = new CraigslistScrape_service_1.CraigslistScrapeService();
router.get('/', function (req, res) {
    var query = req.query.search;
    var results = yield craigslistScrapeService.CardMetaData(query);
    console.log(results);
    res.send(results);
    // res.send(`You searched for ${results}`)
});
exports.CraigslistController = router;
