import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {RestURL} from '@otter-co/ottlib';

export class LoginURL extends RestURL implements RestURL
{
    public static url = "/users/login";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    private failObj = {
            success: false, 
            data:"Password / Username Combo Not Found"
        };

    public async onLoad(rest, data, cooks)
    {
        let failObj = this.failObj;

        let {
            USERNAME: username,
            PASSWORD: password,
            STAYLOGGED: stayLog
        } = data;

        let userG = this.dataG["users_getter"],
            sessG = this.dataG["sessions_getter"];

        if(cooks['ks-session'])
        {
            let loggedInR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);
            if(loggedInR.success)
                return this.end(rest, {success: true, data: {already_logged_in: true}});
        }

        let usrR = await userG.get({username, email: username}).catch(err=>err);

        if(!usrR.success)
            return this.end(rest, failObj);
    
        let storedHash = usrR.res[0].pass_hash;

        let passR = await bcrypt.compare(password, storedHash);

        if(!passR)
            return this.end(rest, failObj);

        let sess_id = crypto.randomBytes(this.cfg.user_security.sess_key_length);

        let sessR = await sessG.add({
                session_id: sess_id, 
                username, 
                last_ip: '127.0.0.1'
            }).catch(err=>err);

        if(!sessR.success)
            return this.end(rest, failObj);

        let cookieOpts = {
            httpOnly: true,
            domain: this.cfg.domain,
            path: '/',
            maxAge: undefined
        };

        if(stayLog)
            cookieOpts.maxAge = 172800;
        
        rest.res.setCookie('ks-session', sess_id);

        return this.end(rest, {success: true});
    }
}

export default [
    LoginURL
];