var DB = require('nedb'),
  fs = require('fs');

var photos = new DB({
    filename: __dirname + '/data/photos',
    autoload: true
  }),
  users = new DB({
    filename: __dirname + '/data/users',
    autoload: true
  });

photos.ensureIndex({
  fieldName: 'name',
  unique: true,
  sparse: true
});
users.ensureIndex({
  fieldName: 'ip',
  unique: true,
  sparse: true
});
var photos_on_disk = fs.readdirSync(__dirname + '/public/images/photos');


photos_on_disk.forEach(function(photo) {
  photos.insert({
    name: photo,
    likes: 0,
    dislikes: 0
  });
});

// photo: {name,likes,dislike}
// user: {ip}

module.exports = {
  photos: photos,
  users: users
};
