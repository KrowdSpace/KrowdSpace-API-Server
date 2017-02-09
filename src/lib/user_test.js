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
        someValue: doSomethingRandom(usrNum)
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
        someValue: doSomethingRandom(usrNum + projNum)
    };

    res.end(JSON.stringify(returnObj));
    
    //Restify's API's method of moving to next request
    n();
};

function doSomethingRandom(a1)
{
    return a1;
};

//Get User's Social details
const socUrl = '/users/:usernum/socials';
function getSocials(req, res, n)
{
    let usrNum = req.params.usrnum;

    let retObj = Socials;

    res.end(JSON.stringify(retObj));

    //Restify's API's method of moving to next request
    n();
}

//Get User's Impression Details
const impUrl = '/users/:usrnum/impressions';
function getImp(req, res, n)
{
    let usrNum = req.params.usrnum;

    let retObj = SocialGraph;

    res.end(JSON.stringify(retObj));

    //Restify's API's method of moving to next request
    n();
}

const Socials = [
    {views: '9001', project: 'Poject Views', percentage: '3'},
    {views: '85', project: 'Poject Clicks', percentage: '3'},
    {views: '23', project: 'Poject Backers', percentage: '34'},
    {views: '4567', project: 'Poject Support', percentage: '12'},
    {views: '8800', project: 'Social Media Reach', percentage: '34'},
];

const SocialGraph = [
    {alternate: 'odd', title: "Facebook", color: "aero", performance: '30', impressions: '500', reactions: '30', ctr: '5', conversion:'4'},
    {alternate: 'even', title: "Twitter", color: "purple", performance: '10', impressions: '657', reactions: '8', ctr: '5', conversion:'3'},
    {alternate: 'odd', title: "Instagram", color: "red", performance: '15', impressions: '754', reactions: '2', ctr: '5', conversion:'3'},
    {alternate: 'even', title: "Pinterest", color: "green", performance: '45', impressions: '845', reactions: '6', ctr: '5', conversion:'1'}
];

//Exports deets as objects, should return an object under normal node 'require'
export const user = {userUrl, getUser};
export const proj = {projUrl, getProj};
export const socials = {socUrl, getSocials};
export const impressions = {impUrl, getImp};
