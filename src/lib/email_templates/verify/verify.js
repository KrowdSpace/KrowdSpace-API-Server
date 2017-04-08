import {MailTemplate} from '../../ott/ottmail';

export default class VerifyEMT extends MailTemplate 
{
    name = "Verify Account";
    from = "no-reply";

    getHTML(details)
    {

    }
    getSubject(details)
    {
        
    }
}