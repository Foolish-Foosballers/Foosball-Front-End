'use strict';
/*******************************************************
The predix-webapp-starter Express web application includes these features:
  * routes to mock data files to demonstrate the UI
  * passport-predix-oauth for authentication, and a sample secure route
  * a proxy module for calling Predix services such as asset and time series
*******************************************************/
var amqp = require('amqplib/callback_api');
var express = require('express');
var http = require('http'); // needed to integrate with ws package for mock web socket server.
var app = express();
var httpServer = http.createServer(app);
// var config = require("./config.js");
var socketio = require("socket.io");
var io = socketio.listen(3080);
var path = require('path');


var apiRoute = '/api/v1/';

/**********************************************************************
       SETTING UP EXRESS SERVER
***********************************************************************/
app.set('trust proxy', 1);

// if running locally, we need to set up the proxy from local config file:
var node_env = process.env.node_env || 'development';
console.log('************ Environment: '+node_env+'******************');

/****************************************************************************
	SET UP EXPRESS ROUTES
*****************************************************************************/

// LOOK HERE!!!! For targeting specific routes in ../public
app.use(express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../public')));
// LOOK HERE!!

////// error handlers //////
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler - prints stacktrace
if (node_env === 'development') {
	app.use(function(err, req, res, next) {
		if (!res.headersSent) {
			res.status(err.status || 500);
			res.send({
				message: err.message,
				error: err
			});
		}
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: {}
		});
	}
});

/****************************************************************************
	Message Queue
*****************************************************************************/
app.use('/game/scoreboard', function() {
	// socket.io logic
	console.log("works");
	var url = "amqp://yuvzailr:H59aEL4rstxeP6nJm5Tzt71yeymhPOhM@elephant.rmq.cloudamqp.com/yuvzailr";
	amqp.connect(url, function (err, conn) {
		conn.createChannel(function (err, ch) {
		  var queue_name = "listen_for_goal";
		  ch.assertQueue(queue_name, { durable: false });
		  ch.consume(queue_name, function (msg) {
			console.log(msg.content.toString());
			io.sockets.emit("new-item", msg.content.toString());
		  }, { noAck: true });
		});
	});
});

app.use([apiRoute + 'queue/closeQueue'], function() {
	var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
	console.log(vcap_services);
	var uri = vcap_services["rabbitmq-36"][0].credentials.uri;
	console.log(uri);

	amqp.connect(uri, function(err, conn) {
		conn.close();
	});
});

httpServer.listen(process.env.VCAP_APP_PORT || 5000, function () {
	console.log ('Server started on port: ' + httpServer.address().port);
});

module.exports = app;
