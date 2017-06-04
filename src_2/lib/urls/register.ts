import * as crypto from 'crypto';

import * as bcrypt from 'bcrypt';

import * as request from 'request-promise-native';
import cheerio from 'cheerio';

import {RestURL, safeJSON} from '@otter-co/ottlib';

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

        let usrP = userG.set({verifed: "Y"}, {verified: "N", verify_code}).catch(err=>err);

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
            USERNAME: username, 
            EMAIL: email, 
            PASSWORD: password,

            FNAME: fname,
            LNAME: lname,
            KS_USER: ksuser,
            IG_USER: iguser,
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

        let pass_hash = await bcrpP,
            userExists = await usrChkP;

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
            URL: url,
            REWARD: reward,
            REWARDVALUE: rewardVal,
            REWARDAMOUNT: rewardAmm,
            PROJECTIMAGE,
        } = data;

        let projG = this.dataG["projects_getter"],
            sessG = this.dataG["sessions_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized1: true}});
        
        let sessP = sessG.get(cooks['ks-session']).catch(err=>err),
            projP = projG.get("").catch(err=>err);

        let sessR = await sessP,
            projR = await projP;

        if(!sessR.success || !sessR.data)
            return this.end(rest, {success: false, data: {not_authorized2: true} });

        if(projR.success && projR.data && projR.data[0])
            return this.end(rest, {success: false, data: {unique_id_already_exists: true}});

        let rawWData = await request(url).catch(err=>err);

        let webData = this.getKSURLData(rawWData, this.ksPageIDs);

        let newPrData = {
            name: webData.title.content,
            owner: sessR.data[0].username,
            platform: "kickstarter",
            project_data: JSON.stringify({
                data: webData
            }),
        };

        let newProj = await projG.add(newPrData).catch(err=>err);

        if(!newProj.success)
            return this.end(rest, {success: false, data: {server_error: true}});
        else
            return this.end(rest, {success: true});
    }

    public ksPageIDs = {
        title: [
            'meta[property="og:title"]',
            'content'
        ],
        description: [
            'meta[property="og:description"]',
            'content'
        ],
        content: [
            "div.full-description",
            'text'
        ],
        stats: [
            "#pledged",
            'data-goal',
            'data-percent-raised',
            'data-pledged'
        ],
    };

    protected getKSURLData(data, dataT): any
    {
        let $ = cheerio.load(data);

        let retVal = {};

        for(let el in dataT)
        {
            let ar = dataT[el],
                id = ar.shift(),
                val = {};

            for(let att in ar)
            {
                let prN = ar[att],
                    prV = null;
                
                if(prN === "text")
                    prV = $(id).text();
                else
                    prV = $(id).attr(prN);

                val[prN] = prV;
            }

            retVal[el] = val;
        }

        return retVal;
    }
}

export default [
    ContactUsURL,
    EmailListURL,
    RegisterUserURL,
    VerifyURL,
    RegisterProjectURL,
];