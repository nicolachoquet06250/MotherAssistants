module.exports = class Websocket {
    constructor() {}
    static get routes() {
        return {
            post: {
                '/parent_messages': Websocket.ParentMessages,
                '/parent_medias': Websocket.ParentMedias,
                'family_messages': Websocket.FamilyMessages,
                'family_medias': Websocket.FamilyMedias,
            }
        }
    }
    static get module() {
        return 'websocket';
    }

    static ParentMessages(req, res) {
        res.type('application/json').send({
            nb_messages: 1
        });
        res.end();
    }
    static ParentMedias(req, res) {}
    static FamilyMessages(req, res) {}
    static FamilyMedias(req, res) {}
};