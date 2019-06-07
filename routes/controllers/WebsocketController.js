module.exports = class Websocket {
    constructor() {
        this.Session = require('../../modules/helpers/Session');
        this.connector = require('../../modules/database/mongodb_connector');
    }
    static get routes() {
        return {
            post: {
                '/parent_messages': Websocket.ParentMessages,
                '/parent_medias': Websocket.ParentMedias,
                '/family_messages': Websocket.FamilyMessages,
                '/family_medias': Websocket.FamilyMedias,
            }
        }
    }
    static get module() {
        return 'websocket';
    }
    static get WS() {
        return new Websocket();
    }

    static ParentMessages(req, res) {
        if(Websocket.WS.Session.Connected(req)) {
            Websocket.WS.connector.onMongoConnect(client => {
                let DAO = Websocket.WS.connector.getDao(client, 'account');
                DAO.get({ _id: new Websocket().Session.GetAccount(req).__id })
                    .then(accounts => {
                        let me = accounts.map(account => DAO.createEntity(account).json)[0];
                        res.type('application/json')
                            .send(me);
                        res.end();
                    })
                    .catch(err => {
                        res.type('application/json')
                            .status(403)
                            .send(JSON.parse(err));
                        res.end();
                    });
                client.close();
            });
        }
    }
    static ParentMedias(req, res) {
        if(Websocket.WS.Session.Connected(req)) {
            Websocket.WS.connector.onMongoConnect(client => {
                let DAO = Websocket.WS.connector.getDao(client, 'account');
                DAO.get({ _id: new Websocket().Session.GetAccount(req).__id })
                    .then(accounts => {
                        let me = accounts.map(account => DAO.createEntity(account).json)[0];
                        res.type('application/json')
                            .send(me);
                        res.end();
                    })
                    .catch(err => {
                        res.type('application/json')
                            .status(403)
                            .send(JSON.parse(err));
                        res.end();
                    });
                client.close();
            });
        }
    }
    static FamilyMessages(req, res) {
        if(Websocket.WS.Session.Connected(req)) {
            Websocket.WS.connector.onMongoConnect(client => {
                let DAO = Websocket.WS.connector.getDao(client, 'account');
                DAO.get({ _id: new Websocket().Session.GetAccount(req).__id })
                    .then(accounts => {
                        let me = accounts.map(account => DAO.createEntity(account).json)[0];
                        res.type('application/json')
                            .send(me);
                        res.end();
                    })
                    .catch(err => {
                        res.type('application/json')
                            .status(403)
                            .send(JSON.parse(err));
                        res.end();
                    });
                client.close();
            });
        }
    }
    static FamilyMedias(req, res) {
        if(Websocket.WS.Session.Connected(req)) {
            Websocket.WS.connector.onMongoConnect(client => {
                let DAO = Websocket.WS.connector.getDao(client, 'account');
                DAO.get({ _id: new Websocket().Session.GetAccount(req).__id })
                    .then(accounts => {
                        let me = accounts.map(account => DAO.createEntity(account).json)[0];
                        res.type('application/json')
                            .send(me);
                        res.end();
                    })
                    .catch(err => {
                        res.type('application/json')
                            .status(403)
                            .send(JSON.parse(err));
                        res.end();
                    });
                client.close();
            });
        }
    }
};