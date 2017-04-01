import {RestURL} from '../../ott/ottstify';

export default class EmailListURL extends RestURL
{
    static type = 'post';
    static url = '/register/email_list';
    static dbPriv = true;

    onLoad(req, res, n)
    {
        let dataO = req.body;

        if(!dataO || typeof dataO === 'string')
        {
            this.log.error('Post Data Incorrectly formed!', this.constructor.url);
            return this.end(res, n, {success:false, error: true} );
        }
        
        let fname = dataO.FNAME,
            lname = dataO.LNAME,
            email = dataO.EMAIL,
            ksuser = dataO.KSUSER || void 0,
            iguser = dataO.IGUSER || void 0,
            pvalid = dataO.PVALID.toUpperCase() === "Y" ? "Y" : "N";

        let el_template = this.dbC.templates.get('email_list');

        el_template.check(email, (exists)=>
        {
            if(exists)
                return this.end(res, n, {success:false, notnew:true} );
            else
                el_template.submit(fname, lname, email, ksuser, iguser, pvalid, (err)=>
                {
                    if(!err)
                        return this.end(res, n, {success:true} );
                });
        });
    };
};