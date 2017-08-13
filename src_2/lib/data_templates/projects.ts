import {DataResponse, extras} from "@otter-co/ottlib";

export class ProjectsGetter extends extras.mongodb_extra.MongoDBDataGetter
{
    public serviceName = "projects_getter";
    table = "projects";

    public agg(data: any)
    {
        return new Promise((ressolve, reject)=>
        {
            this.aggregate(data, (err, res, f)=>
            {
                if(!err)
                    res.toArray((err, docs)=>
                    {
                        ressolve({success: true, data: docs})
                    });
                else
                    reject({success: false, data: err});
            });
        });
    }

    public add(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            data = this.escape(data);

            this.insert(data, (err, res, f)=>
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
            
            this.select("*", id, " OR ", (err, res, f)=>
            {
                if(!err)
                    res.toArray((err, docs)=>
                    {
                        resolve({success: true, data: docs});
                    });
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

            this.update(data, id, void 0, (err, res, f)=>
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

            this.delete(id, (err, res, f)=>
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