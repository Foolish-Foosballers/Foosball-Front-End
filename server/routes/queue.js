var path = require("path");
var express = require("express")

var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var _ = require("underscore");
var amqp = require('amqplib/callback_api');
var request = require('request');
var io = require("../app");

router.use(bodyParser.json());
const gameObj = require(path.resolve(__dirname, '../data/game.json'));
var node_env = process.env.node_env || 'development';

// ////////////////////////////////////////////////////////////////////////
// GET
// ////////////////////////////////////////////////////////////////////////

router.get(['/startQueue'], function(req, res) {
    if (gameObj.game.gameInProgress) {
        establishConnection();
        console.log("establishing");
    }
});

function establishConnection() {
	var url = "amqp://yuvzailr:H59aEL4rstxeP6nJm5Tzt71yeymhPOhM@elephant.rmq.cloudamqp.com/yuvzailr";
	amqp.connect(url, function (err, conn) {
        console.log("connected");
		if (err !== null) {
            console.log(err);
        }         
        else {
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
}

// /**
//  * Clear all leftover data in the queue
//  */
// app.use([apiRoute + 'queue/clearSocket'], function() {
	// console.log("TODO");
// });

/**
 * Update the score of a foosball player
 * 
 * @param {* string} val player who's score should be update. 1 = black; 2 = yellow
 */
function updatePlayerScore(val) {
    let url = "";
    if (node_env === 'development') {
      url = "http://localhost:5000/api/v1/game/update";
    } else {
      url = "https://foosball-front-end.run.asv-pr.ice.predix.io/api/v1/game/update";
    }

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
                console.log("Emit the message");
                io.io.sockets.emit("update-game-object", '3');
			}
		});	
    }
}

module.exports = router;