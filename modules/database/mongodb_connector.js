const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = require('./bdd_prefix') + 'assmats';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });

const onMongoConnect = (s_callback, e_callback = null) => {
	client.connect(err => err === null ? s_callback(client) : (e_callback !== null ? e_callback(err) : null));
};

module.exports = {
	MongoClient,
	client,
	dbName,
	onMongoConnect
};