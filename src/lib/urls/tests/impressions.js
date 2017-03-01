import {RestURL} from '../../ott/ottstify';

const SocialGraph = { 
    socialgraph : [
        {alternate: 'odd', title: "Facebook", color: "aero", performance: '30', impressions: '500', reactions: '30', ctr: '5', conversion:'4'},
        {alternate: 'even', title: "Twitter", color: "purple", performance: '10', impressions: '657', reactions: '8', ctr: '5', conversion:'3'},
        {alternate: 'odd', title: "Instagram", color: "red", performance: '15', impressions: '754', reactions: '2', ctr: '5', conversion:'3'},
        {alternate: 'even', title: "Pinterest", color: "green", performance: '45', impressions: '845', reactions: '6', ctr: '5', conversion:'1'}
    ]
};

//Get User's Impression Details
export default class ImpressionsURL extends RestURL 
{
    static type = 'get';
    static url = '/users/:usrnum/impressions';

    onLoad(req, res, n)
    {
        let usrNum = req.params.usrnum;

        let retObj = SocialGraph;

        res.end(JSON.stringify(retObj));

        //Restify's API's method of moving to next request
        n();
    };
};