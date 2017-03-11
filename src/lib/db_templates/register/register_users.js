import crypto from 'crypto';
import bcrypt from 'bcrypt';

import {DBTemplate} from '../../ott/ottdb';

export default class RUTemplate extends DBTemplate
{
    static serviceName = "register_user";

    submit(username, email, password, cb)
    {
        let db = this.db;

        username = db.escape(username);
        email = db.escape(email);
        password = db.escape(password);

        let vcode = db.escape(crypto.randomBytes(64).toString('base64'));

        let salts = 11;
        
        bcrypt.hash(password, salts, (err, hash)=>
        {
            if(err)
            {
                this.log.error('Error Crypting Password!', this.serviceName);

                if(cb)
                    cb(false);
            }
                
            let pass_hash = db.escape(hash);

            let qu = `INSERT INTO users (username,pass_hash,email,validation_code) 
                             VALUES (${username}, ${pass_hash}, ${email}, ${vcode});`;

            db.query(qu, (err, res, f)=>
            {
                if(err)
                    this.log.error(`Error in Register User SUBMIT query: ${err.stack}`, this.serviceName);
                else
                    this.log.info(`Added new User!`, this.serviceName);
                
                if(cb)
                    cb(!!err);
            });
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