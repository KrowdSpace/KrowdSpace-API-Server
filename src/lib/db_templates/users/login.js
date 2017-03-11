import bcrypt from 'bcrypt';
import {DBTemplate} from '../ott/ottdb';

export default class LOGTemplate extends DBTemplate
{
    static serviceName = "user_login";

    submit(username, password, cb)
    {
        let db = this.db;

        username = db.escape(username);
        password = db.escape(password);

        let qu = `SELECT EXISTS (SELECT 1 FROM email_list WHERE username=${username} AND pass_hash=${}) as notnew;`;

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

    check(username, cb)
    {
        
    }
 }