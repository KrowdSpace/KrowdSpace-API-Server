import {MailTemplate} from '../../ott/ottmail';

export default class VerifyEMT extends MailTemplate 
{
    static serviceName = "email_verify";
    serviceName = "email_verify";

    name = "Verify Account";
    from = "no-reply";

    getHTML(d)
    {
        return `<!doctype html>
                <html xmlns="http://www.w3.org/1999/xhtml"
                    xmlns:v="urn:schemas-microsoft-com:vml"
                    xmlns:o="urn:schemas-microsoft-com:office:office">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Test!</title>
                    </head>
                    <body>
                        <table border="0" cellpadding="0" cellspacing="0" width="700px">
                            <tr>
                                <th style="background-color: #fed136; color: #fff; padding: 8px; text-align: center; font-size: 18px; font-family: Arial; ">CONFIRM KROWDSPACE ACCOUNT</th>
                            </tr>
                            <tr>
                                <td style="font-size: 14px; font-family: Arial;">
                                    <p style="margin: 30px 5px 0px 5px;">Hi ${d.fname},</p>
                                    <p style="margin: 20px 5px;">This message is to confirm that the Krowdspace account with
                                        the username ${d.username} belongs to you. Verifying your email address will provide access to our Krowdspace Dashboard.</p>
                                    <p style="text-align: center; margin: 40px 5px 0px 5px;">Please
                                        confirm your Krowdspace account by clicking the button below:</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 14px; font-family: Arial; text-align: center;">
                                    <strong><a href="https://www.krowdspace.com/account/verify.html?$verify_code=${d.verify_code}" style="background-color: #fed136; color: #fff; padding: 12px; display:inline-table; border-radius: 5px; margin: 25px 0px 15px 0px;
                                        text-decoration: none;">CONFIRM ACCOUNT</a></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 14px; font-family: Arial; text-align: center;">
                                    <p>Thank you from the Krowdspace Team!</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>`;
    }
    getSubject(d)
    {
        return "Welcome to KrowdSpace! Please confirm your account!";
    }
}