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
            'div#campaignDescription',

            'text',
            'html'
        ],
        stats: [
            'div[gogo-test="percent_funded"]',

            'text',
            'html'
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
            'span.campaignGoalProgress-raisedAmount',

            'text',
        ]
    };

export function metaDataFunc(wd: any): any
{
    return {};
}