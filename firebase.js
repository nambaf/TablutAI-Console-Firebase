// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");
var express = require('express')
var router = express.Router()

var trainingDB = require("./DBFunctions")

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database")
require("vis")

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "tablutdb",
  storageBucket: "",
  messagingSenderId: "73375691110",
  appId: "1:73375691110:web:c1af36c71df568c9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

router.get('/find_mcts_tree', function(req, res) {
  //var turn = req.query.t.replace("item_car_", "");
  trainingDB.find_mcts_turn(firebase, req.query.it, req.query.m, req.query.t, res) 
});

router.get('/find_training_iteration', function (req, res) {
  trainingDB.find_training_iterations(firebase, res);
});

router.get('/explore_iteration', function (req, res) {
  trainingDB.find_training_specific_iteration(firebase, req.query.it, res)
});

router.get('/find_training_match', function (req, res) {
  trainingDB.find_training_specific_match(firebase,req.query.it,req.query.m, res)
});

router.get('/find_training_turns', function (req, res) {
  trainingDB.find_training_turns(firebase,req.query.it,req.query.m, res)
});

module.exports = router;