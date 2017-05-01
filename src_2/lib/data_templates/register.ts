import {DataResponse, dataman_extras} from '@otter-co/ottlib';

export class ContactUsGetter extends dataman_extras.MySQLDataGetter
{
    public serviceName: string = "contact_us_getter";
    table: string = "contact_us";

    public add(data: ContactUsData): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let {fname, lname, email, comment} = this.escape<ContactUsData>(data);            
            this.insert({fname, lname, email, comment}, (err, res, f)=>
            {
                if(!err)
                    resolve({success: true, data: {res, f}} as DataResponse);
                else
                    reject({success: false, data: err} as DataResponse);
            });
        });
    }
}
export interface ContactUsData
{
    fname: string;
    lname: string;
    email: string;
    comment: string;
}

export default [
    ContactUsGetter
];