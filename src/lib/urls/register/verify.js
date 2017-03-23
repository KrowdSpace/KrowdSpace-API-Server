import {RestURL} from '../../ott/ottstify';

export default class VerifyURL extends RestURL
{
    static type = 'post';
    static url = '/register/verify';
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

        let veriCode = dataO.verify_code;

        let vu_template = this.dbC.templates.get('verify_user');

        vu_template.submit(veriCode, (err)=>
        {
            if(!err)
                res.end(JSON.stringify({success:true}));
            else
                res.send(JSON.stringify({success:false}));
            
            n();
        });
    };
};