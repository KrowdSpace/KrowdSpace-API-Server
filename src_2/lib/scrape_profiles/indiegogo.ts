import {ScrapeMetaData} from './scrape_base';

import * as request from 'request-promise-native';
import {safeJSON} from '@otter-co/ottlib';

export const pageIDs = {
        title: [
            'meta[property="og:title"]',

            'content'
        ],
        description: [
            'meta[name="description"]',

            'content'
        ],
        projectID:
        [
            'meta[name="sailthru.project_id"]',

            'content'
        ],

        content: [
            'ui-view',

            'text',
            'html'
        ],
        stats: [
            'span.campaignGoalProgress-raisedAmount',

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
        endTime: 
        [
            'meta[name="sailthru.date"]',
 
            'content'
        ],
        funding: [
            'div.campaignGoalProgress-detailsGoal div.ng-binding',

            'text',
        ]
    };

export async function metaDataFunc(wd: any, api_token: any)
{
    let retO : any = {};

    if(wd.projectID && wd.projectID.content)
    {
        let url = `https://api.indiegogo.com/1/campaigns/${ wd.projectID.content }.json?api_token=${api_token}`;
        
        let reqOpts = {
            url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
            }
        };
        
        let newWD = await request(reqOpts);

        retO.content = {
            raw: newWD,
            parsed: safeJSON(newWD)
        };
    }
    else
        retO.content = {fack: "Fack"};

    let fund = wd.funding.text;

    // retO.content = wd.content.html;
    retO.mainImg = wd.mainImg.content;

    retO.funding = wd.funding.text.split( /(\$|\€|\£|MX\$|CA|AU)/g )[2];

    retO.raised = wd.stats.text;
    retO.raisedPercent = wd.percentRaised.content;

    retO.duration = +wd.hours.content.split(' ')[0];
    retO.endTime = wd.endTime.content;

    retO.featured = false;
    retO.explore = false;
    retO.landing = false;
    retO.social = false;
    retO.reward = false;

    retO.refresh = false;

    return <ScrapeMetaData> retO;
}