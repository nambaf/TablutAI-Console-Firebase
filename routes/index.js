var express = require('express');
var router = express.Router();


var VISFunction = require("../VISFunction")


/* GET home page. */
router.get('/', function(req, res, next) {
      res.sendFile('interface.html', { root: path.join(__dirname, './public/') });
});

module.exports = router;
