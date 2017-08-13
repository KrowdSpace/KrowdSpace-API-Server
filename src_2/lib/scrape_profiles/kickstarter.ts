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

            retO.funding = wd.funding.text.split( /(\$|\€|\£|MX\$|CA|AU|HK)/g )[2];
            //retO.fundingTest = fund.split( /(\$|\€|MX\$)/g ).filter( el => !(el.contains('MX$') || el.contains('$') || el.contains('€')) );

            retO.raised = +wd.stats['data-pledged'];
            retO.raisedPercent = +wd.stats['data-percent-raised'];

            retO.duration = wd.hours['data-duration'];
            retO.endTime = wd.hours['data-end_time'];
        }
        catch(e)
        {
            console.log(e);
        }

        

        return retO;
};