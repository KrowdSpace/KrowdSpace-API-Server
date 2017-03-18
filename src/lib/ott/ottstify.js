/*
 * Ottstify.js
 * (Pronounced Aught-Stiff-Eye, not ott-stiffy >.>)
 * (C) Ben Otter (Benjamin McLean), 2017
 */
import restify from 'restify';
import resCookies from 'restify-cookies';

import Logger from './ottlogger';
import DataBase from './ottdb';

/** Otter's Restify Abstraction Class */
export default class RestServer
{
    serviceName = "Rest API"

    urls = new Set();
    loadedURLs = new Set();

    firstRun = true;

    /**
     * Creates a new Ott Restify Abstractor.
     * @constructor
     * @typedef { {} } RestServer
     * @param {Object} opts Restify createServer Opts Object
     * @param {DataBase} dbC Ott DataBase Object
     * @param {Logger} log Instance of Logger
     */
    constructor(opts, dbC, log)
    {
        this.opts = opts;
        this.dbC = dbC;
        this.log = log;

        this.server = restify.createServer(opts);

        //Rest Server Opts
        this.server.use(restify.bodyParser());
        this.server.use(restify.fullResponse());

        //Cookie Support
        this.server.use(resCookies.parse);
    }
    /**
     * Add URL to rest server
     * @param {RestURL} urlO URL Object Class
     */
    addUrl(urlO)
    {
        this.log.log(`Adding "${urlO.url}", type ${urlO.type}, to URL List.`, this.serviceName);
        return this.urls.add(urlO);
    }
    /**
     * Sets up Rest Server
     */
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

            this.log.info(`Set up Rest API ${UrlT.type} Url "${UrlT.url}" with dbPriv: ${UrlT.dbPriv}`, this.serviceName);

            UrlT.loaded = true;
        }
    }
    /**
     * Starts Rest Server
     */
    start()
    {
        if(this.firstRun)
        {
            this.setup();
            this.firstRun = false;
        }

        this.server.listen(this.opts.port, ()=>
        {
            this.log.info(`Server Online, and Listening on port ${this.opts.port}.`, this.serviceName);
        });
    }
}

/** Base class for extending URL behaviors */
export class RestURL
{
    /** @type {string} type type of request */
    static type = 'get';
    /** @type {string} url url for the rest server */
    static url = "";

    /** @type {boolean} dbPriv if this template needs DB privileges */
    static dbPriv = false;

    /** @type {boolean} loaded if this template object has been loaded into a rest server */
    loaded = false;
    /**
     * Creates new Rest URL Object for RestServer
     * @param {Logger} log Logger Object
     * @param {DataBase} dbC DataBase Object
     */
    constructor(log, dbC)
    {
        this.log = log;
        this.dbC = dbC;
    }
    /**
     * Called when your URL is visited
     * @param {*} req request object from restify
     * @param {*} res response object from restify
     * @param {Function} n next function from restify
     */
    onLoad(req, res, n)
    {
        res.end();
        n();
    }
}