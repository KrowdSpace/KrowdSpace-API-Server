import {DataResponse, dataman_extras} from "@otter-co/ottlib";

export class ProjectsGetter extends dataman_extras.MySQLDataGetter
{
    public serviceName = "projects_getter";
    table = "projects";

    public add(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {
                name,
                owner,
                platform,
                project_data
            } = this.escape(data);

            this.insert({name, owner, platform, project_data}, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: res});
                else
                    reject({success: false, data: err});
            });
        });
    }
    public get(id: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            id = this.escape(id);
            
            this.select("*", {id: id, unique_id: id, name: id, owner: id}, " OR ", (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: res});
                else
                    reject({success: false, data: err});
            });
        });
    }
    public set(id: any, data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            id = this.escape(id);
            data = this.escape(data);

            this.update(data, {id: id}, void 0, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: res});
                else
                    reject({success: false, data: err});
            });
        });
    }
    public rid(id: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            id = this.escape(id);

            this.delete({id: id, unique_id: id}, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: res});
                else
                    reject({success: true, data: err});
                
            });
        });
    }

}

export default [
    ProjectsGetter,
]