/**
 * Ottstify.js
 * (Pronounced Aught-Stiff-Eye, not ott-stiffy >.>)
 * (C) Ben Otter (Benjamin McLean), 2017
 */

import restify from 'restify';

export default class RestServer
{
    servN = "Rest API"

    urls = new Set();
    loadedURLs = new Set();

    firstRun = true;

    constructor(opts, log, dbC)
    {
        this.opts = opts;
        this.server = restify.createServer(opts);
        this.log = log;
        this.dbC = dbC;
    }

    addUrl(urlO)
    {
        this.log.log(`Adding "${urlO.url}", type ${urlO.type}, to URL List.`, this.servN);
        return this.urls.add(urlO);
    }

    setup()
    {
        let rs = this.server;
        for(let UrlT of this.urls)
        {
            //Does URL have DB Privileges?
            let url = UrlT.dbPriv ? new UrlT(this.log, this.dbC) : new UrlT(this.log);

            switch(UrlT.type)
            {
                case 'get':
                    rs.get(UrlT.url, (req, res, n) => { url.onLoad(req, res, n); });
                break;

                case 'post':
                    rs.post(UrlT.url, (req, res, n) => { url.onLoad(req, res, n); });
                break;

                case 'put':
                    rs.put(UrlT.url, (req, res, n) => { url.onLoad(req, res, n); });
                break;

                case 'delete':
                    rs.delete(UrlT.url, (req, res, n) => { url.onLoad(req, res, n); });
                break;
            }

            this.log.info(`Set up Rest API ${UrlT.type} Url "${UrlT.url}" with dbPriv: ${UrlT.dbPriv}`, this.servN);

            UrlT.loaded = true;
        }
    }

    start()
    {
        if(this.firstRun)
        {
            this.setup();
            this.firstRun = false;
        }
        
        this.server.use(restify.fullResponse());

        this.server.listen(this.opts.port, ()=>
        {
            this.log.info(`Server Online, and Listening on port ${this.opts.port}.`, this.servN);
        });
    }
}

export class RestURL
{
    static type = 'get';
    static url = "";

    static dbPriv = false;

    loaded = false;

    constructor(log, dbC)
    {
        this.log = log;
        this.dbC = dbC;
    }

    onLoad(req, res, n)
    {
        res.end();
        n();
    }
}