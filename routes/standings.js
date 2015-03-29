var express = require('express');
var router = express.Router();
var db = require('../database'),
  photos = db.photos,
  users = db.users;
/* GET users listing. */
router.get('/', function(req, res, next) {
  photos.find({}, function(err, allPhotos) {
    allPhotos.sort(function(p1, p2) {
      return (p2.likes - p2.dislikes) - (p1.likes - p1.dislikes);
    })
    res.render('standings', {
      standings: allPhotos
    });
  })
});


module.exports = router;
