import {sep} from 'path';

import {RestServer, 
        ConfigHandler,
        DataManager,
        dataman_extras} from '@otter-co/ottlib';

import data_templates from './lib/data_templates/data_templates';
import urls from './lib/urls/urls';

let logDir, cfgDir; //Can I get a, uhh, Hackity hacky hack, with some jank on the side?
{
    let f: string[] | string = __filename.split(sep);
    f.splice(-2);
    f = f.join(sep);

    logDir = `${f + sep}logs${sep}`;
    cfgDir = `${f + sep}conf${sep}ks_conf.json`;
}

async function serverStartup()
{
    let config = new ConfigHandler(cfgDir);
    let cfg = await config.start();

    let dataCon = new dataman_extras.MySQLConnection(cfg.dbConf);
    let dataMan = new DataManager(dataCon);

    for(let DataG of data_templates)
        dataMan.addDataGetter(DataG); 

    let restServer = new RestServer(cfg.restConf, dataMan);

    for(let UrlC of urls)
        restServer.addURL(UrlC);

    let dcP = dataCon.open(),
        rsP = restServer.start();

    let dcR = await dcP;
    let rsR = await rsP;

    if(dcR.success)
        console.log("DataBase Connected!");
    
    if(rsR.success)
        console.log("Rest Server Loaded!");
}

serverStartup();