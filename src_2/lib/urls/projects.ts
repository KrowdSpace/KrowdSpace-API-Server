import {extras, RestURL} from '@otter-co/ottlib';

import {UpdateProject} from '../scrape_profiles/scrape_base';

export class ProjectURL extends RestURL implements RestURL 
{
    static url = "/v1/projects/projects";
    static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)    
    {
        let {
            PROJECTID: projectID
        } = data;

        let projG = this.dataG["projects_getter"],
            sessG = this.dataG["sessions_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data:{ not_authorized: true }});
        
        let sessR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);

        if(!sessR.success || !sessR.data || !sessR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        if(!projectID || projectID === ' ')
            projectID = sessR.data[0].username;
        
        let projR = await projG.get({'$or':[{unique_id: projectID},{name: projectID}, {owner: projectID}]}).catch(err=>err);

        if(!projR.success || !projR.data || !projR.data[0])
            return this.end(rest, {success: false, data:{ not_found: true }});
        else
            return this.end(rest, {success: true, data: projR.data});
    }
}

// TODO - FIX AND SANATIZE USER INPUT ASAP
export class SetProjectURL extends RestURL implements RestURL
{
    public static url = "/v1/projects/set_project";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            PROJECTID: projectID,
            DATA: projData
        } = data;

        let projG = this.dataG["projects_getter"],
            sessG = this.dataG["sessions_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let sessR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);

        if(!sessR.success || !sessR.data || !sessR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let projR = await projG.get({'$or':[{id: projectID}, {unique_id: projectID}, {name: projectID}, {owner: projectID}]}).catch(err=>err);

        if(!projR.success || !projR.data[0])
            return this.end(rest, {success: false, data: {not_found: true}});

        let proj = projR.data[0],
            user = sessR.data[0];

        if(!proj.owner === user.username)
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let updtR = await projG.set({_id: proj._id}, projData).catch(err=>err);

        if(!updtR.success)
            return this.end(rest, {success: false, data: {server_error: true}});
        else
            return this.end(rest, {success: true});
    }
}

export class UpdateProjectURL extends RestURL implements RestURL 
{
    public static url = "/v1/projects/update_project";
    public static type = "post";
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            PROJECTID: projectID
        } = data;

        let projG = this.dataG["projects_getter"],
            sessG = this.dataG["sessions_getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let sessR = await sessG.get({session_id: cooks['ks-session']}).catch(err=>err);

        if(!sessR.success || !sessR.data || !sessR.data[0])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let projR = await projG.get({'$or':[{id: projectID}, {unique_id: projectID}, {name: projectID}, {owner: projectID}]}).catch(err=>err);

        if(!projR.success || !projR.data[0])
            return this.end(rest, {success: false, data: {not_found: true}});

        let proj = projR.data[0],
            user = sessR.data[0];

        if(!proj.owner === user.username)
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let apiK = "";
        if(proj.platform == "indiegogo" && this.cfg && this.cfg.api_keys && this.cfg.api_keys.indiegogo)
            apiK = this.cfg.api_keys.indiegogo;

        let updtR = await UpdateProject(proj.unique_id, this.dataG['projects_getter'], apiK);

        if(!updtR)
            return this.end(rest, {success: false, data: {server_error: true}});
        else
            return this.end(rest, {success: true});
    }
}

export class ExploreProjectsURL extends RestURL implements RestURL 
{
    public static url = "/v1/projects/explore";
    public static type = 'post';
    public reqs = RestURL.reqs.dataReq;

    public async onLoad(rest, data, cooks)
    {
        let {
            LIMIT: limit,
            TITLE: title,
            OWNER: owner,
            CATEGORY: cat,
            AGE: age,
            ENDTIME: endtime,
        } = data;

        let projG = this.dataG["projects_getter"];

        let projR;

        if(limit && !title && !owner && !cat && !age && !endtime)
        {
            projR = await projG.get({}).catch(err=>err);
        }
        else
        {
            projR = await projG.get({'$or':[
                {owner}, 
                {'project_data.info_data.category': cat}
            ]}).catch(err=>err);
        }

        if(!projR.success || !projR.data || !projR.data[0])
            return this.end(rest, {success: false, data:{none_found: true}});
        else
            return this.end(rest, {success: true, data: projR.data.slice(0, limit || 50)});
    }
}

export default [
    ProjectURL,
    SetProjectURL,
    UpdateProjectURL,
    ExploreProjectsURL,
];