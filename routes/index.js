var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.sendFile("D:/WEB_develop/public//html/home.html");
});

module.exports = router;
