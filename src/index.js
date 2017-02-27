import {sep} from 'path';

import restify from 'restify';
import mysql from 'mysql';

import Logger from './lib/logger.js';

import {user, proj, socials, impressions} from './lib/user_test.js';
import {emailList, contactUs} from './lib/contact_us.js';

//See Admin for details on sec dir.
import {dbConf, restConf} from './sec/sec.js';

let logDir;

//Can I get a, uhh, Hackity hacky hack, with some jank on the side?
{
    let f = __filename.split(sep);
    f.pop(); f.pop();
    logDir = f.join(sep) + `${sep}logs${sep}`;
}

//Logger
const log = new Logger(logDir);
log.start();

//Rest server
const restServer = restify.createServer();
//DB connection
const dbC = mysql.createConnection(dbConf);

//Get Cors Started
restServer.use(restify.fullResponse());

//Test Block
restServer.get(user.userUrl, user.getUser);
restServer.get(proj.projUrl, proj.getProj);
restServer.get(socials.socUrl, socials.getSocials);
restServer.get(impressions.impUrl, impressions.getImp);

//Email List and Contact us additions
restServer.post(emailList.elURL, emailList.postEL);
restServer.post(contactUs.cuURL, contactUs.postCU);

//Start Rest Server
restServer.listen(restConf.port, ()=>
{
    log.info(`Server On, and Listening on port ${restConf.port}`);
});
