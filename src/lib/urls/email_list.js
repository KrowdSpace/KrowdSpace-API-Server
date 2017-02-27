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

        this.addEmailList(fname, lname, email, ksuser, iguser, pvalid, res, n);
    };

    addEmailList(fname, lname, email, ksuser, iguser, pvalid, res, n)
    {
        let db = this.dbC;

        fname = db.escape(fname);
        lname = db.escape(lname);
        email = db.escape(email).toLowerCase();
        ksuser = db.escape(ksuser).toLowerCase();
        iguser = db.escape(iguser).toLowerCase();
        pvalid = db.escape(pvalid);

        let qu = `SELECT EXISTS (
                    SELECT 1 FROM email_list WHERE 
                        email=${email} OR 
                        ksuser=${ksuser} OR 
                        iguser=${iguser}
        ) AS notnew;`;

        db.query(qu, (err, rs, f)=>
        {
            console.log(err);
            console.log(rs);
            console.log(f);

            if(rs[0].notnew == 0)
            {
                let qu = `INSERT INTO email_list (fname,lname,email,ksuser,iguser,pvalid) VALUES (
                    ${fname},
                    ${lname},
                    ${email},
                    ${ksuser},
                    ${iguser},
                    ${pvalid});`;

                db.query(qu, (err, rs, f)=>
                {
                    if(err)
                        this.log.error(`Error inserting into DB: ${err.stack}`, 'DataBase');
                    else
                        this.log.info(`Added new Entery to Email List!`, 'DataBase');

                    res.end(JSON.stringify({success:!err}));
                    n();
                });
            }
            else
            {
                res.end(JSON.stringify({success:false, notnew: 1}));
                n();
            }
        });
    };
};