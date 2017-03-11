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
            this.log.error('Post Data Incorrectly formed!', "REGISTER/EMAIL_LIST");
            return n();
        }

        let username = dataO.username,
            password = dataO.password,
            email = dataO.email;

        let ru_template = this.dbC.templates.get('register_user');

        ru_template.check(username, email, (exists)=>
        {
            if(exists)
            {
                res.end(JSON.stringify({success:false, notnew:true}));
                return n();
            }
            else
                ru_template.submit(username, email, password, (err)=>
                {
                    if(!err)
                    {
                        res.end(JSON.stringify({success:true}));
                        return n();
                    }
                });
        });
    };
};