"use strict";
var par = require("par");
var argv = require("minimist")(process.argv.slice(2));

var vicaar = require("./");

var command = argv._[0];

var network = argv.network;
var output = argv.output;
var data = argv.data;
var layer = argv.layer;
var activation = argv.activation;
var rate = argv.rate;
var depth = argv.depth;

if(command === "train") {
	var options = {};
	if(activation)
		options.activation = activation;
	if(layer)
		options.hiddenLayers = [].concat(layer);
	if(rate)
		options.learningRate = rate;

	vicaar
		.load(network, options)
		.then(par(vicaar.train, data))
		.then(par(vicaar.save, output))
		.catch(errorOut);
} else if(command === "run") {
	vicaar.load(network)
		.then(par(vicaar.run, depth, data))
		.then(console.log)
		.catch(errorOut);
} else {
	console.error(argv);
	console.error("Unknown command", command);
}

function errorOut(e) {
	process.exit(1);
}
