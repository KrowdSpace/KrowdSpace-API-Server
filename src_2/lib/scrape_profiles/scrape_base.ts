import * as request from 'request-promise-native';
import * as cheerio from 'cheerio';

import * as ksData from './kickstarter';
import * as igData from './indiegogo';

import {DataGetter} from '@otter-co/ottlib';

export interface ScrapeMetaData
{
    content: string,
    mainImg: string,

    funding: number,

    raised: number,
    raisedPercent: number,

    duration: number,
    endTime: number,

    featured: boolean,
    explore: boolean,
    landing: boolean,
    social: boolean,

    refresh: boolean,
}

export async function UpdateProject(pID: string, projG: DataGetter)
{
    let projR = await projG.get({'$or':[{unique_id: pID}, {name: pID}, {owner: pID}]}).catch(err=>err);

    if(!projR.success || !projR.data[0])
        return false;

    let p = projR[0];

    let reqOpts = {
        url: p.info_data.url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
        }
    };

    let scrapeProfile, metaFunc;

    switch(p.platform)
    {
        case 'kickstarter':
            scrapeProfile = ksData.pageIDs;
            metaFunc = ksData.metaDataFunc;
        break;

        case 'indiegogo':
            scrapeProfile = igData.pageIDs;
            metaFunc =igData.metaDataFunc;
        break;
    }

    let rawWData = await request(reqOpts).catch(err=>err);
    let webData = this.getURLData(rawWData, scrapeProfile);

    if(!webData.title.content)
        return false;

    let setObj = {
        project_data:
        {
            web_data: webData,
            meta_data: metaFunc(webData)
        }
    };

    let psR = await projG.set(p.unique_id, setObj).catch(err=>err);

    return psR.success;
}