/**
 * Ottstify.js
 * (Pronounced Aught-Stiff-Eye, not ott-stiffy >.>)
 * (C) Ben Otter (Benjamin McLean), 2017
 */

import restify from 'restify';

export class RestServer
{
    servN = "Rest API"
    urls = new Set();
    firstRun = true;

    constructor(opts, log)
    {
        this.opts = opts;
        this.server = restify.createServer(opts);
        this.log = log;
    }

    addURL(urlO)
    {
        this.log.info(`Adding ${url.url} type ${url.type} to URL List.`, this.servN);
        return this.urls.add(urlO);
    }

    setup()
    {
        let rs = this.server;
        for(let url of this.urls)
        {
            if(url.loaded) 
                continue;

            switch(url.type)
            {
                case 'get':
                rs.get(url.url, (req, res, n) => { url.onLoad(req, res, n); });
                break;

                case 'post':
                rs.post(url.url, (req, res, n) => { url.onLoad(req, res, n); });
                break;

                case 'put':
                rs.put(url.url, (req, res, n) => { url.onLoad(req, res, n); });
                break;

                case 'delete':
                rs.delete(url.url, (req, res, n) => { url.onLoad(req, res, n); });
                break;
            }

            this.log.info(`Set up Rest API ${url.type} Url "${url.url}"`, this.servN);

            url.loaded = true;
        }
    }

    start()
    {
        if(firstRun)
        {
            setup();
            firstRun = false;
        }
            

        this.listen(this.opts.port, ()=>
        {
            this.log.info(`Server Online, and Listening on port ${this.opts.port}.`, this.servN);
        });
    }
}

export class RestURL
{
    constructor(url, log, type = "get")
    {
        this.url = url;
        this.log = log;
        this.type = type;
    }

    loaded = false;

    onLoad(req, res, n)
    {
        res.end();
        n();
    }
}