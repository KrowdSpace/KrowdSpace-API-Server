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
            return this.end(res, n, {success:false, error: true} );
        }

        let veriCode = dataO.VERTIFYCODE;

        let vu_template = this.dbC.templates.get('verify_user');

        vu_template.submit(veriCode, (err)=>
        {
            this.end(res, n, {success: !!err});
        });
    };
};