import {RestURL} from '../ott/ottstify';
import crypto from 'crypto';

export default class EmailListURL extends RestURL
{
    static type = 'post';
    static url = '/register/email_list';
    static dbPriv = true;

    onLoad(req, res, n)
    {
        let dataO = req.body;

        if(!dataO)
        {
            this.log.error('Post Data Incorrectly formed!', "REGISTER/EMAIL_LIST");
            return next();
        }

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

        let qu = `SELECT EXISTS (SELECT 1 FROM email_list WHERE email=${email} AND verified='Y') AS notnew;`;

        db.query(qu, (err, rs, f)=>
        {
            if(err) 
                this.log.error(`DB Error: ${err.code}`, "DataBase");

            if(rs[0].notnew == 1)
            {
                res.end(JSON.stringify({success:false, notnew: true}));
                return n();
            }

            let vcode = db.escape(crypto.randomBytes(64).toString('base64'));

            let qu = `INSERT INTO email_list (fname,lname,email,ksuser,iguser,pvalid,verify_code) 
                          VALUES (${fname},${lname},${email},${ksuser},${iguser},${pvalid},${vcode});`;

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
        });
    };
};