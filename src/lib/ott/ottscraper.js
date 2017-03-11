/*
 * OttScraper.js
 * (C) Ben Otter (Benjamin McLean), 2017
 */

export class Scraper 
{
    serviceName = "Scraper";
    
    profiles = new Map();

    constructor(opts, log)
    {
        this.log = log;
    }

    addProfile(prof)
    {

    }

    removeProfile(prof)
    {

    }
}

export class ScraperProfile 
{
    static type = new Symbol("ScraperProfile");

    getData(id, cb)
    {

    }
}