let Command = require('./Command');
let fs = require('fs');

module.exports = class GenerateRepository extends Command {
	static get daoPath() {
		return `${__dirname}/../../repository/dao`;
	}
	static get daoFileName() {
		return `${GenerateRepository.entity}Dao.js`;
	}
	static get templateDao() {
		return `let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
	get entity() {
		return '${GenerateRepository.entity}';
	}

	get collection() {
		return '${GenerateRepository.collectionName}';
	}

	get(s_callback, e_callback = null) {
		this.Collection.find({}).toArray((err, documents) => err ? (e_callback !== null ? e_callback(err) : null) : s_callback(documents));
	}

	add(...${GenerateRepository.collectionName.toLowerCase()}) {
		${GenerateRepository.collectionName.toLowerCase()} = ${GenerateRepository.collectionName.toLowerCase()}.map(user => user.json);
		return new Promise((resolve, reject) => this.Collection.insertMany(${GenerateRepository.collectionName.toLowerCase()}, (err, result) => err ? reject(err) : resolve(result)));
	}

	update(where, updated${GenerateRepository.entity.substr(0, 1).toUpperCase()}${GenerateRepository.entity.substr(1, GenerateRepository.entity.length - 1)}, forceOne = false, s_callback = null, e_callback = null) {
		let callback = (err, res) => err ? (e_callback !== null ? e_callback(err) : null) : (s_callback !== null ? s_callback(res) : null);
		let updateObject = { $set: ${GenerateRepository.entity.substr(0, 1).toUpperCase()}${GenerateRepository.entity.substr(1, GenerateRepository.entity.length - 1)} };
		forceOne ? this.Collection.updateOne(where, updateObject, callback) : this.Collection.updateMany(where, updateObject, callback);
	}

	delete(where, forceOne = false, s_callback = null, e_callback = null) {
		let callback = (err, obj) => err ? (e_callback !== null ? e_callback(err) : null) : (s_callback !== null ? s_callback(obj) : null);
		forceOne ? this.Collection.deleteOne(where, callback) : this.Collection.deleteMany(where, callback);
	}
};`;
	}

	static get entityPath() {
		return `${__dirname}/../../repository/entities`;
	}
	static get entityFileName() {
		return `${GenerateRepository.entity}.js`;
	}
	static get templateEntity() {
		return `let Entity = require('../../modules/repository/Entity');

module.exports = class extends Entity {
	get props() {
		return {
			/*property: 'type'*/
		};
	}
};`;
	}

	run(argv) {
		let name = argv.shift();
		GenerateRepository.entity = `${name.substr(0, 1).toUpperCase()}${name.substr(1, name.length - 1)}`;
		GenerateRepository.collectionName = `${name}s`;

		fs.writeFile(`${GenerateRepository.daoPath}/${GenerateRepository.daoFileName}`, GenerateRepository.templateDao, (err) => !err ? console.log(`${GenerateRepository.daoFileName} has been generated !`) : console.error(err));
		fs.writeFile(`${GenerateRepository.entityPath}/${GenerateRepository.entityFileName}`, GenerateRepository.templateEntity, (err) => !err ? console.log(`${GenerateRepository.entityFileName} has been generated !`) : console.error(err))
	}
};