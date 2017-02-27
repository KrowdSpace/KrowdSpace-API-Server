import fs from 'fs';

export default class Logger
{
    constructor(logDir, logInConsole = true)
    {
        this.logDir = logDir;
        this.logInConsole = logInConsole;
    }

    get timestamp() { return (new Date).toISOString(); };
    set timestamp(d) { };

    start()
    {
        this.logS = fs.createWriteStream(`${this.logDir}/general.log`, {flags: 'a+'});
        this.errS = fs.createWriteStream(`${this.logDir}/error.log`, {flags: 'a+'});
        this.wrnS = fs.createWriteStream(`${this.logDir}/warn.log`, {flags: 'a+'});
        this.infS = fs.createWriteStream(`${this.logDir}/info.log`, {flags: 'a+'});

        this.info("Logger Startup.")
    }

    log(log, serv = "Logger", tag = 'Log', str = this.logS)
    {
        let l = `${this.timestamp} - [${tag}] - ${serv}: ${log}\r\n`;

        if(this.logInConsole)
            console.log(l);

        str.write(l);
    };

    error(err, serv)
    {
        this.log(err, serv, 'Error', this.errS);
    };
    warn(wrn, serv)
    {
        this.log(wrn, serv, 'Warn', this.wrnS);
    };
    info(inf, serv) 
    {
        this.log(inf, serv, 'Info', this.infS);
    }
};