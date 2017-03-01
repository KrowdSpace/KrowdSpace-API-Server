import {RestURL} from '../ott/ottstify';

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
        
        this.addContactRequest(fname, lname, email, comment, res, n);
    };

    addContactRequest(fname, lname, email, com, res, n)
    {
        let db = this.dbC;

        fname = db.escape(fname);
        lname = db.escape(lname);
        email = db.escape(email).toLowerCase();
        com = db.escape(com);

        let qu = `INSERT INTO contact_us (fname,lname,email,comment) VALUES (${fname}, ${lname}, ${email}, ${com});`;

        db.query(qu, (err, rs, f)=>
        {
            if(err)
                this.log.error(`Error inserting into DB: ${err.stack}`, 'DataBase');
            else
                this.log.info(`Added new Entery to contact_us!`, 'DataBase');

            res.end(JSON.stringify({success: !err}));
            n();
        });
    };
};