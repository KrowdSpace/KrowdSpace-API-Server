import * as restify from 'restify';
import {user, proj, socials, impressions} from './lib/user_test.js';
import {emailList, contactUs} from './lib/'

const conf = {
    port: 8080,
};

const server = restify.createServer();

server.use(restify.fullResponse());

server.get(user.userUrl, user.getUser);
server.get(proj.projUrl, proj.getProj);
server.get(socials.socUrl, socials.getSocials);
server.get(impressions.impUrl, impressions.getImp);

server.post(emailList.elURL, emailList.postEL);
server.post(contactUs.cuURL, contactUs.postCU);

server.listen(conf.port, ()=>
{
    console.log('Server On, and Listening on port ' + conf.port);
});
