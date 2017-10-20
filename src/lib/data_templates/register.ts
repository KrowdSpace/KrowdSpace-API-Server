/**
 * data_templates/register.ts
 * 
 * Contains the assorted templates for adding a 'Contact Us' message, and getting on the Mailing List.
 */
import {DataResponse, extras} from '@otter-co/ottlib';

export class ContactUsGetter extends extras.mongodb_extra.MongoDBDataGetter
{
    public serviceName: string = "contact_us_getter";
    table: string = "contact_us";

    public add(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {fname, lname, email, comment} = this.escape(data);            
            this.insert({fname, lname, email, comment}, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: {res, f}} as DataResponse);
                else
                    reject({success: false, data: err} as DataResponse);
            });
        });
    }

    public get(data: any) : Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            data = this.escape(data);
            this.select(false, data, " OR " , (err, res, f)=>
            {   
                if(!err)
                    res.toArray((err, resA)=>
                    {
                        resolve({success: true, data: resA});
                    });

                else
                    reject({success: false, data: err});
            })
        });
    }
}

export class EmailListGetter extends extras.mongodb_extra.MongoDBDataGetter
{
    public serviceName: string = "email_list_getter";
    table: string = "email_list";

    public add(data: any): Promise<DataResponse>
    {
        return new Promise((reject, resolve)=>
        {
            let {
                fname,
                lname,
                email,
                ksuser,
                iguser,
                pvalid,
                vcode
            } = this.escape(data);

            this.insert({fname, lname, email, ksuser, iguser, pvalid, verify_code: vcode}, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true});
                else
                    reject({success:false, data: err});
            });
        });
    }

    public get(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {email} = this.escape(data);
            this.select(false, {email}, void 0, (err, res, f)=>
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
    ContactUsGetter,
    EmailListGetter,
];