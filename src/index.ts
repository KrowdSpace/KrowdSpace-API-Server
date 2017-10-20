/**
 * index.ts
 * 
 * Main Starup File,
 * I like small functions.
 * 
 * All subsystems are are started here.
 */

import {sep} from 'path';

import {RestServer, 
        ConfigHandler,
        DataManager,
        extras} from '@otter-co/ottlib'; // My Personal JS Library

import data_templates from './lib/data_templates/data_templates';
import urls from './lib/urls/urls';

// Needs a bit of cleanup, but this just gets some dir Paths.
let logDir, cfgDir; 
{
    let f: string[] | string = __filename.split(sep);
    f.splice(-2);
    f = f.join(sep);

    logDir = `${f + sep}logs${sep}`;
    cfgDir = `${f + sep}conf${sep}ks_conf.json`;
}
/**
 * @function serverStartup - Starts up the Server
 */
async function serverStartup()
{
    let cfg = await (new ConfigHandler(cfgDir)).start().catch(err=>err);

    // Creates, but doesn't start, the MongoDB Connection (Used to be MySQL)
    let dataCon = new extras.mongodb_extra.MongoDBConnection(cfg.dbConf);
    let dataMan = new DataManager(dataCon);
 
    // Creates, but doesn't start, the Restify Abstraction Server
    let restServer = new RestServer(cfg, dataMan);

    // Adds all REST api URLs
    for(let UrlC of urls)
        restServer.addURL(UrlC);

    // Get promises for server startup.
    let dcP = dataCon.open().catch(err=>err),
        rsP = restServer.start().catch(err=>err);

    // Some Async, starts up DB Connection and REST HTTP server.
    let dcR = await dcP,
        rsR = await rsP;

    // DB Connect Succesful, move forward, else, do not pass Go.
    if(dcR.success)
    {
        console.log("DataBase Connected!");
        
        // Flaw in my Data Abstraction
        // With Mongo, the Data Schemas / Templates must be added AFTER connecting.
        for(let DataG of data_templates)
            dataMan.addDataGetter(DataG);
    }
    else 
    {
        console.log("DataBase Connection Failed!");
        return;
    }
    
    // Server Startup Successful, move forward, else, get rekt.
    if(rsR.success)
        console.log("Rest Server Started!");
    else
        console.log("Rest Server Failed to Start!");
}

// This is a function.
// It's a StartUp Function.
// It starts up the server.
// Full Documentation is important.
// Otherwise, we would have to rely on CODE being SELF DOCUMENTING!
serverStartup();