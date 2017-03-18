/*
 * OttLogger.js
 * (C) Ben Otter (Benjamin McLean), 2017
 */
import fs from 'fs';
import colors from 'colors';

/** Otts Logger Class */
export default class Logger
{
    /**
     * Creates a new Ott Logger
     * @constructor
     * @typedef { {} } Logger
     * @param {string} logDir Directory for log files
     * @param {boolean} logInConsole If logger should log to console or not.
     */
    constructor(logDir, logInConsole = true)
    {
        this.logDir = logDir;
        this.logInConsole = logInConsole;

        this.start();
    }
    /**
     * Get current timestamp;
     * @returns {string}
     */
    get timestamp() { return (new Date).toISOString(); };
    set timestamp(d) { };
    /** Starts the Logger */
    start()
    {
        let d = new Date().toLocaleDateString().replace(/\//g, '-');

        if(!fs.existsSync(this.logDir))
            fs.mkdirSync(this.logDir);

        this.logS = fs.createWriteStream(`${this.logDir}/general.${d}.log`, {flags: 'a+'});
        this.errS = fs.createWriteStream(`${this.logDir}/error.${d}.log`, {flags: 'a+'});
        this.wrnS = fs.createWriteStream(`${this.logDir}/warn.${d}.log`, {flags: 'a+'});
        this.infS = fs.createWriteStream(`${this.logDir}/info.${d}.log`, {flags: 'a+'});

        this.info("Logger Online.")
    }
    /**
     * @param {string} err Message for Log.
     * @param {string} serv Name of Service Logging.
     */
    log(log, serv = "Logger", tag = 'General', str = this.logS, altC = null)
    {
        let l = `${this.timestamp} - [${tag}] - [${serv}]: ${log}\r\n`;

        if(this.logInConsole)
            console.log(altC ? l[altC] : l);

        str.write(l);
    };
    /**
     * @param {string} err Message for Error Log.
     * @param {string} serv Name of Service Logging.
     */
    error(err, serv)
    {
        this.log(err, serv, 'Error', this.errS, 'red');
    };
    /**
     * @param {string} wrn Message for Warn Log.
     * @param {string} serv Name of Service Logging.
     */
    warn(wrn, serv)
    {
        this.log(wrn, serv, 'Warn', this.wrnS, 'yellow');
    };
    /**
     * @param {string} inf Message for Info Log.
     * @param {string} serv Name of Service Logging.
     */
    info(inf, serv) 
    {
        this.log(inf, serv, 'Info', this.infS, 'cyan');
    }
};