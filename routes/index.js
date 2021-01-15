var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/socket.io',(req, res, next)=>{
  console.log('Socket io oke');
  res.render('index', { title: 'Express' });
})

module.exports = router;
