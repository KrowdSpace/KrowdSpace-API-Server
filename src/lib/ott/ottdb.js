/* 
 * OttDB.js
 * (C) Ben Otter (Benjamin McLean), 2017
 */
import mysql from 'mysql';
import Logger from './ottlogger';
import {def_config} from './ottconf';

/** Otter's DataBase Abstraction Class */
export default class DataBase
{
    serviceName = "DataBase";
    /** @type {Map.<string, DBTemplate>} */
    templates = new Map();

    /**
     * Creates New Ott DataBase Abstractor
     * @param {def_config} cfg Config Object
     * @param {Logger} log Logger Object
     */
    constructor(cfg, log)
    {
        this.config = cfg;

        this.log = log;
        this.dbC = mysql.createConnection(cfg.dbConf || cfg);
    }
    /** Starts the DataBase Connection */
    start()
    {
        this.dbC.connect((err)=>
        {
            if(err)
                this.log.error(`Cannot Connect to DB: ${err.stack}`, this.serviceName);
            else
                this.log.info("Successfuly Connected to DataBase!", this.serviceName);
        });
    }
    /**
     * Add DBTemplate to DB Object
     * @param {DBTemplate} temp template class object
     */
    addTemplate(temp)
    {
        if(!this.templates.has(temp.serviceName))
        {
            let template = new temp(this, this.dbC, this.log, this.config);

            this.templates.set(temp.serviceName, template);
        }
    }
    /**
     * Remove Template, by name defined in Template.
     * @param {string} name Name of the Template
     */
    removeTemplate(name)
    {
        this.templates.delete(name);
    }
    /**
     * Retreive a template instance from the DB.
     * @param {string} name name of the Template
     * @returns {DBTemplate} 
     */
    getTemplate(name)
    {
        return this.templates.get(name);
    }

    updateCon()
    {
        let newCon = mysql.createConnection(this.cfg.dbConf || this.cfg);

        for(let temp of this.templates)
            temp[1].db = newCon;
        
        this.dbC = newCon;

        this.start();
    }
}

/**
 * Otts DataBase Template for DataBase Handler!
 */
export class DBTemplate
{
    /** @type {string} serviceName Name of the service */
    static serviceName = "BaseTemplate_DB";

    /**
     * Creates New DataBase Template Object
     * @param {DataBase} db - DataBase Object
     * @param {Logger} log - Logger Object.
     * @param {def_config} cfg - Config Object.
     */
    constructor(par, db, log, cfg)
    {
        this.parent = par;
        this.log = log;
        this.db = db;
        this.config = cfg;
    
        this.serviceName = this.constructor.serviceName;
    }
    /**
     * Submit Data To Template
     * @param {*} data 
     * @param {Function} cb 
     */
    submit(data, cb) {}
    /**
     * Check Data Against Template
     * @param {*} data 
     * @param {Function} cb 
     */
    check(data, cb) {}
    /**
     * Get Data From Template
     * @param {*} data 
     * @param {Function} cb 
     */
    get(data, cb) {}

    query(qu, cb)
    {
        this.db.query(qu, (err, res, f)=>
        {
            if(err && err.fatal)
                this.parent.updateCon();
            
            cb(err, res, f);
        });
    }
}