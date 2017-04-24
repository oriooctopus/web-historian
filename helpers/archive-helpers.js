var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var https = require('https');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, function(err, data) {
    if (err) {throw err;}
    callback(data.toString('utf-8').split('\n'));
  });

};

exports.isUrlInList = function(url, callback) {
  this.readListOfUrls((data) => {
    if (data.includes(url)) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  this.isUrlInList(url, (boolean) => {
    if (!boolean) {
      fs.writeFile(this.paths.list, url + '\n');
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(this.paths.archivedSites, function(err, data) {
    if (err) {throw err;}

    if (data.includes(url)) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach( (url) => {
    if (url !== '') {
      downloadUrl('http://' + url, url);
    }
  });
};

var downloadUrl = function(url, oldurl) {
  if (url.substring(0, 5) === 'https') {
    https.get(url, (res) => {
      if (Math.floor(res.statusCode / 10) * 10 === 300) {
        downloadUrl(res.headers.location, oldurl);
      } else {
        var rawData = '';
        res.on('data', (chunk) => { rawData += chunk });
        res.on('end', () => {
          console.log(oldurl);
          fs.writeFile(exports.paths.archivedSites + '/' + oldurl, rawData);
        });
      }
    });
  } else {
    http.get(url, (res) => {
      if (Math.floor(res.statusCode / 10) * 10 === 300) {
        downloadUrl(res.headers.location, oldurl);
      } else {
        var rawData = '';
        res.on('data', (chunk) => { rawData += chunk });
        res.on('end', () => {
          console.log(oldurl);
          fs.writeFile(exports.paths.archivedSites + '/' + oldurl, rawData);
        });
      }
    });
    
  }


  // if (url !== '') {
  //   http.get('http://' + url, (res) => {
  //     if (Math.floor(res.statusCode / 10) * 10 === 300 ) {
  //       console.log('this worked!!', res.headers.location);
  //       http.get(res.headers.location, (newRes) => {
  //         var rawData = '';
  //         newRes.on('data', (chunk) => { rawData += chunk });
  //         newRes.on('end', () => {
  //           fs.writeFile(this.paths.archivedSites + '/' + url, rawData);
  //         });

  //       });

  //     } else {
  //       var rawData = '';
  //       res.on('data', (chunk) => { rawData += chunk });
  //       res.on('end', () => {
  //         fs.writeFile(this.paths.archivedSites + '/' + url, rawData);
  //       });
  //     }
  //     // console.log('this is the status code', res.statusCode, res);
      
    // });
  // }
}