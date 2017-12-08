var path = require("path");
var express = require("express")
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var _ = require("underscore");

router.use(bodyParser.json());
const gameObj = require(path.resolve(__dirname, '../data/game.json'));

// ////////////////////////////////////////////////////////////////////////
// GET
// ////////////////////////////////////////////////////////////////////////

router.get(['/'], function(req, res) {
  res.send(gameObj);
});

router.get(['/numPlayers'], function(req, res) {
  res.send({numPlayers: gameObj.game.numPlayers});
});

router.get(['/type'], function(req, res) {
  res.send({type: gameObj.game.type});
});

router.get(['/blackPlayers'], function(req, res) {
  res.send({blackPlayers: gameObj.game.blackPlayers});
});

router.get(['/yellowPlayers'], function(req, res) {
  res.send({yellowPlayers: gameObj.game.yellowPlayers});
});

router.get(['/blackScore'], function(req, res) {
  res.send({blackScore: gameObj.game.blackScore});
});

router.get(['/yellowScore'], function(req, res) {
  res.send({yellowScore: gameObj.game.yellowScore});
});

router.get(['/gameInProgress'], function(req, res) {
  res.send({gameInProgress: gameObj.game.gameInProgress});
});

// ////////////////////////////////////////////////////////////////////////
// PUT
// ////////////////////////////////////////////////////////////////////////

router.put(['/'], function(req, res) { 
  if (req.body.game != undefined) {
    let updateGameObj = gameObj;
    updateGameObj.game = req.body.game;
    fs.writeFile(path.resolve(__dirname, '../data/game.json'), JSON.stringify(updateGameObj, null, 2), function (err) {
      if (err) {
        console.log(err);
        res.json({status: 202});
      } else {
        res.json({status: 200})
      }
    });
  } else {
    res.json({status: 202}); 
  }
});

// TODO
router.put(['/numPlayers'], function(req, res) { 
  console.log("todo");
});

// TODO
router.put(['/type'], function(req, res) {
  console.log("todo");
});

// TODO
router.put(['/blackPlayers'], function(req, res) {
  console.log("todo");
});

// TODO
router.put(['/yellowPlayers'], function(req, res) {
  console.log("todo");
});

// TODO
router.put(['/updateBlackScore'], function(req, res) {
  if (req.body.value != undefined) {
    let updateGameObj = gameObj;
    updateGameObj.game.blackScore = parseInt(gameObj.game.blackScore  + req.body.value);
    fs.writeFile(path.resolve(__dirname, '../data/game.json'), JSON.stringify(updateGameObj, null, 2), function (err) {
      if (err) {
        console.log(err);
        res.json({status: 202});
      } else {
        res.json({status: 200})
      }
    });
  } else {
    res.json({status: 202}); 
  }
});

// TODO
router.put(['/updateYellowScore'], function(req, res) {
  console.log("todo");
});

// TODO
router.put(['/gameInProgress'], function(req, res) {
  console.log("todo");
});

module.exports = router;