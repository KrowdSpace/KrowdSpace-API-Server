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
            res.end(JSON.stringify({success:false, error: true}));
            return n();
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
            {
                res.end(JSON.stringify({success:false, notnew:true}));
                return n();
            }
            else
                el_template.submit(fname, lname, email, ksuser, iguser, pvalid, (err)=>
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