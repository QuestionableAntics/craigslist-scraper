import CraigslistScrapeDao from '../daos/CraigslistScrape.dao';
import CraigslistSearchCard from '../models/craigslist-search-card.model';

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
            const cityUrls = await this.craigslistScrapeDao.getCitiesFromState(state);;
            
            const cardMetaDataOfFirstPageListings = await Promise.all(
                cityUrls.map(async cityUrl => await this.craigslistScrapeDao.getCardMetaData(search, cityUrl.toString())));
            
            const averagePrice = cardMetaDataOfFirstPageListings.map(cityListings => {
                if (cityListings) {
                    cityListings.map((listing) => {
                        // console.log(listing);
                        
                    });
                }
                          
            })
            
        } catch (e) {
            console.log(e);
            
        }
    }
}