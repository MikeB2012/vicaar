var brain = require("brain.js");
var NeuralNetwork = brain.NeuralNetwork;

function load(json) {
	var net = new NeuralNetwork();
	net.fromJSON(json);
	return net;
}

function run(net, data) {
	return net.run(data);
}

function train(net, data) {

}
