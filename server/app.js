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
var io = require("socket.io")(httpServer);
var path = require('path');
var request = require('request');
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
	Routes
*****************************************************************************/
// Import the routes
var gameRouter = require('./routes/game.js');

// Use the routes
app.use([apiRoute + 'game/'], gameRouter);

/****************************************************************************
	Message Queue
*****************************************************************************/
/**
 * Clear all leftover data in the queue
 */
app.use([apiRoute + 'queue/clearSocket'], function() {
	console.log("TODO");
});

/**
 * Update the score of a foosball player
 * 
 * @param {* string} val player who's score should be update. 1 = black; 2 = yellow
 */
function updatePlayerScore(val) {
	let url = "http://localhost:5000/api/v1/game/update";

	switch (val) {
		case "1":
			url = url + "BlackScore"
			break;
		case "2":
			url = url + "YellowScore"
			break;
		default:
			url = null
			break;
	}	

	if (url !== null) {
		request.put({
			url: url,
			method: "PUT",
			json: {
				value: 1
			}
		}, function(error, response, body) {
			if (error !== undefined || error !== null) {
				io.sockets.emit("update-game-object", '3');
			}
		});	
	}
}

/**
 * Start socket.io and start listening for requests
 */
app.use([apiRoute + 'queue/startSocket'], function() {
	var url = "amqp://yuvzailr:H59aEL4rstxeP6nJm5Tzt71yeymhPOhM@elephant.rmq.cloudamqp.com/yuvzailr";
	amqp.connect(url, function (err, conn) {
		if (err !== null) {
			console.log(err);
		} else {
			conn.createChannel(function (err, ch) {
				ch.assertExchange("goalScored", 'fanout', {durable:false});
				ch.assertQueue('', { exclusive: true }, function(err, q) {
					ch.bindQueue(q.queue, "goalScored", ''); // bind queue to goalScored exchange
					ch.consume(q.queue, function(msg) { 
						updatePlayerScore(msg.content.toString());
					}, { noAck: true });
				});
			});
		}
	});
});

/**
 * Close socket.io and stop listening for requests
 */
app.use([apiRoute + 'queue/startSocket'], function() {
	console.log('TODO');
});

httpServer.listen(process.env.VCAP_APP_PORT || 5000, function () {
	console.log ('Server started on port: ' + httpServer.address().port);
});

module.exports = app;
