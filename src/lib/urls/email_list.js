import {RestURL} from '../ottstify.js';

export default class EmailListURL extends RestURL
{
    static type = 'post';
    static url = '/register/email_list';
    static dbPriv = true;

    onLoad(req, res, n)
    {
        var fname = req.body.FNAME,
            lname = req.body.LNAME,
            email = req.body.EMAIL,
            ksuser = req.body.KSUSER,
            iguser = req.body.IGUSER,
            pvalid = req.body.PVALID;

        n();
    }
}