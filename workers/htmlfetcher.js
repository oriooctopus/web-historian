// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

module.exports.addPendingUrls = function() {
  // read the txt file
  archive.readListOfUrls((urls) => {
    // download the urls
    archive.downloadUrls(urls);
    // clear the txt file
    // fs.writeFile(archive.paths.list, '');
  });
  
};

