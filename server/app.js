'use strict';
/*******************************************************
The predix-webapp-starter Express web application includes these features:
  * routes to mock data files to demonstrate the UI
  * passport-predix-oauth for authentication, and a sample secure route
  * a proxy module for calling Predix services such as asset and time series
*******************************************************/
var http = require('http'); // needed to integrate with ws package for mock web socket server.
var express = require('express');
var path = require('path');
var app = express();
var httpServer = http.createServer(app);
var amqp = require('amqplib/callback_api');
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

app.use(express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../public')));

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
app.use([apiRoute + 'queue/initializeQueue'], function() {
	var url = process.env.VCAP_SERVICES['rabbitmq-36'][0].credentials.url;
	console.log(url);

	amqp.connect(url, function(err, conn) {
		console.log(err);
		console.log(conn);
		// conn.createChannel(function(err, ch) {
		// 	var q = "first_q";
		// 	var msg = "Hello world!";
		// 	ch.assertQueue(q, {durable: false});
		// 	setInterval(function() {
		// 		ch.sendToQueue(q, Buffer.from(msg));
		// 	}, 2000);
		// });
	});
});

httpServer.listen(process.env.VCAP_APP_PORT || 5000, function () {
	console.log ('Server started on port: ' + httpServer.address().port);
});

module.exports = app;
