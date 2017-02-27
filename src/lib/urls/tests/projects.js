import {RestURL} from '../../ottstify.js';

//Get User's Project Details
export default class ProjectURL extends RestURL 
{
    constructor(log)
    {
        super('/users/:usrnum/projects/:projnum', log);
    };

    onLoad(req, res, n)
    {
        let usrNum = req.params.usrnum;
        let projNum = req.params.projnum;

        let returnObj = {
            someValue: doSomethingRandom(usrNum + projNum)
        };

        res.end(JSON.stringify(returnObj));
        
        //Restify's API's method of moving to next request
        n();
    };
};