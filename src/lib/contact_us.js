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
export const contactUs = {cuURL, postCU};

export class ContactUs
{
    constructor(db)
    {
        this.dbC = db;
    }

    addContactRequest(fname, lname, email, com)
    {
        let db = this.dbC;

        fname = db.escape(fname);
        lname = db.escape(lname);
        email = db.escape(email);
        com = db.escape(com);

        let qu = `INSERT INTO contact_us VALUES (${fname}, ${lname}, ${email}, ${com});`;

        db.query(qu, (er, res, f)=>
        {

        });
    }

    addEmailList(fname, lname, email, ks, ig, pv)
    {

    }

    emailListInfo = {url: elURL, func: postEL}
}