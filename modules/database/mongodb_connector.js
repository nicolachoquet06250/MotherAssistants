const MongoClient = require('mongodb').MongoClient;
let host = require('./bdd_host');
let fs = require('fs');
let credentials = null;
if(fs.existsSync(`${__dirname}/credentials.js`)) {
	credentials = require('./credentials');
}

// Database Name
const dbName = require('./bdd_prefix')() + 'assmats';

// Connection URL
const url = 'mongodb://' + (credentials === null ? '' : credentials.user + ':' + credentials.password + '@') + host() + ':27017/' + dbName;

// Create a new MongoClient
const client = () => new MongoClient(url, { useNewUrlParser: true });

const onMongoConnect = (s_callback, e_callback = null) => {
	let _client = client();
	_client.connect(err => {
		return err === null ? s_callback(_client) : (e_callback !== null ? e_callback(err) : null)
	});
};

const getDao = (_client, name) => {
	let UCFirst = require('../helpers/Strings').UCFirst;
	if (fs.existsSync(`${__dirname}/../../repository/dao/${UCFirst(name)}Dao.js`)) {
		let dao = require(`${__dirname}/../../repository/dao/${UCFirst(name)}Dao`);
		return new dao(_client, dbName);
	}
	throw new Error(`${name} DAO not found !`)
};

module.exports = {
	MongoClient,
	client,
	dbName,
	onMongoConnect,
	getDao
};