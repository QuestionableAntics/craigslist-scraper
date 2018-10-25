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
const $ = require("cheerio");
const rp = require("request-promise");
const craigslist_search_card_model_1 = __importDefault(require("../models/craigslist-search-card.model"));
class CraigslistScrapeDao {
    constructor() {
        this.craigslistUrl = "https://www.craigslist.org/about/sites";
        this.baseUrl = "https://columbiamo.craigslist.org/";
    }
    getPage(pageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield rp(pageUrl);
        });
    }
    getCardMetaData(search, cityUrl = this.baseUrl, resultCount = 120) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchUrl = `${cityUrl}search/cta?query=${search}`;
                // const pageHtml = await this.getSearchPage(search);
                const pageHtml = yield this.getPage(searchUrl);
                const resultRows = $('div .result-row', pageHtml);
                const result = resultRows.map((i, element) => {
                    try {
                        const cardMetaData = new craigslist_search_card_model_1.default();
                        const priceElement = $(element).find('.result-meta > .result-price');
                        const titleAndUrlElement = $(element).find('a.result-title');
                        cardMetaData.dataPid = element.attribs["data-pid"];
                        cardMetaData.repostOf = element.attribs["data-repost-of"] || undefined;
                        cardMetaData.price = priceElement.text() || cardMetaData.price;
                        cardMetaData.title = titleAndUrlElement.text();
                        cardMetaData.url = titleAndUrlElement.attr("href");
                        return cardMetaData;
                    }
                    catch (e) {
                        console.log('Error filling out card metadata', e);
                    }
                }).get();
                return result;
            }
            catch (e) {
                console.log('craigslistscrapedao.getcardmetadata', e);
            }
        });
    }
    getCitiesFromState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageHtml = yield this.getPage(this.craigslistUrl);
            const stateHeader = $(`h4:contains('${state}')`, pageHtml);
            const cityUL = stateHeader.next("ul");
            const cityListElements = cityUL.children();
            const cityUrls = cityListElements.map((i, element) => $(element).find('a').attr("href")).toArray();
            return cityUrls;
        });
    }
    getAllStates() {
        return __awaiter(this, void 0, void 0, function* () {
            const pageHtml = yield this.getPage(this.craigslistUrl);
            const stateColumns = $('h1', pageHtml).nextUntil('h1')[0];
            const stateHeaders = $(stateColumns).find('h4');
            const states = stateHeaders.map((i, element) => $(element).text()).get();
            return states;
        });
    }
}
exports.default = CraigslistScrapeDao;
