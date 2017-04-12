import bcrypt from 'bcrypt';
import { DBTemplate } from '../../ott/ottdb';

export default class LOGTemplate extends DBTemplate
{
    static serviceName = "users_login";


    submit(username, session_id, cb)
    {
        let db = this.db;

        username = db.escape(username);
        session_id = db.escape(session_id);

        let qu = `UPDATE users SET session_id=${session_id} where username=${username};`;

        db.query(qu, (err, res, f)=>
        {
            if(err)
            {
                this.log.error(`Error in Login Submit query: ${err.stack}`);
                cb && cb(false);
            }                
            else
                cb && cb(true);
        });
    }

    check(username, password, cb)
    {
        let db = this.db;

        username = db.escape(username);
        password = db.escape(password);

        if(!username || !password)
            return cb && cb(false, {});

        let qu = `SELECT pass_hash,user_data,id from users where username=${username};`;

        db.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error in Login check query: ${err.stack}`, this.serviceName);

            if(res && res[0])
            {
                let ph = res[0].pass_hash;
                bcrypt.compare(password, ph, (e, s)=>
                {
                    if(s)
                        cb && cb(s, res[0].user_details);    
                    else
                        cb && cb(false, {});
                });
            }
            else
                cb && cb(false, {});
        });
    }

    get(sesh_id, cb)
    {
        let db = this.db;

        sesh_id = db.escape(sesh_id);

        let qu = `SELECT username, email, level,
                    user_data->"$.fname" as fname,
		            user_data->"$.lname" as lname,
		            user_data->"$.ksuser" as ksuser,
		            user_data->"$.iguser" as iguser
                    from users where session_id=${sesh_id};`;
        
        db.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error in GET query: ${err.stack}`, this.serviceName);

            if(res && res[0]) 
                cb && cb(res[0]);
            else
                cb && cb(false);
        });
    }
 }