import {RestURL} from '../../ott/ottstify';

export default class RegisterUserURL extends RestURL
{
    static type = 'post';
    static url = '/register/user';
    static dbPriv = true;

    onLoad(req, res, n)
    {
        let dataO = req.body;

        if(!dataO)
        {
            this.log.error('Post Data Incorrectly formed!', this.constructor.url);
            return this.end(res, n, {success:false, error: true} );
        }

        let username = dataO.USERNAME,
            password = dataO.PASSWORD,
            email = dataO.EMAIL;

        let banNames = this.config.user_register.banned_names;

        if(banNames.indexOf(username) >= 0)
            return this.end(res, n, {success:false, badname:true} );

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