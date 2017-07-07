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

export function metaDataFunc(wd: any) : any
{
    let retO: any = {};
        try
        {
            let fund = wd.funding.text;

            retO.funding = wd.funding.text.split( /(\$|\€|\£|MX\$|CA|AU)/g )[2];
            //retO.fundingTest = fund.split( /(\$|\€|MX\$)/g ).filter( el => !(el.contains('MX$') || el.contains('$') || el.contains('€')) );
    
            retO.raisedPercent = +wd.stats['data-percent-raised'];
            retO.raised = +wd.stats['data-percent-raised'] * retO.funding;

            retO.featured = false;
            retO.explore = false;
            retO.landing = false;
            retO.social = false;
        }
        catch(e)
        {
            console.log(e);
        }

        return retO;
};