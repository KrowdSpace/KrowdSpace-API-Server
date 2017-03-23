import {RestURL} from '../../ott/ottstify';

export default class ContactUsURL extends RestURL
{
    static type = 'post';
    static url = '/contact_us';
    static dbPriv = true;
    
    onLoad(req, res, n)
    {   
        var fname = req.body.FNAME,
            lname = req.body.LNAME,
            email = req.body.EMAIL,
            comment = req.body.COMMENT;

        let cu_template = this.dbC.templates.get('contact_us');

        cu_template.submit(fname, lname, email, comment, (err)=>
        {
            if(!err)
                res.end(JSON.stringify({success:true}));
            else
                res.send(JSON.stringify({success:false}));
            
            n();
        });
    };
};