import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {RestURL, safeJSON} from '@otter-co/ottlib';

export class ContactUsURL extends RestURL implements RestURL
{
    public static url = "/register/contact_us";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {FNAME: fname, LNAME: lname, EMAIL: email, COMMENT: comment} = data;

        let cuG = this.dataG['contact_us_getter'];

        try
        {
            let cuR = await cuG.add( {fname, lname, email, comment} );
            this.end(rest, {success: true});
        }
        catch (err)
        {
            this.end(rest, {success: false});
        }
    }
}

export class RegisterUserURL extends RestURL implements RestURL 
{
    public static url = "/register/user";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            USERNAME: username, 
            EMAIL: email, 
            PASSWORD: password,

            FNAME: fname,
            LNAME: lname,
            KSUSER: ksuser,
            IGUSER: iguser,
        } = data;

        let user_data = JSON.stringify({fname, lname, ksuser, iguser});

        let userG = this.dataG['users_getter'];

        let byC = (this.cfg.user_security && this.cfg.user_security.validate_key_length) || 64;
        let salts = (this.cfg.user_security && this.cfg.user_security.pass_salts) || 11;
        
        let verify_code = crypto.randomBytes(byC).toString('base64');

        let bcrpP = bcrypt.hash(password, salts).catch(err=>err),
            usrChkP = userG.get({username, email}).catch(err=>err);

        let pass_hash = await bcrpP;
        let userExists = await usrChkP;

        let resp: string | any;

        if(userExists.data && !userExists.data[0] && pass_hash)
        {
            resp = "Error Adding user to DB";
            let usrAddP = userG.add({username, email, pass_hash, user_data, verify_code}).catch(err=>err);
            let usrAddR = await usrAddP;

            if(usrAddR)
                this.end(rest, {success: true});
            
        } else if(userExists.data[0])
            resp = {notnew: true};
        else if(!pass_hash)
             resp = "Password save error";
        else
            resp = "Unkown error";

        this.end(rest, {success: false, data: resp});
    }
}

export default [
    ContactUsURL,
    RegisterUserURL
];