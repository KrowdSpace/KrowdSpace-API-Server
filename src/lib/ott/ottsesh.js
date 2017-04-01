/**
 * OttSesh.js
 * Otter's Sessions Abstractor
 * (C) Ben Otter (Benjamin McLean), 2017
 */
import Logger from './ottlogger';

export default class SessionsManager
{
    serviceName = "Sessions Manager";

    sessions = new Map();

    constructor(cfg, log)
    {
        this.config = cfg;
        this.log = log;
    }

    start()
    {
        this.log.info("Sessions Manager Online!", this.serviceName);
    }

    makeSession()
    {
        let byC = this.config.user_security.sess_key_length;
        let sesh_id = crypto.randomBytes(byC).toString('base64');

        let sesh = new Session(sesh_id, this, this.log);

        if(this.checkSession(sesh))
            return null;

        this.sessions.set(seshID, sesh);
        return sesh;
    }

    checkSession(seshID)
    {
        return this.sessions.get(seshID);
    }

    logout(seshID)
    {
        return this.sessions.delete(seshID);
    }
}

export class Session
{
    serviceName = "Session";

    constructor(id, mngr, log)
    {
        this.id = id;
        this.manager = mngr;
        this.log = log;
    }

    logout()
    {
        return this.manager.logout(this.id);
    }
}