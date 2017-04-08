/**
 * Copyright KrowdSpace LLC, 2017
 * 
 * This Project (Project Being all KrowdSpace Specific Code) 
 * and its 1st Party Libraries Licensed under the MIT LICENSE, 
 * and owned by KrowdSpace LLC, unless otherwise stated.
 * 
 * 3RD party Libraries subject to their own licenses, respectfully.
 */
import {sep} from 'path';

import Logger from './lib/ott/ottlogger';
import ConfigLoader from './lib/ott/ottconf';
import DataBase from './lib/ott/ottdb';
import EMailer from './lib/ott/ottmail';
import RestServer from './lib/ott/ottstify';

import {db_templates} from './lib/db_templates/db_templates';
import {email_templats} from './lib/email_templates/email_templates';

import {test_urls, urls} from './lib/urls/urls';


let logDir, cfgDir; //Can I get a, uhh, Hackity hacky hack, with some jank on the side?
{
    let f = __filename.split(sep);
    f.splice(-2);
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
const mailer = new EMailer(cfg, log);
const restServer = new RestServer(cfg, dbC, mailer, log);

//Adding DataBase API templates
for(let Template of db_templates)
    dbC.addTemplate(Template);

//Adding Email API templates
for(let Template of email_templates)
    mailer.addTemplate(Template);

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
