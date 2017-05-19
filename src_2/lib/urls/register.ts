import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {RestURL} from '@otter-co/ottlib';

export class ContactUsURL extends RestURL implements RestURL
{
    public static url = "/register/contact_us";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {FNAME: fname, LNAME: lname, EMAIL: email, COMMENT: comment} = data;

        let cuG = this.dataG['contact_us_getter'];

        let cuR = await cuG.add( {fname, lname, email, comment} ).catch(err=>err);
        this.end(rest, {success: cuR.success});
    }
}

export class EmailListURL extends RestURL implements RestURL
{
    public static url = "/register/email_list";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            FNAME: fname,
            LNAME: lname,
            EMAIL: email,
            KSUSER: ksuser,
            IGUSER: iguser
        } = data;

        let emailListG = this.dataG['email_list_getter'];

        let emailExists = await emailListG.get({email}).catch(err=>err);

        if(emailExists.success && emailExists.data[0])
            this.end(rest, {success: false, data:{notnew: true}});

        let elR = await emailListG.add({fname, lname, email, ksuser, iguser}).catch(err=>err);

        this.end(rest, {success: elR.success});
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

        let banNames = this.cfg.user_register.banned_names;

        if(banNames.indexOf(username) >= 0)
            return this.end(rest, {success: false, badname: true});

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

export class VerifyURL extends RestURL implements RestURL 
{
    public static url = "/register/verify";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {VERIFY_CODE: verify_code} = data;

        let userG = this.dataG['users_getter'];

        let usrP = userG.set({verifed: "Y"}, {verified: "N", verify_code}).catch(err=>err);

        let usrR = await usrP;

        if(usrR.success)
            this.end(rest, {success: true});
        else
            this.end(rest, {success: false});
    }
}

export default [
    ContactUsURL,
    EmailListURL,
    RegisterUserURL,
    VerifyURL,
];