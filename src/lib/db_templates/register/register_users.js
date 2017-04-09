import crypto from 'crypto';
import bcrypt from 'bcrypt';

import {DBTemplate} from '../../ott/ottdb';

export default class RUTemplate extends DBTemplate
{
    static serviceName = "register_user";

    submit(username, email, password, details, cb)
    {
        let db = this.db;

        username = db.escape(username);
        email = db.escape(email);
        password = db.escape(password);

        details = db.escape(JSON.stringify(details));

        //pulls byte count from config
        let byC = this.config.user_security.validate_key_length;

        let vcode = db.escape(crypto.randomBytes(byC).toString('base64'));

        let salts = this.config.user_security.pass_salts;
        
        bcrypt.hash(password, salts, (err, hash)=>
        {
            if(err)
            {
                this.log.error('Error Crypting Password!', this.serviceName);

                if(cb)
                    cb(false);
            }
                
            let pass_hash = db.escape(hash);

            let qu = `INSERT INTO users (username,pass_hash,email,verify_code,user_data) 
                             VALUES (${username}, ${pass_hash}, ${email}, ${vcode}, ${details});`;

            db.query(qu, (err, res, f)=>
            {
                if(err)
                    this.log.error(`Error in Register User SUBMIT query: ${err.stack}`, this.serviceName);
                else
                    this.log.info(`Added new User!`, this.serviceName);
                
                if(cb)
                    cb(!!err, vcode);
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