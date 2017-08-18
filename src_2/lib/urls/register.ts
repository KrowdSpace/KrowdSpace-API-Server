import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

import * as request from 'request-promise-native';
import * as cheerio from 'cheerio';

import * as sendMail from 'sendmail';

import {RestURL, safeJSON} from '@otter-co/ottlib';

import * as scraper from '../scrape_profiles/scrape_base';

import * as ksData from '../scrape_profiles/kickstarter';
import * as igData from '../scrape_profiles/indiegogo';

const mailer = sendMail({silent: true});

export class ContactUsURL extends RestURL implements RestURL
{
    public static url = "/v1/register/contact_us";
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
    public static url = "/v1/register/email_list";
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

export class VerifyURL extends RestURL implements RestURL 
{
    public static url = "/v1/register/verify";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {VERIFY_CODE: verify_code} = data;

        let userG = this.dataG['users_getter'];

        let usrP = userG.set({verifed: true}, {verify_code}).catch(err=>err);

        let usrR = await usrP;

        if(usrR.success)
            this.end(rest, {success: true});
        else
            this.end(rest, {success: false});
    }
}

export class RegisterUserURL extends RestURL implements RestURL 
{
    public static url = "/v1/register/user";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            USERNAME: username = "", 
            EMAIL: email = "", 
            PASSWORD: password,

            FNAME: fname,
            LNAME: lname,
            KS_USER: ksuser,
            IG_USER: iguser,
        } = data;

        username = username.toLowerCase();
        email = email.toLowerCase();

        let banNames = this.cfg.user_register.banned_names;

        if(banNames.indexOf(username) >= 0)
            return this.end(rest, {success: false, badname: true});

        let user_data = {fname, lname, ksuser, iguser};

        let userG = this.dataG['users_getter'];

        let byC = (this.cfg.user_security && this.cfg.user_security.validate_key_length) || 64;
        let salts = (this.cfg.user_security && this.cfg.user_security.pass_salts) || 11;
        
        let verify_code = crypto.randomBytes(byC).toString('base64').replace(/[^A-Za-z0-9]/g, "");

        let unique_id = crypto.randomBytes(10).toString('base64').replace(/[^A-Za-z0-9]/g, "");

        let bcrpP = bcrypt.hash(password, salts).catch(err=>err),
            usrChkP = userG.get({username, email}).catch(err=>err);

        let pass_hash = await bcrpP,
            userExists = await usrChkP;

        let resp: string | any;

        if(userExists.data && !userExists.data[0] && pass_hash)
        {
            resp = "Error Adding user to DB";

            let userO = {
                username: username,
                unique_id, 
                email: email,
                pass_hash, 
                user_data,
                verified: false,
                verify_code,
                forget_code: ""
            };

            let usrAddP = userG.add(userO).catch(err=>err);
            let usrAddR = await usrAddP;

            // Success Path!
            if(usrAddR)
            {
                this.end(rest, {success: true});

                let verify_url = this.cfg.verify_url + verify_code;
                
                mailer({
                    from: 'no-reply@krowdspace.com',
                    to: email,
                    subject: "Verify Krowdspace Email",
                    html: 
                        `Hi ${ fname }!
                        <br>
                        <a href=“${ verify_url }“>Please click here to confirm this email address for your Krowdspace account!</a>
                        <br>
                        If the the above link does not work correctly in your email viewer please use the below URL:
                        <br>
                        ${verify_url}
                        <br>
                        - The Krowdspace Team`,
                });
                

                return;
            }
    
        } else if(userExists.data[0])
            resp = {notnew: true};
        else if(!pass_hash)
             resp = "Password save error";
        else
            resp = "Unkown error";

        return this.end(rest, {success: false, data: resp});
    }
}

