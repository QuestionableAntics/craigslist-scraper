import $ = require('cheerio')
import rp = require('request-promise');
import request = require('request');
import requestPromise = require('request-promise');
import fs = require('fs');
import CraigslistSearchCard from '../models/craigslist-search-card.model';

export default class CraigslistScrapeDao {
    craigslistUrl: string = "https://www.craigslist.org/about/sites";
    baseUrl: string = "https://columbiamo.craigslist.org/"
    async getSearchPage(search: string) {
        const searchPageUrl = `${this.baseUrl}search/cta?query=${search}`;
        return await this.getPage(searchPageUrl);
    }

    async getPage(pageUrl: string) {
        return await rp(pageUrl);
    }


    async getCardMetaData(search: string, cityUrl: string = this.baseUrl, resultCount: number = 120) {
        try {
            const searchUrl = `${cityUrl}search/cta?query=${search}`;
            // const pageHtml = await this.getSearchPage(search);
            const pageHtml = await this.getPage(searchUrl);

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
            });
            console.log(result.map(el => el.price));
            
            return result;
        } catch (e) {
            console.log('dao', e);
        }
    }

    async getCitiesFromState(state: string) {
        const pageHtml = await this.getPage(this.craigslistUrl);
        const stateHeader = $(`h4:contains('${state}')`, pageHtml); 
        const cityUL = stateHeader.next("ul")
        const cityListElements = cityUL.children();
        const cityUrls = cityListElements.map((i, element) => $(element).find('a').attr("href")).toArray();
        
        return cityUrls;
    }
}