/**
 * OttMail.js
 * Otter's E-Mail Abstractor!
 * (C) Ben Otter (Benjamin McLean), 2017
 */
import sendMail from 'sendmail';

export default class EMailer 
{
    serviceName = "EMailer"
    
    constructor(cfg, log)
    {
        this.config = cfg;
        this.log = log;

        this.domain = cfg.domain;

        let mailCfg = {
            logger: {
                info: (log)=>{ this.log.info(log, this.serviceName); },
                warn: (log)=>{ this.log.warn(log, this.serviceName); },
                error: (log)=>{ this.log.error(log, this.serviceName); },
            }
        };

        this.mailer = sendMail(mailCfg);
    }

    sendMail(mail, cb)
    {
        this.mailer(mail, cb);
    }
}

export class MailTemplate 
{
    name = "Default";
    from = "default";

    getHTML(details)
    {
        return "Default Body Contents!";
    }

    getSubject(details)
    {
        return "Default Subject!";
    }

    constructor(cfg, log, mailer)
    {
        this.config = cfg;
        this.log = log;
        this.mailer = mailer;
    }

    sendMail(to, details, cb)
    {
        let dm = this.config.domain;
        let mail = {
            from: `${this.from}@${dm} (${this.name})`,
            to,
            subject: this.getSubject(details),
            html: this.getHTML(details)
        };

        this.mailer.sendMail(mail, (err, reply)=>
        {
            if(err)
                this.log.error(`Error in email: ${err.stack}`, this.name);
                
            cb && cb(err, reply);
        });
    }
}