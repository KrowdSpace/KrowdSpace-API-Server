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

export function metaDataFunc(wd: any) : ScrapeMetaData
{
    let retO: ScrapeMetaData = <ScrapeMetaData> {};

        try
        {
            let fund = wd.funding.text;

            retO.content = wd.content.html;
            retO.mainImg = wd.mainImg.content;

            retO.funding = wd.funding.text.split( /(\$|\€|\£|MX\$|CA|AU)/g )[2];
            //retO.fundingTest = fund.split( /(\$|\€|MX\$)/g ).filter( el => !(el.contains('MX$') || el.contains('$') || el.contains('€')) );

            retO.raised = +wd.stats['data-pledged'];
            retO.raisedPercent = +wd.stats['data-percent-raised'];

            retO.duration = wd.hours['data-duration'];
            retO.endTime = wd.hours['data-end_time'];

            retO.featured = false;
            retO.explore = false;
            retO.landing = false;
            retO.social = false;

            retO.refresh = false;
        }
        catch(e)
        {
            console.log(e);
        }

        return retO;
};