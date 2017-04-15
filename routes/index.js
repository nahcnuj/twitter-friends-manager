var express = require('express');
var router = express.Router();

/* GET / */
router.get('/',
  (req, res, next) => {
    if (req.session.oauth === undefined) {
      res.render('login');
    }
    else {
      res.render('index', {msg: req.query.msg});
    }
  });

module.exports = router;
