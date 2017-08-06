import {ScrapeMetaData} from './scrape_base';

import * as request from 'request-promise-native';
import {safeJSON} from '@otter-co/ottlib';

export const pageIDs = Object.create(null);
// {
//         title: [
//             'meta[property="og:title"]',

//             'content'
//         ]
    //     description: [
    //         'meta[name="description"]',

    //         'content'
    //     ],
    //     projectID:
    //     [
    //         'meta[name="sailthru.project_id"]',

    //         'content'
    //     ],

    //     content: [
    //         'ui-view',

    //         'text',
    //         'html'
    //     ],
    //     stats: [
    //         'span.campaignGoalProgress-raisedAmount',

    //         'text',
    //         'html'
    //     ],
    //     percentRaised: [
    //         'meta[name="sailthru.pct_funded"]',

    //         'content'
    //     ],
    //     mainImg: [
    //         'meta[property="og:image"]',

    //         'content'
    //     ],
    //     hours: [
    //         'meta[name="sailthru.displayed_days_left"]',
 
    //         'content'
    //     ],
    //     endTime: 
    //     [
    //         'meta[name="sailthru.date"]',
 
    //         'content'
    //     ],
    //     funding: [
    //         'div.campaignGoalProgress-detailsGoal div.ng-binding',

    //         'text',
    //     ]
    // };

export async function metaDataFunc(wd: any, rawWD: string)
{
    let retO : any = {};

    retO.jsonReply = safeJSON(rawWD);

    let dO = retO.jsonReply.response;
    
    try
    {
        retO.mainImg = dO.image_types && dO.image_types.original;
        retO.title = dO.title;

        retO.description = dO.tagline;

        retO.content = "";
        
        retO.funding = dO.goal;

        retO.raised = dO.collected_funds;
        retO.raisedPercent = retO.raised / retO.funding;

        retO.duration = dO.funding_days;
        retO.endTime = dO.funding_ends_at;
    }
    catch(e)
    {
        console.log(e);
    }

    return <ScrapeMetaData> retO;
}