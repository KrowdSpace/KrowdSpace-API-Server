import {RestURL} from '../../ottstify.js';

const Socials = { 
    socials : [
        {views: '9001', project: 'Project Views', percentage: '3'},
        {views: '85', project: 'Project Clicks', percentage: '3'},
        {views: '23', project: 'Project Backers', percentage: '34'},
        {views: '4567', project: 'Project Support', percentage: '12'},
        {views: '8800', project: 'Social Media Reach', percentage: '34'},
    ]
};


//Get User's Social details
export default class SocialsURL extends RestURL 
{
    constructor(log)
    {
        super('/users/:usernum/socials', log);
    };

    onLoad(req, res, n)
    {
        let usrNum = req.params.usrnum;

        let retObj = Socials;

        res.end(JSON.stringify(retObj));

        //Restify's API's method of moving to next request
        n();
    };
};