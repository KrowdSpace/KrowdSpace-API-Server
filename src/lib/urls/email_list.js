import {RestURL} from '../ottstify.js';

export default class EmailListURL extends RestURL
{
    static type = 'post';
    static url = '/register/email_list';
    static dbPriv = true;

    onLoad(req, res, n)
    {
        let dataO = req.body;

        let fname = dataO.FNAME,
            lname = dataO.LNAME,
            email = dataO.EMAIL,
            ksuser = dataO.KSUSER || void 0,
            iguser = dataO.IGUSER || void 0,
            pvalid = dataO.PVALID.toUpperCase() === "Y" ? "Y" : "N";

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
                    {
                        let ls = `${fname}:${lname}:${email}:${ksuser}:${iguser}:${pvalid}`;
                        this.log.error(`Error inserting into DB with data: \r\n ${ls} \r\n ${err.stack}`, 'DataBase');
                    }
                    else
                        this.log.info(`Added new Entery to Email List!`, 'DataBase');

                    res.end(JSON.stringify({success:!err}));
                    n();
                });
            }
            else
            {
                res.end(JSON.stringify({success:false, notnew: true}));
                n();
            }
        });
    };
};