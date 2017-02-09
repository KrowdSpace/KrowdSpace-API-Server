/* 
    At this time, user and project details should return a 'random', 
    but consistent value, using the user and project num as salts.
*/

//Get User Details
const userUrl = '/users/:usrnum';
function getUser(req, res, n)
{
    let usrNum = req.params.usrnum;

    let returnObj = {
        someValue: doSomthingRandom(usrNum)
    };

    res.end(JSON.stringify(returnObj));

    //Restify's API's method of moving to next request
    n();
};

//Get User's Project Details
const projUrl = '/users/:usrnum/projects/:projnum';
function getProj(req, res, n)
{
    let usrNum = req.params.usrnum;
    let projNum = req.params.projnum;

    let returnObj = {
        someValue: doSomthingRandom(usrNum + projNum)
    };

    res.end(JSON.stringify(returnObj));
    
    //Restify's API's method of moving to next request
    n();
};

function doSomthingRandom(a1)
{
    return a1;
}

//Exports deets as objects, should return an object under normal node 'require'
export const user = {userUrl, getUser};
export const proj = {projUrl, getProj};
