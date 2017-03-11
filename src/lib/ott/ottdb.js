/* 
 * OttDB.js
 * (C) Ben Otter (Benjamin McLean), 2017
 */

import mysql from 'mysql';

export default class DataBase
{
    serviceName = "DataBase";

    templates = new Map();

    constructor(dbConf, log)
    {
        this.log = log;
        this.dbC = mysql.createConnection(dbConf);
    }

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

    addTemplate(temp)
    {
        if(!this.templates.has(temp.serviceName))
        {
            var template = new temp(this.dbC, this.log);

            this.templates.set(temp.serviceName, template);
        }
    }

    removeTemplate(name)
    {
        this.templates.delete(name);
    }
}

export class DBTemplate
{
    static serviceName = "BaseTemplate_DB";

    constructor(db, log)
    {
        this.log = log;
        this.db = db;

        this.serviceName = this.constructor.serviceName;
    }

    submit(data, cb)
    {
        
    }
    check(data, cb)
    {

    }
    get(data, cb)
    {

    }
}