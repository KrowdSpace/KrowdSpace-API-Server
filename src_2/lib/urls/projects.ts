import {RestURL} from '@otter-co/ottlib';

export class ProjectURL extends RestURL implements RestURL 
{
    static url = "/projects/projects";
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

        return this.end(rest, {success: true, data: projR.data[0]});
    }
}

export class SetProjectURL extends RestURL implements RestURL
{
    static url = "/projects/set_project";
    static type = "post";

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

        let sessR = await sessG.get(cooks['ks-session']);

        if(!sessR.success)
            return this.end(rest, {success: false, data: {not_autorized: true}});
    }
}

export default [
    ProjectURL,
];