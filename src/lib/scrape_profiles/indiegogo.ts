/**
 * scrape_profiles/indiegogo.ts
 * 
 * Contains the Scrape Profile for IndieGogo,
 * But really its a hack around my own API for accesing the ig data API.
 */

import {ScrapeMetaData} from './scrape_base';

import * as request from 'request-promise-native';
import {safeJSON} from '@otter-co/ottlib';

export const pageIDs = Object.create(null);
export async function metaDataFunc(wd: any, rawWD: string)
{
    let retO : any = {};

    retO.jsonReply = safeJSON(rawWD);

    let dO = retO.jsonReply.response;
    
    try
    {
        retO.mainImg = dO.video_overlay_url;
        retO.altImg = dO.image_types && dO.image_types.original;

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