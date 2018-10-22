import CraigslistScrapeDao from '../daos/CraigslistScrape.dao';

export class CraigslistScrapeService {
    private craigslistScrapeDao: CraigslistScrapeDao = new CraigslistScrapeDao();

    async CardMetaData(search: string, resultCount?: number) {
        try {
            const results = await this.craigslistScrapeDao.getCardMetaData(search);
            return results;
        } catch (e) {
            console.log('service', e);
        }
    }

    async AveragePrice(search: string, state: string = "Missouri") {
        try {
            // const state = "Missouri";
            const cityUrls = await this.craigslistScrapeDao.getCitiesFromState(state);
            const cardMetaDataOfFirstPageListings = await cityUrls.map(async (i, cityUrl) => {
                console.log(cityUrl);
                
                const result = await this.craigslistScrapeDao.getCardMetaData(search, cityUrl);
                return result;
            });
            console.log(cardMetaDataOfFirstPageListings);
            
        } catch (e) {
            console.log(e);
            
        }
    }
}