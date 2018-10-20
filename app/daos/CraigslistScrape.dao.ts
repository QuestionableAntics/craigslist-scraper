import $ = require('cheerio')
import rp = require('request-promise');
import request = require('request');
import requestPromise = require('request-promise');
import fs = require('fs');
import CraigslistSearchCard from '../models/craigslist-search-card.model';

export default class CraigslistScrapeDao {
    baseUrl: string = "https://columbiamo.craigslist.org/"
    async getSearchPage(search: string) {
        const scrapedHtml = await rp(`${this.baseUrl}search/cta?query=${search}`);
        return await scrapedHtml;
    }


    async getCardMetaData(search: string) {
        try {
            const pageHtml = await this.getSearchPage(search);
            const resultRows = $('div .result-row', pageHtml);

            const result = resultRows.map((i, element) => {
                try {
                    const cardMetaData: CraigslistSearchCard = new CraigslistSearchCard();
                    const priceElement: any = $(element).find('.result-meta > .result-price');
                    const titleAndUrlElement = $(element).find('a.result-title');
                    
                    
                    cardMetaData.dataPid = element.attribs["data-pid"];
                    cardMetaData.repostOf = element.attribs["data-repost-of"] || undefined;
                    cardMetaData.price = priceElement.text() || cardMetaData.price;
                    cardMetaData.title = titleAndUrlElement.text();
                    cardMetaData.url = titleAndUrlElement.attr("href");
                    
                    return cardMetaData;
                } catch (e) {
                    console.log(e);
                }
            }).toArray();
            
            return result;
        } catch (e) {
            console.log('dao', e);
        }
    }
}