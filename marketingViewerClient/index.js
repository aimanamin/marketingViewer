var PORT = 5005;
var HOST = '127.0.0.1';
var arg = process.argv[2].split("/")
var dgram = require('dgram');
var message = new Buffer(arg[arg.length-1]);
var client = dgram.createSocket('udp4');

if(arg[arg.length-2] === "cec"){
	client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    	if (err) throw err;
    	client.close();
	});
}
