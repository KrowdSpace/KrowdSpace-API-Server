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
            return this.end(res, n, {success:false, error: true} );
        }

        let ul_template = this.dbC.getTemplate('users_login');

        if(dataO.CHECK && req.cookies['ks-session'])
            ul_template.get(req.cookies['ks-session'], (res)=>
            {
                if(res)
                    this.end(res, n, {success:true} );
                else
                    this.login(req, res, n, dataO);
            });
        else
            this.login(req, res, n, dataO);
    };

    login(req, res, n, dataO)
    {
        let { USERNAME: username, PASSWORD: password, STAYLOGGED: stayLog } = dataO;

        let ul_template = this.dbC.getTemplate('users_login');

        ul_template.check(username, password, (authed, uData)=>
        {
            if(!authed)
                return this.end(res, n, {success:false, authed:false} );
            
            let byC = this.config.user_security.sess_key_length;
            let sesh_id = crypto.randomBytes(byC).toString('base64');

            ul_template.submit(username, sesh_id, (ok)=>
            {
                if(!ok)
                    return this.end(res, n, {success: false, error: false} );

                var cookieOpts = {
                    httpOnly: true,
                    domain: this.domain,
                    path: '/'
                };

                //hardcoded for test only
                if(stayLog) 
                    cookieOpts.maxAge = 172800;

                res.setCookie('ks-session', sesh_id, cookieOpts);
                
                return this.end(res, n, {success: true} );
            });
        });
    }
};