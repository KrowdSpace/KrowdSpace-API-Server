import * as request from 'request-promise-native';
import * as cheerio from 'cheerio';

import * as ksData from './kickstarter';
import * as igData from './indiegogo';

import {DataGetter} from '@otter-co/ottlib';

export async function UpdateProject(pID: string, projG: DataGetter, apiK: string = "")
{
    let projR = await projG.get({'$or':[{unique_id: pID}, {name: pID}, {owner: pID}]}).catch(err=>err);

    if(!projR.success || !projR.data[0])
        return {success: false, data: {projR}};

    let p = projR.data[0];

    let reqOpts = {
        url: (p.platform == 'indiegogo' ? p.project_data.info_data.scrape_url : p.project_data.info_data.url),
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
        }
    };

    console.log(p, p.project_data.info_data.url);

    let scrapeProfile, metaFunc;

    switch(p.platform)
    {
        case 'kickstarter':
            scrapeProfile = ksData.pageIDs;
            metaFunc = ksData.metaDataFunc;
        break;

        case 'indiegogo':
            scrapeProfile = igData.pageIDs;
            metaFunc = igData.metaDataFunc;
        break;
    }

    let rawWData = await request(reqOpts).catch(err=>err);
    let webData = getURLData(rawWData, scrapeProfile);

    let setObj: any = {
        name: (webData && webData.title && webData.title.content) ? webData.title.content : "",
        project_data:
        {
            raw_web_data: rawWData,
            web_data: webData,
            meta_data: {} as ScrapeMetaData
        }
    };

    setObj.project_data.meta_data = await metaFunc(webData, rawWData).catch(err=>err);

    if(!setObj.name && setObj.project_data.meta_data)
            setObj.name = setObj.project_data.meta_data.title;

    if(p.platform === 'indiegogo')
        setObj.project_data.info_data = { url: setObj.project_data.meta_data.jsonReply.response.web_url };
            
    let psR = await projG.set({ _id: p._id }, setObj).catch(err=>err);
    
    if(psR.success)
        console.log("Updated Project!");
    else
        console.log("Project Not Updated!");

    return {success: psR};
}

export function getURLData(data, dataT): any
{
    let $ = cheerio.load(data);

    let retVal = {};

    for(let el in dataT)
    {
        let ar = dataT[el],
            id = ar.shift(),
            val = {};

        for(let att in ar)
        {
            let prN = ar[att],
                prV = null;
            
            if(prN === "text")
                prV = $(id).text();
            else if(prN === "html")
                prV = $(id).html();
            else
                prV = $(id).attr(prN);

            val[prN] = prV;
        }

        ar.unshift(id);

        retVal[el] = val;
    }

    return retVal;
}

export interface ScrapeMetaData
{
    title: string,
    description: string,

    content: string,
    mainImg: string,
    altImg: string,

    funding: string,

    raised: number,
    raisedPercent: number,

    duration: number,
    endTime: number,
}
