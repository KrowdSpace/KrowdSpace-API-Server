import {sep} from 'path';

import Logger from './lib/ott/ottlogger';
import RestServer from './lib/ott/ottstify';
import DataBase from './lib/ott/ottdb';

import {test_urls, urls} from './lib/urls/ks_urls';
import {templates} from './lib/db_templates/ks_templates';

import {dbConf, restConf} from './sec/sec'; 

let logDir; //Can I get a, uhh, Hackity hacky hack, with some jank on the side?
{
    let f = __filename.split(sep); f.pop(); f.pop(); 
    logDir = f.join(sep) + `${sep}logs${sep}`;
}

const log = new Logger(logDir);
const dbC = new DataBase(dbConf, log);
const restServer = new RestServer(restConf, dbC, log);

log.info("-------------------------------", "------");
log.info("Krowdsource API Server Startup!", "Server");

//Adding DataBase API templates

for(let Template of templates)
    dbC.addTemplate(Template);

//Adding Rest API Urls

for(let Url of test_urls)
    restServer.addUrl(Url);

for(let Url of urls)
    restServer.addUrl(Url);

//Starting Server Services

dbC.start();
restServer.start();
