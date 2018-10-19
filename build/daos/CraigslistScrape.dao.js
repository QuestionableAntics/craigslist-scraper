"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("cheerio");
const rp = require("request-promise");
class CraigslistScrapeDao {
    constructor() {
        this.baseUrl = "https://columbiamo.craigslist.org/";
    }
    getSearchPage(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const scrapedHtmlPromise = rp(`${this.baseUrl}search/cta?query=${search}`)
                .then((html) => {
                return html;
            })
                .catch(e => {
                console.log(e);
            });
            return yield scrapedHtmlPromise;
        });
    }
    getCardMetaData(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageHtml = yield this.getSearchPage(search);
                const result = $('div .result-row', pageHtml).map((i, element) => {
                    const priceElement = $(element).find('.result-meta > .result-price')[0];
                    const price = priceElement ? priceElement.children[0].data : 'no price available';
                    const titleAndUrlElement = $(element).find('a.result-title')[0];
                    const title = titleAndUrlElement.children[0].data;
                    const url = titleAndUrlElement.attribs.href;
                    return {
                        price: price,
                        title: title,
                        url: url,
                        yee: 'yee'
                    };
                });
                console.log(result);
                return result;
            }
            catch (e) {
                console.log('dao', e);
            }
        });
    }
}
exports.default = CraigslistScrapeDao;
