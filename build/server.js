"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CraigslistScrape_service_1 = require("./services/CraigslistScrape.service");
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const app = express_1.default();
const port = process.env.port || 3001;
app.use('/craigslist', controllers_1.CraigslistController);
const craigslistScrapeService = new CraigslistScrape_service_1.CraigslistScrapeService();
const results = craigslistScrapeService.CardMetaData("Honda Accord");
app.listen(port, () => {
    console.log("listening, always listening...");
});
