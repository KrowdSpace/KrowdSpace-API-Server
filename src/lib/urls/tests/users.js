import {RestURL} from '../../ottstify.js';
//Get User Details
export default class UsersURL extends RestURL 
{
    static type = 'get';
    static url = '/users/:usernum';

    onLoad(req, res, n)
    {
        let usrNum = req.params.usernum;

        let returnObj = {
            someValue: doSomethingRandom(usrNum)
        };

        res.end(JSON.stringify(returnObj));

        //Restify's API's method of moving to next request
        n();
    };
};

function doSomethingRandom(a1) {
    return a1;
};
