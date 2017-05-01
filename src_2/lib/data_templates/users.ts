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
    public get(data: any): Promise<DataResponse>
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

export default [
    UsersGetter,
];