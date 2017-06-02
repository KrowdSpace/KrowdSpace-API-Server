import {DataResponse, dataman_extras} from '@otter-co/ottlib';

export class UsersGetter extends dataman_extras.MySQLDataGetter
{
    public serviceName: string = "users_getter";
    table: string = "users";

    public add(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {
                username,
                pass_hash,
                email,
                user_data,
                verify_code
            } = this.escape(data);

            this.insert({username, pass_hash, email, user_data, verify_code}, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true});
                else
                    reject({success: false, data: err});
            });
        });
    }
    public set(id: any, data: any): Promise<DataResponse>
    {
        return new Promise((reject, resolve)=>
        {
            id = this.escape(id);
            data = this.escape(data);

            this.update(id, data, void 0, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: res[0]});
                else
                    reject({success: false, data: err});
            });
        });
    }
    public get(data: UserGet): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {
                email,
                username
            } = this.escape(data);   

            this.select("*", {email, username}, " OR ", (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: res});
                else
                    reject({success: false, data: err});
            });
        });
    }
}

export class SessionsGetter extends dataman_extras.MySQLDataGetter 
{
    public serviceName: string = "sessions_getter";
    table: string = "sessions";

    public add(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {
                session_id,
                username,
                last_ip
            } = this.escape(data);

            this.insert({session_id, username, last_ip}, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true});
                else
                    reject({success: false, data: err});
            });
        });
    }
    public get(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {
                session_id = "''",
                username = "''"
            } = this.escape(data);

            this.select("*", {session_id, username}, " OR ", (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: res[0]});
                else
                    reject({success: false, data: err});
            });
        });
    }
    public set(id: any, data: any): Promise<DataResponse>
    {
        return new Promise((reject, resolve)=>
        {
            id = this.escape(id);
            data = this.escape(data);

            this.update(data, id, undefined, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: res[0]});
                else
                    reject({success: false, data: err});
            });
        });
    }
    public rid(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {
                session_id
            } = this.escape(data);

            this.delete({session_id}, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true});
                else
                    reject({success: false, data: err});
            });
        });
    }
}

export interface UserGet
{
    username?:string;
    email?:string;
}

export default [
    UsersGetter,
    SessionsGetter,
];