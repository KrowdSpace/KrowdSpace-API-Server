import {RestURL} from '../../ott/ottstify';

export default class UserURL extends RestURL
{
    static type = 'post';
    static url = '/users/user';
    static dbPriv = true;

    onLoad(req, res, n)
    {
        let dataO = req.body;

        if(!dataO)
        {
            this.log.error('Post Data Incorrectly formed!', this.constructor.url);
            return this.end(res, n, {success:false, error: true} );
        }

        if(!req.cookies['ks-session'] || !this.sessions.checkSession(req.cookies['ks-session']))
            return this.end(res, n, {success: false, notloggedin: true} );

        let userID = dataO.USERID;
        let type = dataO.TYPE;

        switch(type)
        {
            case "GETOWN":
                    this.getOwnUserDetails(req, res, n);
                break;
        }        
    };

    getOwnUserDetails(req, res, n)
    {
        let s = this.sessions.checkSession(req.cookies['ks-session']);

        let ul_template = this.dbC.templates.get('users_login');

        ul_template.get(s.id, (details)=>
        {
            if(!details)
                return this.end(res, n, {success: false, error: true} );
            else
                return this.end(res, n, {success: true, user_details: details} )
        });
    }
};