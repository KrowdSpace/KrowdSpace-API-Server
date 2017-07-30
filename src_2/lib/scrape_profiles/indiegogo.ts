import {ScrapeMetaData} from './scrape_base';

import * as request from 'request-promise-native';
import {safeJSON} from '@otter-co/ottlib';

export const pageIDs = Object.create(null);
// {
//         title: [
//             'meta[property="og:title"]',

//             'content'
//         ],
//         description: [
//             'meta[name="description"]',

//             'content'
//         ],
//         projectID:
//         [
//             'meta[name="sailthru.project_id"]',

//             'content'
//         ],

//         content: [
//             'ui-view',

//             'text',
//             'html'
//         ],
//         stats: [
//             'span.campaignGoalProgress-raisedAmount',

//             'text',
//             'html'
//         ],
//         percentRaised: [
//             'meta[name="sailthru.pct_funded"]',

//             'content'
//         ],
//         mainImg: [
//             'meta[property="og:image"]',

//             'content'
//         ],
//         hours: [
//             'meta[name="sailthru.displayed_days_left"]',
 
//             'content'
//         ],
//         endTime: 
//         [
//             'meta[name="sailthru.date"]',
 
//             'content'
//         ],
//         funding: [
//             'div.campaignGoalProgress-detailsGoal div.ng-binding',

//             'text',
//         ]
//     };

export async function metaDataFunc(wd: any, rawWD: string)
{
    let retO : any = {};

    retO.jsonReply = safeJSON(rawWD);
    
    try
    {
        let fund = wd.funding.text;

        // retO.content = wd.content.html;
        retO.mainImg = wd.mainImg.content;

        retO.funding = wd.funding.text.split( /(\$|\€|\£|MX\$|CA|AU)/g )[2];

        retO.raised = wd.stats.text;
        retO.raisedPercent = wd.percentRaised.content;

        retO.duration = +wd.hours.content.split(' ')[0];
        retO.endTime = wd.endTime.content;

    }catch(e){}

    retO.featured = false;
    retO.explore = false;
    retO.landing = false;
    retO.social = false;
    retO.reward = false;

    retO.refresh = false;

    return <ScrapeMetaData> retO;
}