export class RegisterProjectURL extends RestURL implements RestURL
{
    public static url = '/v1/register/project';
    public static type = 'post';
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            CATEGORY: cat,
            DOMAINURL: dUrl,
            URL: url,
            REWARD: reward,
            REWARDVALUE: rewardVal,
            REWARDAMOUNT: rewardAmm,
            PROJECTIMAGE,
            IGREWARD: igrew
        } = data;

        let projG = this.dataG["projects_getter"],
            sessG = this.dataG["sessions_getter"],
            userG = this.dataG["users_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized1: true}});
        
        let sessP = sessG.get({session_id: cooks['ks-session']}).catch(err=>err),
            projP = projG.get({"project_data.info_data.url": dUrl + url}).catch(err=>err);

        let sessR = await sessP,
            projR = await projP;

        if(!sessR.success || !sessR.data || !sessR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true} });

        if(projR.success && projR.data && projR.data[0])
            return this.end(rest, {success: false, data: {unique_id_already_exists: true}});

        let coupon_code = crypto.randomBytes(6).toString('base64').replace(/[^A-Za-z0-9]/g, "");
        let unique_id = crypto.randomBytes(10).toString('base64').split('').slice(0,6).join('').replace(/[^A-Za-z0-9]/g, "");

        let iUrl = url;

        if(dUrl === "https://www.kickstarter.com/")
        {
            url = 'https://www.kickstarter.com/' + url;
        }
        else
        {
            url = `https://api.indiegogo.com/1/campaigns/${ url }.json?api_token=${this.cfg.api_keys.indiegogo}`;
        }

        let newPrData = {
            unique_id,
            owner: sessR.data[0].username,
            name: "",
            platform: (dUrl === 'https://www.kickstarter.com/') ? 'kickstarter' : 'indiegogo',
            coupon_code,
            project_data: {
                info_data: {
                    url,
                    scrape_url: url,
                    category: cat,
                    reward,
                    reward_value: rewardVal,
                    reward_ammount: parseFloat(rewardAmm),
                    ig_reward: igrew || null,

                    featured: false,
                    explore: false,
                    landing: false,
                    social: false,
                    rewardValid: RewardStatus.Pending,
                    refresh: false
                    
                },
                meta_data: {}
            },
        };

        let newProj = await projG.add(newPrData).catch(err=>err);

        if(!newProj.success)
            return this.end(rest, {success: false, data: {server_error: true, add_project_failed: true}});

        let apiK = "";
        if(url == 'https://www.indiegogo.com/' && this.cfg && this.cfg.api_keys && this.cfg.api_keys.indiegogo)
            apiK = this.cfg.api_keys.indiegogo;

        let updateP = await scraper.UpdateProject(unique_id, projG, apiK).catch( err=>err );

        if(!updateP.success)
            return this.end(rest, {success: false, data: {server_error: true, update_project_failed: updateP}});

        let usrU = await userG.set({_id: sessR.data[0]._id}, {level:'PO'} ).catch(err=>err);

        if(!usrU.success)
            return this.end(rest, {success: false, data: {server_error: true, update_user_failed: true}});
        else
            return this.end(rest, {success: true});
    }
}

export class RequestResetPasswordURL extends RestURL implements RestURL 
{
    public static url = '/v1/register/request_reset_password';
    public static type = 'post';
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            EMAIL
        } = data;
        
        EMAIL = EMAIL.toLowerCase();

        let userG = this.dataG["users_getter"];
        let userE = await userG.get({email: EMAIL}).catch(err=>err);

        let resO : any = {};

        if(userE.success && userE.data && userE.data[0])
        {
            let resetCode = crypto.randomBytes(20).toString('base64').split('').slice(0,20).join('').replace(/[^A-Za-z0-9]/g, "");
            let userR = await userG.set({_id: userE.data[0]._id}, {forget_code: resetCode}).catch(err=>err);

            resO.userR = userR;

            if(userR.success)
                mailer({
                    from: 'no-reply@krowdspace.com',
                    to: EMAIL,
                    subject: "Reset Krowdspace Password",
                    html: 
                        `You requested to have your password reset,
                        <br>
                        Here is your Reset Code: ${resetCode}
                        <br>
                        Please use this to reset your password 
                        <br>
                        <a href="${this.cfg.reset_url}">Reset Password Link </a>"`,
                });
        }
            
        return this.end(rest, {success: true, data: {resO, user_exists: !!(userE.success && userE.data && userE.data[0])}});
    }
}

export class ResetPasswordURL extends RestURL implements RestURL 
{
    public static url = '/v1/register/reset_password';
    public static type = 'post';
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            RESET_CODE,
            NEW_PASSWORD
        } = data;
        
        let userG = this.dataG['users_getter'];

        let byC = (this.cfg.user_security && this.cfg.user_security.validate_key_length) || 64;
        let salts = (this.cfg.user_security && this.cfg.user_security.pass_salts) || 11;

        let bcrpP = bcrypt.hash(NEW_PASSWORD, salts).catch(err=>err);

        let pass_hash = await bcrpP;
        let userR = await userG.set({forget_code: RESET_CODE}, {pass_hash}).catch(err=>err);
        
        return this.end(rest, {success: userR.success});
    }
}

export default [
    ContactUsURL,
    EmailListURL,
    RegisterUserURL,
    VerifyURL,
    RegisterProjectURL,
    RequestResetPasswordURL,
    ResetPasswordURL,
];

const RewardStatus = {
    "Pending": 0,
    "Approved": 1,
    "Denied": 2
};