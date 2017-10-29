import * as stripe from 'stripe';

import {extras, RestURL, DataResponse} from '@otter-co/ottlib';
import {UpdateProject} from '../scrape_profiles/scrape_base';
import {ProjectsGetter} from "../data_templates/projects";

export const HardPricing = 
{
    "featured_icon": 1000,
    "featured_social": 1000,
    "featured_explore": 1500,
    "featured_landing": 2000,
};

export class ProjectPurchaseURL extends RestURL implements RestURL 
{
    public static url = "/v1/projects/purchase";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    private _stripeObj: stripe = null;

    public get stripeObj(): stripe 
    {
        if(this._stripeObj)
            return this._stripeObj;
        else
        {
            var s = new stripe((this.cfg.stripe && this.cfg.stripe.key) || "sk_test_BQokikJOvBiI2HlWgH4olfQ2");
            this._stripeObj = s;

            return s;
        }
    }
   
    public async onLoad(rest, data, cooks)
    {
        let {
            token,
            project: projectID,
            type
        } = data.PURCHASE_DATA;

        let projG = this.dataG["projects_getter"],
            sessG = this.dataG["sessions_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let sessR = await sessG.get({session_id: cooks['ks-session']}).catch(err=><DataResponse>err);

        if(!sessR.success || !sessR.data || !sessR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let projR = await projG.get({'$or':[{id: projectID}, {unique_id: projectID}, {name: projectID}, {owner: projectID}]}).catch(err=>err);

        if(!projR.success || !projR.data[0])
            return this.end(rest, {success: false, data: {not_found: true}});

        let proj = projR.data[0],
            user = sessR.data[0];

        if(proj.owner !== user.username)
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let cost = HardPricing[type];

        if(!cost)
            return this.end(rest, {success: false, data: {bad_purchase_type: true}});

        let s = this.stripeObj;
        
        let charge = null; 
        
        try
        {
            charge = await s.charges.create({
                amount: cost,
                currency: 'usd',
                source: token,
            });
        }
        catch(err)
        {
            return this.end(rest, {success: false, data: {charge_error: err}});
        }

        let setObj = {};

        switch(type)
        {
            case "featured_icon":
                setObj = {
                    project_data: {
                        info_data: {
                            featured: true
                        }
                    }
                };
            break;

            case "featured_explore":
                setObj = {
                    project_data: {
                        info_data: {
                            explore: true
                        }
                    }
                };
            break;

            case "featured_landing":
                setObj = {
                    project_data: {
                        info_data: {
                            landing: true
                        }
                    }
                };
            break;

            case "featured_social":
                setObj = {
                    project_data: {
                        info_data: {
                            social: true
                        }
                    }
                };
            break;
        }
        
        let projSetR = await projG.set({unique_id: proj.unique_id}, setObj).catch(err=>err);

        if(!projSetR.success) 
        {
            return this.end(rest, {success: false, data: {error_setting_project: true}});
        }
        else
        {
            return this.end(rest, {success: true});
        }
    }

 
}

export default [
    ProjectPurchaseURL,
];