import crypto from 'crypto';
import {RestURL} from '../../ott/ottstify';

export default class loginURL extends RestURL
{
    static type = 'post';
    static url = '/users/login';
    static dbPriv = true;

    J2O(jstr)
    {
        let ret = null;
        try{ret = JSON.parse(jstr);}catch(e){};
        return ret;
    }

    onLoad(req, res, n)
    {
        let dataO = req.body;
        if(typeof dataO === 'string')
            dataO = this.J2O(dataO);

        if(!dataO)
        {
            this.log.error('Post Data Incorrectly formed!', this.constructor.url);
            return n();
        }

        let { USERNAME: username, PASSWORD: password, STAYLOGGED: stayLog } = dataO;

        let ul_template = this.dbC.getTemplate('users_login');

        ul_template.check(username, password, (authed, uData)=>
        {
            if(!authed)
            {
                res.end(JSON.stringify({success:false, authed:false}));
                return n();
            }  

            let sesh_id = crypto.randomBytes(64).toString('base64');

            ul_template.submit(username, sesh_id, (ok)=>
            {
                if(!ok)
                {
                    res.end(JSON.stringify({success: false, error: true}));
                    return n();
                }

                var cookieOpts = {
                    httpOnly: true,
                    domain: this.domain,
                    path: '/'
                };

                if(stayLog) 
                    cookieOpts.maxAge = 

                res.setCookie('ks-session', sesh_id, cookieOpts);

                res.end(JSON.stringify({success: true, user_details: true}));
                return n();
            });
        });
    };
};