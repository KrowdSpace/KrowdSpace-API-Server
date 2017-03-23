import {RestURL} from '../../ott/ottstify';
//Get User's Project Details
export default class ProjectURL extends RestURL 
{
    static type = 'get';
    static url = '/test/users/:usrnum/projects/:projnum';

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

function doSomethingRandom(a1) {
    return a1;
};
