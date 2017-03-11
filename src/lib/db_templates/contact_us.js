import {DBTemplate} from '../ott/ottdb';

export default class CUTemplate extends DBTemplate
{
    static serviceName = "contact_us";

    submit(fname, lname, email, comment, cb)
    {
        let db = this.db;

        fname = db.escape(fname);
        lname = db.escape(lname);
        email = db.escape(email);
        comment = db.escape(comment);

        let qu = `INSERT INTO contact_us (fname,lname,email,comment) VALUES (${fname}, ${lname}, ${email}, ${comment});`;

        db.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error in Contact Us SUBMIT query: ${err.stack}`, this.serviceName);
            else
                this.log.info(`Added new Contact Request!`, this.serviceName);
            
            if(cb)
                cb(!!err);
        });
    }
}