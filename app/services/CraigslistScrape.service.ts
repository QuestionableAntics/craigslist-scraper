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
            let result = null;
            const cityUrls = await this.craigslistScrapeDao.getCitiesFromState(state);
            const queries = search.split(' ').map(query => query.toLowerCase());
            console.log(queries);
            
            const cardMetaDataOfFirstPageListings = await Promise.all(
                cityUrls.map(async cityUrl => await this.craigslistScrapeDao.getCardMetaData(search, cityUrl.toString())));
            
            const cityPriceArrays = cardMetaDataOfFirstPageListings.map(cityListings => {
                if (cityListings) {
                    const priceArray = cityListings.map(listing => {
                        const containsSearchKeywords = queries.every(query => listing.title.toLowerCase().indexOf(query) > -1);
                        if (containsSearchKeywords && listing.price[0] === '$') {
                            return Number.parseInt(listing.price.slice(1, listing.price.length));
                        }
                    });
                    const priceArrayFiltered = priceArray.filter(price => price && price > 500 && price < 100000);
                    return priceArrayFiltered;
                }
            });
            const priceArrayFilteredFlattened = [].concat.apply([], cityPriceArrays) as Array<number>;

            if (priceArrayFilteredFlattened.length > 1) {
                const priceSum = priceArrayFilteredFlattened.reduce((total, num) => total + num);
                const averagePrice = priceSum / priceArrayFilteredFlattened.length;
                result = {AveragePrice: averagePrice};
            } else {
                result = {AveragePrice: 'No items found for this search'};
            }
            return result;
        } catch (e) {
            console.log(e);
            
        }
    }
}