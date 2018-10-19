import $ = require('cheerio')
import rp = require('request-promise');
import request = require('request');
import requestPromise = require('request-promise');
import fs = require('fs');

export default class CraigslistScrapeDao {
    baseUrl: string = "https://columbiamo.craigslist.org/"
    async getSearchPage() {
        const scrapedHtmlPromise = rp(this.baseUrl + "search/cta?query=honda+accord")
            .then((html) => {
                return html;
            })
            .catch(e => {
                console.log(e);
            });

        return await scrapedHtmlPromise;
        
    }

    getCardMetaData() {
        const pageHtml = this.getSearchPage();
        pageHtml.then(html => {
            
            const result = $('div .result-row', html).map((i, element) => {
                const priceElement: any = $(element).find('.result-meta > .result-price')[0];
                const price = priceElement ? priceElement.children[0].data : 'no price available';
                
                const titleAndUrlElement = $(element).find('a.result-title')[0];
                const title = titleAndUrlElement.children[0].data;

                const url = titleAndUrlElement.attribs.href;

                return {
                    price: price,
                    title: title,
                    url: url,
                    yee: 'yee'
                }
                
            });

            console.log(result);
            

            return result;
            
        })
    }

    
}