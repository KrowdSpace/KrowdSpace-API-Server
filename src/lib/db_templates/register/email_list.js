import crypto from 'crypto';
import {DBTemplate} from '../../ott/ottdb';

export default class ELTemplate extends DBTemplate
{
    static serviceName = "email_list";

    submit(fname, lname, email, ksuser, iguser, pvalid, cb)
    {
        let db = this.db;

        fname = db.escape(fname);
        lname = db.escape(lname);
        email = db.escape(email);
        ksuser = db.escape(ksuser);
        iguser = db.escape(iguser);
        pvalid = db.escape(pvalid);

        let vcode = db.escape(crypto.randomBytes(64).toString('base64'));

        let qu = `INSERT INTO email_list (fname,lname,email,ksuser,iguser,pvalid,verify_code) 
                          VALUES (${fname},${lname},${email},${ksuser},${iguser},${pvalid},${vcode});`;

        this.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error in Email_List SUBMIT query: ${err.stack}`, this.serviceName);
            else
                this.log.info(`Added new Entery to Email List!`, this.serviceName);
            
            if(cb)
                cb(!!err);
        });
    }

    check(email, cb)
    {
        let db = this.db;

        email = db.escape(email);

        let qu = `SELECT EXISTS (SELECT 1 FROM email_list WHERE email=${email} AND verified='Y') as notnew;`;

        this.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error in Email_List CHECK query: ${err.stack}`, this.serviceName);

            if(cb)
                cb(res && res[0] && res[0].notnew === 1);
        });
    }
}