const elURL = "/register/email_list";
function postEL(req, res, n)
{
    var fname = req.body.FNAME,
        lname = req.body.LNAME,
        email = req.body.email,
        ksuser = req.body.ksuser,
        iguser = req.body.iguser,
        pvalid = req.body.pvalid;
}

const cuURL = "/contact_us";
function postCU(req, res, n)
{
    var fname = req.body.fname,
        lname = req.body.lname,
        email = req.body.email,
        comment = req.body.comment;

    
    
}

export const emailList = {elURL, postEL};
export const contactUs = {cuURL, postContUS};