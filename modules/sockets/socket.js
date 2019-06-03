module.exports = io => {
    io.on('connection', function (client) {
        // let cmp = 0;
        // let nb_messages = null;
        let connector = require('../database/mongodb_connector');
        client.on('join', data => {
            if(data._id) {
                connector.onMongoConnect(_client => {
                    let DAO = connector.getDao(_client, 'account');
                    DAO.get({ _id: data._id }).then(accounts => {
                        if(accounts.length !== 0) {
                            let me = accounts.map(account => DAO.createEntity(account).json)[0];
                            console.log(`${me.first_name} ${me.last_name.toUpperCase()} s'est connecté !`);
                            if(data.message) {
                                console.log(`il à envoyé le message: ${data.message}`);
                            }
                            client._id = data._id;
                        }
                    })
                })
            }
        });
        client.on('new_message', data => {
            client.broadcast.emit('new_message', data.message);
        });
    });
};