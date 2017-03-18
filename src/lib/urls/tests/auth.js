import {RestURL} from '../../ott/ottstify';

export default class AuthTestURL extends RestURL 
{
    static type = 'get';
    static url = '/test/auth';

    onLoad(req, res, n)
    {        
        res.end(JSON.stringify(req.cookies));
        n();
    };
};

