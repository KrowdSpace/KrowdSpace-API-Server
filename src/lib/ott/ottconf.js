/**
 * OttConf.js
 * Otter's Configuration Loader/Manager
 * (C) Ben Otter (Benjamin McLean), 2017
 */
import * as fs from 'fs';

import Logger from './ottlogger';
import * as ottUtil from './ottutil';

/**
 * Otter's Config Loader
 * @export
 * @class ConfigLoader
 */
export default class ConfigLoader
{
    serviceName = "ConfigLoader";

    /** @type {def_config} config Config object, if live-reload is enabled, this object is updated on conf_change! */
    config = {};
    /**
     * Creates new Config Loader
     * @param {string} cfgPath - Path to config File.
     * @param {Logger} log - Logger Object.
     * @param {boolean} liveR - Live Reload Toggle.
     */
    constructor(cfgPath, log, liveR = false)
    {
        this.log = log;
        this.cfgPath = cfgPath;

        this.liveReload = liveR;
    }

    /**
     * Starts the Config Loader
     */
    start()
    {
        let rawF = fs.readFileSync(this.cfgPath).toString();

        let cfg = ottUtil.JSON2OBJ(rawF);
        if(cfg)
        {
            this.log.info(`Succesfully loaded Config '${this.cfgPath}'.`, this.serviceName);
            ottUtil.updateObj(this.config, cfg);
        }
        else
            this.log.error(`Log at '${this.cfgPath}' does not exist or is invalid!`, this.serviceName);
    }
}


/**
 * Default Config (Should Probs Delete Later after Debug)
 * 
 * @export
 * @class def_config
 */
export class def_config  
{
    comment = "Otters Development Config (DO NOT REDISTRIBUTE!)";

    user_security = {
        "sess_key_length": 10,
        "validate_key_length": 64,
        "pass_salts": 11
    };

    cors = {
            "safeOrgins": ["krowdspace.com"]
    };

    dbConf = {
        "host": "0.0.0.0",
        "user": "herp",
        "password": "derp",
        "database": "yomama"
    };

    restConf = {
        "port": 8080,
        "name": "KrowdSpace Server",
        "domain": ""
    }
};