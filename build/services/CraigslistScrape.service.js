"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CraigslistScrape_dao_1 = __importDefault(require("../daos/CraigslistScrape.dao"));
class CraigslistScrapeService {
    constructor() {
        this.craigslistScrapeDao = new CraigslistScrape_dao_1.default();
    }
    CardMetaData(search, resultCount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.craigslistScrapeDao.getCardMetaData(search);
                return results;
            }
            catch (e) {
                console.log('service', e);
            }
        });
    }
    AveragePrice(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = null;
                const states = this.craigslistScrapeDao.getAllStates();
                const queries = search.split(' ').map(query => query.toLowerCase());
            }
            catch (e) {
                console.log('service', e);
            }
        });
    }
    AveragePriceForState(search, state = "Missouri") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = null;
                const cityUrls = yield this.craigslistScrapeDao.getCitiesFromState(state);
                const queries = search.split(' ').map(query => query.toLowerCase());
                console.log(queries);
                const cardMetaDataOfFirstPageListings = yield Promise.all(cityUrls.map((cityUrl) => __awaiter(this, void 0, void 0, function* () { return yield this.craigslistScrapeDao.getCardMetaData(search, cityUrl.toString()); })));
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
                const priceArrayFilteredFlattened = [].concat.apply([], cityPriceArrays);
                if (priceArrayFilteredFlattened.length > 1) {
                    const priceSum = priceArrayFilteredFlattened.reduce((total, num) => total + num);
                    const averagePrice = priceSum / priceArrayFilteredFlattened.length;
                    result = { AveragePrice: averagePrice, TotalPosts: priceArrayFilteredFlattened.length };
                }
                else {
                    result = { AveragePrice: 'No items found for this search' };
                }
                return result;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.CraigslistScrapeService = CraigslistScrapeService;
