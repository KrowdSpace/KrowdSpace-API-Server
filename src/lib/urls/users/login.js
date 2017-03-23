import crypto from 'crypto';
import {RestURL} from '../../ott/ottstify';
import * as ottUtil from '../../ott/ottutil';

export default class loginURL extends RestURL
{
    static type = 'post';
    static url = '/users/login';
    static dbPriv = true;

    onLoad(req, res, n)
    {
        let dataO = req.body;

        if(!dataO || typeof dataO === 'string')
        {
            this.log.error('Post Data Incorrectly formed!', this.constructor.url);
            res.end(JSON.stringify({success:false, error: true}));
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

            
            let byC = this.config.user_security.sess_key_length;

            let sesh_id = crypto.randomBytes(byC).toString('base64');

            ul_template.submit(username, sesh_id, (ok)=>
            {
                if(!ok)
                {
                    res.end(JSON.stringify({success: false, error: false}));
                    return n();
                }

                var cookieOpts = {
                    httpOnly: true,
                    domain: this.domain,
                    path: '/'
                };

                //hardcoded for test only
                if(stayLog) cookieOpts.maxAge = 172800;

                res.setCookie('ks-session', sesh_id, cookieOpts);

                res.end(JSON.stringify({success: true}));
                return n();
            });
        });
    };
};