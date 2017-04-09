import {RestURL} from '../../ott/ottstify';

export default class RegisterUserURL extends RestURL
{
    static type = 'post';
    static url = '/register/user';
    static dbPriv = true;
    static emPrive = true;

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
            email = dataO.EMAIL,
            fname = dataO.FNAME,
            lname = dataO.LNAME,
            ksuser = dataO.KS_USER,
            iguser = dataO.IG_USER;

        let details = {
            fname,
            lname,
            ksuser,
            iguser
        };

        let banNames = this.config.user_register.banned_names;

        if(banNames.indexOf(username) >= 0)
            return this.end(res, n, {success:false, badname:true} );

        let ru_template = this.dbC.getTemplate('register_user');

        ru_template.check(username, email, (exists)=>
        {
            if(exists)
                return this.end(res, n, {success:false, notnew:true} );
            else
                ru_template.submit(username, email, password, details, (err, verify_code)=>
                {
                    if(!err)
                    {
                        let m = this.mailer.getTemplate('email_verify');

                        m.sendMail(email, {
                            fname,
                            lname,
                            verify_code
                        }, (res)=>
                        {

                        });

                        return this.end(res, n, {success:true} );
                    }
                });
        });
    };
};