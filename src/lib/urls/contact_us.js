import {RestURL} from '../ottstify.js';

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
        email = db.escape(email);
        com = db.escape(com);

        let qu = `INSERT INTO contact_us VALUES (${fname}, ${lname}, ${email}, ${com});`;

        db.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error inserting into DB: ${err.stack}`, 'DataBase');
            else
                this.log.info(`Added new Entery to contact_us!`, 'DataBase');

            res.end(JSON.stringify({success: !!err}));
            n();
        });
    };
};