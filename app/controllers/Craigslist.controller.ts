import {Router, Request, Response} from 'express';
import {CraigslistScrapeService} from '../services/CraigslistScrape.service';

const router: Router = Router();
const craigslistScrapeService = new CraigslistScrapeService();

router.get('/', (req: Request, res: Response) => {
    const query = req.query.search;
     const results = await craigslistScrapeService.CardMetaData(query);
    console.log(results);
    
     res.send(results);
    // res.send(`You searched for ${results}`)
});

export const CraigslistController: Router = router;