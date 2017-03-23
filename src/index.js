import {sep} from 'path';

import ConfigLoader from './lib/ott/ottconf';
import Logger from './lib/ott/ottlogger';
import RestServer from './lib/ott/ottstify';
import DataBase from './lib/ott/ottdb';

import {test_urls, urls} from './lib/urls/ks_urls';
import {templates} from './lib/db_templates/ks_templates';

let logDir, cfgDir; //Can I get a, uhh, Hackity hacky hack, with some jank on the side?
{
    let f = __filename.split(sep); f.pop(); f.pop(); 
    f = f.join(sep);
    logDir = `${f + sep}logs${sep}`;
    cfgDir = `${f + sep}conf${sep}ks_conf.json`;
}

const log = new Logger(logDir);

log.info("-------------------------------", "------");
log.info("Krowdsource API Server Startup!", "Server");

const cfgL = new ConfigLoader(cfgDir, log);

//Loading Config
cfgL.start();

const cfg = cfgL.config;

const dbC = new DataBase(cfg, log);
const restServer = new RestServer(cfg, dbC, log);

//Adding DataBase API templates
for(let Template of templates)
    dbC.addTemplate(Template);


//Adding Rest API Urls

//Test URLs
for(let Url of test_urls) 
    restServer.addUrl(Url);

//Productions URLS
for(let Url of urls) 
    restServer.addUrl(Url);

//Starting Server Services
dbC.start();
restServer.start();
