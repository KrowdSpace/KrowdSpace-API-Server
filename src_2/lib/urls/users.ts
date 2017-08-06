import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {RestURL} from '@otter-co/ottlib';

export class LoginURL extends RestURL implements RestURL
{
    public static url = "/v1/login";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    private failObj = {
            success: false, 
            data: {bad_combo: true}
        };

    public async onLoad(rest, data, cooks)
    {
        let failObj = this.failObj;

        let {
            USERNAME: username,
            PASSWORD: password,
            STAYLOGGED: stayLog,
            LOGOUT: logout
        } = data;

        let userG = this.dataG["users_getter"],
            sessG = this.dataG["sessions_getter"];

        if(cooks['ks-session'])
        {
            let loggedInR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);

            if(loggedInR.success && loggedInR.data && loggedInR.data[0])
            {
                if(logout)
                {
                    let sessD = await sessG.rid({username: loggedInR.data[0].username});
                    if(sessD.success)
                    {
                        return this.end(rest, {success: true, data: {logged_out: true}});
                    }
                }
                
                return this.end(rest, {success: true, data: {already_logged_in: true}});                        
            }
        }

        let usrR = await userG.get( { '$or':[ {username}, {email: username.toLowerCase()} ] } ).catch(err=>err);

        if(!usrR.success || !usrR.data || !usrR.data[0])
            return this.end(rest, failObj);
        
        let user = usrR.data[0];
        let storedHash = user.pass_hash;

        let passR = await bcrypt.compare(password, storedHash);

        if(!passR)
            return this.end(rest, failObj);
        
        let sess_id = crypto.randomBytes(this.cfg.user_security.sess_key_length).toString('base64');

        let sessE = await sessG.get({username: user.username}).catch(err=>err);
        let sessR;

        if(sessE.success && sessE.data && sessE.data[0])
            sessR = await sessG.set({ username: user.username }, {$set:{session_id: sess_id}}).catch(err=>err);
        else
            sessR = await sessG.add({ session_id: sess_id, username: user.username, last_ip: '127.0.0.1'}).catch(err=>err);
    
        if(!sessR.success)
            return this.end(rest, failObj);

        let cookieOpts: any = {
            httpOnly: true,
            //path: "/",
            //domain: this.cfg.domain
        };

        if(stayLog)
            cookieOpts.maxAge = 172800;
        
        rest.res.setCookie('ks-session', sess_id, cookieOpts);

        return this.end(rest, {success: true});
    }
}

export class UsersURL extends RestURL implements RestURL 
{
    public static url = '/v1/users/user';
    public static type = 'post';

    public async onLoad(rest, data, cooks)
    {
        let {
            USERID: username,
        } = data;

        let userG = this.dataG['users_getter'],
            sessG = this.dataG['sessions_getter'];

        let searchUser = username;

        if(cooks['ks-session'])
        {
            let loggedInR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);

            if((loggedInR.success && loggedInR.data && loggedInR.data[0]) && !username)
                searchUser = loggedInR.data[0].username;
        }

        if(!searchUser)
            return this.end(rest, {success: false, data: {user_not_found: true}});
        
        let usrR = await userG.get({'$or':[{username: searchUser}, {unique_id: searchUser}]}).catch(err=>err);

        if(!usrR.success || !usrR.data || !usrR.data[0])
            return this.end(rest, {success: false, data: {user_not_found: true}});
        else
        {
            let {
                username,
                email,
                user_data,
                level
            } = usrR.data[0];

            return this.end(rest, {success: true, data: {username, email, user_data, level}});
        }
    }
}

export class SetUserURL extends RestURL implements RestURL 
{
    public static url = "/v1/users/set_user";
    public static type = 'post';
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            DATA: usrDat,
        } = data;

        let sessG = this.dataG['sessions_getter'],
            userG = this.dataG['users_getter'];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let sessR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);

        if((!sessR.success && !sessR.data && !sessR.data[0]))
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let userR = await userG.set(
            {username: sessR.data[0].username},
            {user_data: usrDat},
            ).catch(err=>err);

        if(!userR.success)
            return this.end(rest, {success: false, data: {server_error: true, userR}});
        else
            return this.end(rest, {success: true});
    }
}

export default [
    LoginURL,
    UsersURL,
    SetUserURL,
];