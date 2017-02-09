import * as restify from 'restify';
import {user, proj} from './lib/user_test.js';

const conf = {
    port: 8080,
};

const server = restify.createServer();

console.log(user, proj);

server.get(user.userUrl, user.getUser);
server.get(proj.projUrl, proj.getProj);

server.listen(conf.port, ()=>
{
    console.log('Server On, and Listening on port ' + conf.port);
});
