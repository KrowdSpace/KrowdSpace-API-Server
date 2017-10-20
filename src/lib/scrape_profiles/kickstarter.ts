/**
 * scrape_profiles/kickstarter.ts
 * 
 * Contains the Scrape Profile for Kickstarter's WebSite
 */

import {ScrapeMetaData} from './scrape_base';

export const pageIDs = {
        title: [
            'meta[property="og:title"]',

            'content'
        ],
        description: [
            'meta[property="og:description"]',

            'content'
        ],
        content: [
            "div.full-description",

            'text',
            'html'
        ],
        stats: [
            "#pledged",

            'data-goal',
            'data-percent-raised',
            'data-pledged'
        ],
        mainImg: [
            'meta[property="og:image"]',

            'content'
        ],
        hours: [
            'span[data-hours-remaining]',

            'data-duration',
            'data-end_time',
            'text'
        ],
        funding: [
            'span.money',

            'text'
        ]
};

export async function metaDataFunc(wd: any)
{
    let retO: ScrapeMetaData = <ScrapeMetaData> {};

        try
        {
            retO.title = wd.title.content;
            retO.description = wd.description.content;

            retO.content = wd.content.html;
            retO.mainImg = wd.mainImg.content;
            retO.altImg = "kickstarter";

            retO.funding = wd.funding.text.split( /(\$|\€|\£|MX\$|CA|AU|HK|S)/g )[2];
            retO.raised = +wd.stats['data-pledged'];

            if(Number.isNaN(retO.raised))
                    retO.raised = 0;

            retO.raisedPercent = +wd.stats['data-percent-raised'];

            if(Number.isNaN(retO.raisedPercent))
                    retO.raisedPercent = 0;

            retO.duration = wd.hours['data-duration'];
            retO.endTime = wd.hours['data-end_time'];
        }
        catch(e)
        {
            console.log(e);
        }

        return retO;
};