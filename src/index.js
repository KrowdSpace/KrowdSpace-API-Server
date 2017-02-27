//Built-Ins
import {sep} from 'path';
//3rd Party
import mysql from 'mysql';
//Internal Libs
import {dbConf, restConf} from './sec/sec.js'; //See Admin for details on sec dir.
import Logger from './lib/logger.js';
import RestServer from './lib/ottstify.js';
import {test_urls, urls} from './lib/ks_urls.js';


let logDir;

//Can I get a, uhh, Hackity hacky hack, with some jank on the side?
{
    let f = __filename.split(sep); f.pop(); f.pop(); 
    logDir = f.join(sep) + `${sep}logs${sep}`;
}

const log = new Logger(logDir);

log.info("-------------------------------", "------");
log.info("Krowdsource API Server Startup!", "Server");

const dbC = mysql.createConnection(dbConf);
dbC.connect((err)=>
{
    if(err)
        log.error(`Could not connect to DB: ${err.stack}`, 'DataBase');
    else
        log.info('Successfuly Connected to DataBase!', 'DataBase');
});

const restServer = new RestServer(restConf, log, dbC);

for(let Url of test_urls)
    restServer.addUrl(Url);

for(let Url of urls)
    restServer.addUrl(Url);

restServer.start();


