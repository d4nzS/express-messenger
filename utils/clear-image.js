const fs = require('fs');
const path = require('path');

function clearImage(imagePath) {
  fs.unlink(path.join(__dirname, '..', imagePath), err => console.log(err));
}

module.exports = clearImage;