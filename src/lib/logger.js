import fs from 'fs';

import colors from 'colors';

export default class Logger
{
    constructor(logDir, logInConsole = true)
    {
        this.logDir = logDir;
        this.logInConsole = logInConsole;

        this.start();
    }

    get timestamp() { return (new Date).toISOString(); };
    set timestamp(d) { };

    start()
    {
        let d = new Date().toLocaleDateString().replace(/\//g, '-');

        this.logS = fs.createWriteStream(`${this.logDir}/general.${d}.log`, {flags: 'a+'});
        this.errS = fs.createWriteStream(`${this.logDir}/error.${d}.log`, {flags: 'a+'});
        this.wrnS = fs.createWriteStream(`${this.logDir}/warn.${d}.log`, {flags: 'a+'});
        this.infS = fs.createWriteStream(`${this.logDir}/info.${d}.log`, {flags: 'a+'});

        this.info("Logger Online.")
    }
    
    log(log, serv = "Logger", tag = 'General', str = this.logS, altC = null)
    {
        let l = `${this.timestamp} - [${tag}] - [${serv}]: ${log}\r\n`;

        if(this.logInConsole)
            console.log(altC ? l[altC] : l);

        str.write(l);
    };

    error(err, serv)
    {
        this.log(err, serv, 'Error', this.errS, 'red');
    };
    warn(wrn, serv)
    {
        this.log(wrn, serv, 'Warn', this.wrnS, 'yellow');
    };
    info(inf, serv) 
    {
        this.log(inf, serv, 'Info', this.infS, 'cyan');
    }
};