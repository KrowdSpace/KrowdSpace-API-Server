/**
 * urls/admin.ts
 * 
 * Contains some administrative API functions,
 * Like mass editing projects.
 */

import {extras, RestURL} from '@otter-co/ottlib';
import {UpdateProject} from '../scrape_profiles/scrape_base';

import {RewardStatus, UserLevel} from './register';

/**
 * @class AdminSubmitURL - Admin URL Class
 */
export class AdminSubmitURL extends RestURL implements RestURL 
{
    static url = "/v1/admin/submit";
    static type = "post";
    public reqs = RestURL.reqs.dataReq;
    
    public async onLoad(rest, data, cooks)
    {
        let {
            PROJECTS: projects
        } = data;

        let projG = this.dataG["projects_getter"],
            sessG = this.dataG["sessions_getter"],
            userG = this.dataG["users_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let sessR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);


        if(!sessR.success || !sessR.data || !sessR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let userR = await userG.get({username: sessR.data[0].username}).catch(err=>err);


        if(!userR.success || !userR.data || !userR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let user = userR.data[0];

        if(user.level < UserLevel.Administrator)
            return this.end(rest, {success: false, data: {not_authorized: true}});


        if(!Array.isArray(projects))
            return this.end(rest, {success: false, data: {invalid_data: true}});

        let retO = {};

        for(let proj of projects)
        {
            let projectID = proj.projectId;
            let rewardStat = proj.rewardStatus;

            let featuredCheck = proj.featuredCheck && proj.featuredCheck == "on";
            let exploreCheck = proj.exploreCheck && proj.exploreCheck == "on";
            let landingCheck = proj.landingCheck && proj.landingCheck == "on";
            let socialCheck = proj.socialCheck && proj.socialCheck == "on";

            let setResult = await projG.set({unique_id: projectID}, 
                {
                    project_data: {
                        info_data: {
                            featured: featuredCheck,
                            explore: exploreCheck,
                            landing: landingCheck,
                            social: socialCheck,
                            rewardValid: rewardStat,
                        }
                    }
                });

            if(setResult.success)
                    retO[projectID] = true;
        }

        return this.end(rest, {success: true, data: retO});
    }
}

export class AdminDeleteProjects extends RestURL implements RestURL 
{
    static url = "/v1/admin/delete";
    static type = "post";
    public reqs = RestURL.reqs.dataReq;
    
    public async onLoad(rest, data, cooks)
    {
        let {
            PROJECTS: projects
        } = data;

        let projG = this.dataG["projects_getter"],
            sessG = this.dataG["sessions_getter"],
            userG = this.dataG["users_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let sessR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);


        if(!sessR.success || !sessR.data || !sessR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let userR = await userG.get({username: sessR.data[0].username}).catch(err=>err);


        if(!userR.success || !userR.data || !userR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let user = userR.data[0];

        if(user.level < UserLevel.Administrator)
            return this.end(rest, {success: false, data: {not_authorized: true}});

        if(!Array.isArray(projects))
            return this.end(rest, {success: false, data: {invalid_data: true}});

        let retO = {};

        for(let proj of projects)
        {
            let projectID = proj.projectId;

            let delRes = await projG.rid({unique_id: projectID}).catch(err=>err);

            if(delRes.success)
                    retO[projectID] = true;
        }

        return this.end(rest, {success: true, data: retO});
    }
}

export class GetCommentsURL extends RestURL implements RestURL 
{
    static url = "/v1/admin/comments";
    static type = "post";

    public async onLoad(rest, data, cooks)
    {
        let sessG = this.dataG["sessions_getter"],
            userG = this.dataG["users_getter"];

        let contG = this.dataG["contact_us_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let sessR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);


        if(!sessR.success || !sessR.data || !sessR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let userR = await userG.get({username: sessR.data[0].username}).catch(err=>err);

        if(!userR.success || !userR.data || !userR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let user = userR.data[0];

        if(user.level < UserLevel.Administrator)
            return this.end(rest, {success: false, data: {not_authorized: true}});


        let comments = await contG.get({}).catch(err=>err);

        if(!comments.success || !comments.data || !comments.data[0])
            return this.end(rest, {success: false, data:{error_getting_comments: true}});

        return this.end(rest, {success: true, data: comments.data});
    }
}

export default [
    AdminSubmitURL,
    GetCommentsURL,
];