import express from 'express';

import { CraigslistController } from './controllers';

const app: express.Application = express();

const port = process.env.port || 3001;

app.use('/craigslist', CraigslistController);

app.listen(port, () => {
    console.log("listening, always listening...");
});