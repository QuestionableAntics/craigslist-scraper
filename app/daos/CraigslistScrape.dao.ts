import $ = require('cheerio')
import rp = require('request-promise');
import request = require('request');
import requestPromise = require('request-promise');
import fs = require('fs');
import CraigslistSearchCard from '../models/craigslist-search-card.model';

export default class CraigslistScrapeDao {
    craigslistUrl: string = "https://www.craigslist.org/about/sites";
    baseUrl: string = "https://columbiamo.craigslist.org/"

    async getPage(pageUrl: string) {
        return await rp(pageUrl);
    }

    async getCardMetaData(search: string, cityUrl: string = this.baseUrl, resultCount: number = 120) {
        try {
            const searchUrl = `${cityUrl}search/cta?query=${search}`;
            // const pageHtml = await this.getSearchPage(search);
            const pageHtml = await this.getPage(searchUrl);

            const resultRows = $('div .result-row', pageHtml);

            const result: CraigslistSearchCard[] = resultRows.map((i, element) => {
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
                    console.log('Error filling out card metadata \n\n', e);
                }
            }).get() as any as CraigslistSearchCard[];
            
            return result;
        } catch (e) {
            console.log('craigslistscrapedao.getcardmetadata \n\n', e);
        }
    }

    async getAllCities() {
        const states = await this.getAllStates();
        const cityUrls = states.map(state => this.getCitiesFromState(state));
        return cityUrls;
    }

    async getCitiesFromState(state: string) {
        const pageHtml = await this.getPage(this.craigslistUrl);
        const stateHeader = $(`h4:contains('${state}')`, pageHtml); 
        const cityUL = stateHeader.next("ul")
        const cityListElements = cityUL.children();
        const cityUrls = cityListElements.map((i, element) => $(element).find('a').attr("href")).get();
        const httpsCityUrls = cityUrls.filter(cityUrl => cityUrl.indexOf('https') > -1);
        
        return httpsCityUrls;
    }

    async getAllStates() {
        const pageHtml = await this.getPage(this.craigslistUrl);
        const stateColumns = $('h1', pageHtml).nextUntil('h1')[0];
        const stateHeaders = $(stateColumns).find('h4');
        const states = stateHeaders.map((i, element) => $(element).text()).get();

        return states;
    }
}