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

        let userID = dataO.USERID;

        let ru_template = this.dbC.templates.get('register_user');

        ru_template.check(username, email, (exists)=>
        {
            if(exists)
                return this.end(res, n, {success:false, notnew:true} );
            else
                ru_template.submit(username, email, password, (err)=>
                {
                    if(!err)
                        return this.end(res, n, {success:true} );
                });
        });
    };
};