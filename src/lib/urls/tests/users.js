import {RestURL} from '../../ottstify.js';

//Get User Details
export default class UsersURL extends RestURL 
{
    constructor(log)
    {
        super('/users/:usernum', log);
    };

    onLoad(req, res, n)
    {
        let usrNum = req.params.usrnum;

        let returnObj = {
            someValue: doSomethingRandom(usrNum)
        };

        res.end(JSON.stringify(returnObj));

        //Restify's API's method of moving to next request
        n();
    };
};