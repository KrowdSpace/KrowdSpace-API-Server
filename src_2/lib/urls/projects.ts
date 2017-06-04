import {RestURL} from '@otter-co/ottlib';

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

        let projG = this.dataG["projects-getter"],
            sessG = this.dataG["sessions-getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data:{ not_authorized: true }});
        
        let sessR = await sessG.get(cooks['ks-session']).catch(err=>err);

        if(!sessR.success)
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let projR = await projG.get(projectID).catch(err=>err);

        if(!projR.success || !projR.data || !projR.data[0])
            return this.end(rest, {success: false, data:{ not_found: true }});
        else
            return this.end(rest, {success: true, data: projR.data[0]});
    }
}

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

        let projG = this.dataG["projects-getter"],
            sessG = this.dataG["sessions-getter"];

        if(!cooks['ks-session'])
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let sessR = await sessG.get(cooks['ks-session']).catch(err=>err);

        if(!sessR.success)
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let projR = await projG.get(projectID).catch(err=>err);

        if(!projR.success || !projR.data[0])
            return this.end(rest, {success: false, data: {not_found: true}});

        let proj = projR.data[0],
            user = sessR.data[0];

        if(!proj.owner === user.username)
            return this.end(rest, {success: false, data: {not_authorized: true}});

        let updtR = await sessG.set(projectID, data).catch(err=>err);

        if(!updtR.success)
            return this.end(rest, {success: false, data: {server_error: true}});
        else
            return this.end(rest, {success: true});
    }
}

export default [
    ProjectURL,
];