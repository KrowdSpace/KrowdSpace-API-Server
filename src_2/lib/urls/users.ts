import * as bcrypt from 'bcrypt';
import {RestURL} from '@otter-co/ottlib';

export class LoginURL extends RestURL implements RestURL
{
    public static url = "/users/login";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            USERNAME: username,
            PASSWORD: password,
            STAYLOGGED: stayLog
        } = data;

        let failObj = {
            success: false, 
            data:"Password / Username Combo Not Found"
        };

        let userG = this.dataG["users_getter"];

        let usrR = await userG.get({username, email: username}).catch(err=>err);

        if(!usrR.success)
            return this.end(rest, failObj);
    
        let storedHash = usrR.res[0].pass_hash;

        let pasR = await bcrypt.compare(password, storedHash);

        if(!pasR)
            return this.end(rest, failObj);

        let cookieOpts = {
            httpOnly: true,
            domain: this.cfg.domain,
            path: '/',
            maxAge: undefined
        };

        if(stayLog)
            cookieOpts.maxAge = 172800;
        
        rest.res.setCookie('ks-session', )

        return this.end(rest, {success: true});
    }
}

export default [
    LoginURL
];