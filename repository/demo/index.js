let account_dao = require('../dao/AccountDao');
let connector = require('../../modules/database/mongodb_connector');
let pwHelpers = require('../../modules/helpers/Passwords');

connector.onMongoConnect(client => {
    let AccountDao = new account_dao(client, connector.dbName);
    pwHelpers.cryptPassword('2669NICOLAS2107', (err, hash) => {
        let Account = AccountDao.createEntity({
            first_name: 'Nicolas',
            last_name: 'Choquet',
            email: 'nicolachoquet06250@gmail.com',
            password: hash,
            birth_day: '21/07/1995',
            max_number_places: 4,
            profile_pic: '98088e61d3a671d2f9574e1e01f60e24.png',
        });
        AccountDao.add(Account);
        console.log(Account.json);
    });
    client.close();
});

