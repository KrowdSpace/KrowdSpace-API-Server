export const pageIDs = {
        title: [
            'meta[property="og:title"]',

            'content'
        ],
        description: [
            'meta[name="description"]',

            'content'
        ],
        content: [
            'div[gogo-test="description"]',

            'text',
            'html'
        ],
        stats: [
            'span[gogo-test="raised"]',

            'text',
        ],
        percentRaised: [
            'meta[name="sailthru.pct_funded"]',

            'content'
        ],
        mainImg: [
            'meta[property="og:image"]',

            'content'
        ],
        hours: [
            'meta[name="sailthru.displayed_days_left"]',
 
            'content'
        ],
        funding: [
            'div[gogo-test="percent_funded"]',

            'text',
            'html'
        ]
    };

export function metaDataFunc(wd: any): any
{
    return {};
}