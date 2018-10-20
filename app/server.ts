import { CraigslistScrapeService } from './services/CraigslistScrape.service';
import express from 'express';

import { CraigslistController } from './controllers';

const app: express.Application = express();

const port = process.env.port || 3001;

app.use('/craigslist', CraigslistController);
const craigslistScrapeService: CraigslistScrapeService = new CraigslistScrapeService();
const results = craigslistScrapeService.CardMetaData("Honda Accord");


app.listen(port, () => {
    console.log("listening, always listening...");
});