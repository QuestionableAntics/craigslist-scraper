import CraigslistScrapeDao from '../daos/CraigslistScrape.dao';

export class CraigslistScrapeService {
    craigslistScrapeDao: CraigslistScrapeDao = new CraigslistScrapeDao();

    async CardMetaData(search: string, resultCount: number = 120) {
        const results = await this.craigslistScrapeDao.getCardMetaData();
        return results;
    }
}