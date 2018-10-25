"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CraigslistScrape_service_1 = require("../services/CraigslistScrape.service");
const router = express_1.Router();
const craigslistScrapeService = new CraigslistScrape_service_1.CraigslistScrapeService();
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const search = req.query.search;
    try {
        const results = yield craigslistScrapeService.CardMetaData(search);
        res.send(results);
    }
    catch (e) {
        console.log('controller', e);
    }
}));
router.get('/AveragePriceForState', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const search = req.query.search;
    const state = req.query.state.toLowerCase().charAt(0).toUpperCase() + req.query.state.slice(1);
    try {
        const results = yield craigslistScrapeService.AveragePriceForState(search, state);
        res.send(results);
    }
    catch (e) {
        console.log('controller', e);
    }
}));
router.get('/AveragePrice', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const search = req.query.search;
    try {
        const results = yield craigslistScrapeService.AveragePrice(search);
        res.send(results);
    }
    catch (e) {
        console.log('controller', e);
    }
}));
exports.CraigslistController = router;
