import RestURL from '../ottstify.js';

export default class EmailListURL extends RestURL
{
    constructor(log)
    {
        super('/register/email_list', log);
    }

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