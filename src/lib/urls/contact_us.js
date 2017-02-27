import RestURL from '../ottstify.js';

export default class ContactUsURL extends RestURL
{
    constructor(log, db)
    {
        super('/contact_us', log);
        this.dbC = db;
    };

    onLoad(req, res, n)
    {
        var fname = req.body.fname,
            lname = req.body.lname,
            email = req.body.email,
            comment = req.body.comment;

        n();
    };

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
    };
};