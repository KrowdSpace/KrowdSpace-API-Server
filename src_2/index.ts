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

    console.log(f);

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

    let dcP = dataCon.open(),
        rsP = restServer.start();

    let dcR = await dcP;
    let rsR = await rsP;

    let cuG = dataMan.dataGetters['contact_us_getter'];
    let td = {fname: 'Ben', lname: 'Otter', email: 'Redford@deadford.com', comment: 'Uhhhh'};
    cuG.add(td).then(
        (res)=>
        {
            console.log("Golden!");
        },
        (err)=>
        {
            console.log(err);
        });
}

serverStartup();