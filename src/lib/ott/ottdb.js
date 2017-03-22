/* 
 * OttDB.js
 * (C) Ben Otter (Benjamin McLean), 2017
 */
import mysql from 'mysql';
import Logger from './ottlogger';

/** Otter's DataBase Abstraction Class */
export default class DataBase
{
    serviceName = "DataBase";
    /** @type {Map.<string, DBTemplate>} */
    templates = new Map();

    /**
     * Creates New Ott DataBase Abstractor
     * @param {Object} dbConf Database Config
     * @param {Logger} log Logger Object
     */
    constructor(dbConf, log)
    {
        this.log = log;
        this.dbC = mysql.createConnection(dbConf);
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
            let template = new temp(this.dbC, this.log);

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
     * @param {DataBase} db 
     * @param {Logger} log 
     */
    constructor(db, log)
    {
        this.log = log;
        this.db = db;

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
}