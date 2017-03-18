import {RestURL} from '../../ott/ottstify';

export default class loginURL extends RestURL
{
    static type = 'post';
    static url = '/users/login';
    static dbPriv = true;

    onLoad(req, res, n)
    {
        let dataO = req.body;

        if(!dataO)
        {
            this.log.error('Post Data Incorrectly formed!', this.constructor.url);
            return n();
        }

        let {
            username: USERNAME,
            password: PASSWORD
            } = dataO;

        let ul_template = this.dbC.getTemplate('users_login');

        ul_template.check(username, password, (authed, uData)=>
        {
            if(!authed)
            {
                res.end(JSON.stringify({success:false, authed:false}));
                return n();
            }

            ul_template.submit()
            
            res.end(JSON.stringify({success: true, user_details: uData}));
            return n();
        });
    };
};