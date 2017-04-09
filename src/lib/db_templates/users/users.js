import crypto from 'crypto';
import bcrypt from 'bcrypt';

import {DBTemplate} from '../../ott/ottdb';

export default class UDTemplate extends DBTemplate
{
    static serviceName = "user_details";

    submit(sesh_id, cb)
    {
        let db = this.db;

        sesh_id = db.escape(sesh_id);

        let qu = `SELECT username,email,level,user_data from users where session_id=${sesh_id}`;

        db.query(qu, (err, res, f)=>
        {
            
        }); 
    }

    check(username, email, cb)
    {
        let db = this.db;

        username = db.escape(username);
        email = db.escape(email);

        let qu = `SELECT EXISTS (SELECT 1 FROM users WHERE username=${username} and email=${email}) as notnew;`;

        db.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error in checking registered CHECK`, this.serviceName);

            if(cb)
                cb(res && res[0] && res[0].notnew === 1);
        });
    }
}