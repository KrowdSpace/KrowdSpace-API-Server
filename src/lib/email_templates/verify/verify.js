import {MailTemplate} from '../../ott/ottmail';

export default class VerifyEMT extends MailTemplate 
{
    serviceName = "email_verify";

    name = "Verify Account";
    from = "no-reply";

    getHTML(details)
    {

    }
    getSubject(details)
    {

    }
}