"use strict";
var par = require("par");
var argv = require("minimist")(process.argv.slice(2));

var vicaar = require("./");

var command = argv._[0];

var network = argv.network;
var output = argv.output;
var data = argv.data;

if(command === "train") {
	vicaar
		.load(network)
		.then(par(vicaar.train, data))
		.then(par(vicaar.save, output))
		.catch(errorOut);
} else if(command === "run") {
	vicaar.load(network)
		.then(par(vicaar.run, data))
		.then(console.log)
		.catch(errorOut);
} else {
	console.error("Unknown command", command);
}

function errorOut(e) {
	console.error(e.stack);
	process.exit(1);
}
