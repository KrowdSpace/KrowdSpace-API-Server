import {extras, RestURL} from '@otter-co/ottlib';
import {UpdateProject} from '../scrape_profiles/scrape_base';

import {RewardStatus, UserLevel} from './register';

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
            let rewardStat = proj.RewardStatus;

            let featureedCheck = proj.featureedCheck && proj.featureedCheck == "on";
            let exploreCheck = proj.exploreCheck && proj.exploreCheck == "on";
            let landingCheck = proj.landingCheck && proj.landingCheck == "on";
            let socialCheck = proj.socialCheck && proj.socialCheck == "on";

            let setResult = await projG.set({unique_id: projectID}, 
                {
                    project_data: {
                        info_data: {
                            featured: featureedCheck,
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

export default [
    AdminSubmitURL,
];