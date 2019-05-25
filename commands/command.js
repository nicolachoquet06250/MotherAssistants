class Command {
	static run (argv) {
		argv.shift();
		argv.shift();

		let object = Command.instanciateCommande(argv.shift(), argv.shift());
		let _return = object.run(argv);
		if(_return) {
			return _return;
		}
	}

	static instanciateCommande(command, subCommand) {
		let commandClass = require(`../modules/commands/${command.substr(0, 1).toUpperCase()}${command.substr(1, command.length - 1)}${subCommand.substr(0, 1).toUpperCase()}${subCommand.substr(1, subCommand.length - 1)}`)
		return  new commandClass();
	}
}

try {
	let _return = Command.run(process.argv);
	if (_return) {
		console.log(_return);
	}
}
catch (e) {
	console.error(e);
}