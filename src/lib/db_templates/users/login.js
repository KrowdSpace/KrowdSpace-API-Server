import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { DBTemplate } from '../../ott/ottdb';

export default class LOGTemplate extends DBTemplate
{
    static serviceName = "users_login";

    submit(id, session_id)
    {
        let db = this.db;

        id = db.escape(id);
        session_id = db.escape(session_id);
    }

    check(username, password, cb)
    {
        let db = this.db;

        username = db.escape(username);

        let qu = `SELECT pash_hash,user_data,id from users where username=${username};`;

        db.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error in Login check query: ${err.stack}`, this.serviceName);

            if(!err && res[0])
            {
                let ph = res[0].pass_hash;
                bcrypt.compare(password, ph, (e, s)=>
                {
                    if(s)
                        cb && cb(s, res[0].user_details, id);
                    else
                        cb && cb(false, {}, null);
                });
            }
            else
                cb && cb(false, {});
        });
    }
 }