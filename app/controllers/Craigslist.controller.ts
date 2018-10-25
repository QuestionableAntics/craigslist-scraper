import {Router, Request, Response} from 'express';
import {CraigslistScrapeService} from '../services/CraigslistScrape.service';

const router: Router = Router();
const craigslistScrapeService = new CraigslistScrapeService();

router.get('/', async (req: Request, res: Response) => {
    const search = req.query.search;
    try {
        const results = await craigslistScrapeService.CardMetaData(search);
        res.send(results);
    } catch (e) {
        console.log('controller', e);
    }
});

router.get('/AveragePriceForState', async (req: Request, res: Response) => {
    const search = req.query.search;
    const state = req.query.state.toLowerCase().charAt(0).toUpperCase() + req.query.state.slice(1);
    
    try {
        const results = await craigslistScrapeService.AveragePriceForState(search, state);
        res.send(results);
    } catch (e) {
        console.log('controller', e);
    }
});

router.get('/AveragePrice', async (req: Request, res: Response) => {
    const search = req.query.search;

    try {
        const results = await craigslistScrapeService.AveragePrice(search);
        res.send(results);
    } catch (e) {
        console.log('controller', e);
    }
});

export const CraigslistController: Router = router;