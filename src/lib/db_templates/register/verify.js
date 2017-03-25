import {DBTemplate} from '../../ott/ottdb';

export default class VUTemplate extends DBTemplate
{
    static serviceName = "verify_user";

    submit(veriCode, type, cb)
    {
        let db = this.db;

        veriCode = db.escape(veriCode);

        let tbl = null;

        switch(type)
        {
            case 'user':
                tbl = 'users';
                break;
            case 'email':
                tbl = 'email_list';
                break;
        }
        
        let qu = `UPDATE ${tbl} SET verified='Y' where verify_code=${veriCode} LIMIT 1;`;

        db.query(qu, (err, res, f)=>
        {
            if(err)
                this.log.error(`Error in Verify SUBMIT query: ${err.stack}`, this.serviceName);
            else
                this.log.info(`Verified User!`, this.serviceName);
            
            if(cb)
                cb(!!err);
        });
    }
}