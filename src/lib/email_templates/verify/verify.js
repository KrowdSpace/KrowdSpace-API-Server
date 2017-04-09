import {MailTemplate} from '../../ott/ottmail';

export default class VerifyEMT extends MailTemplate 
{
    static serviceName = "email_verify";
    serviceName = "email_verify";

    name = "Verify Account";
    from = "no-reply";

    getHTML(d)
    {
        return `Heya ${d.fname}, this is a test!
                Your Code is:- ${d.verify_code} -!
                Thanks for testing!
                -PostMaster`;
    }
    getSubject(d)
    {
        return `Heya ${d.fname} ${d.lname}!`;
    }
}