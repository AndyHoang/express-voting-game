var express = require('express');
var router = express.Router();
var db = require('../database'),
  photos = db.photos,
  users = db.users;
/* GET home page. */

router.get('/', function(req, res, next) {
  console.log('ip: ' + req.ip);
  findPhoto(req, res, function(image_to_show) {
    res.render('home', {
      photo: image_to_show
    })
  })
});


router.post('/cute', insertUser, function(req, res, next) {
  var toSave = {
    likes: 1
  };
  vote.bind(null, toSave)(req, res, next);
})

router.post('/notcute', insertUser, function(req, res, next) {
  var toSave = {
    dislikes: 1
  };
  vote.bind(null, toSave)(req, res, next);
})

function insertUser(req, res, next) {

  users.insert({
    ip: req.ip,
    votes: []
  }, function(err, newUser) {
    next();
  })
}

function vote(toSave, req, res, next) {
  photos.find({
    name: req.body.photo
  }, function afterFinding(err, found) {
    if (found.length === 1) {
      photos.update(found[0], {
        $inc: toSave
      }, {
        upsert: true
      });
      users.update({
        ip: req.ip
      }, {
        $addToSet: {
          votes: found[0]._id
        }
      }, function() {
        res.redirect('../')
      });
    } else {

    }
  })
}

function findPhoto(req, res, callback) {
  photos.find({}, function(err, allPhotos) {

    users.find({
      ip: req.ip
    }, function(err, u) {
      var voted_on = [];
      if (u.length === 1) voted_on = u[0].votes;
      var not_voted_on = allPhotos.filter(function(photo) {
        return (voted_on.indexOf(photo._id) == -1);
      });
      var image_to_show = null;
      if (not_voted_on.length > 0) {
        image_to_show = not_voted_on[Math.floor(Math.random() * not_voted_on.length)]
      }
      callback(image_to_show);
    })
  })
}

module.exports = router;
