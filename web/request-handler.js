var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
var htmlFetcher = require('../../workers/htmlFetcher.js');
// require more modules/folders here!




exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    var statusCode = 200;
    res.writeHead(statusCode, httpHelpers.headers);
    if (req.url === '/') {
      fs.readFile(__dirname + '/public/index.html', (err, data) => {
        if (err) {console.log('error!', err);}

        res.end(data.toString('utf-8'));
      });
    } else {

      archive.isUrlArchived(req.url.substring(1), (boolean) => {
        if (boolean) {
          fs.readFile(archive.paths.archivedSites + req.url, (err, data) => {
            if (err) {console.log('error!', err);}

            res.end(data.toString('utf-8'));
          });
        } else {
          console.log('File not found');
          res.writeHead(404, httpHelpers.headers);
          res.end('File not found');
        }
      });

    }
    
  } else if (req.method === 'POST') {
    res.writeHead(302, httpHelpers.headers);
    req.on('data', (data) => {
      var url = data.toString('utf-8').substring(4);
      console.log(url);
      //check if page is in archive
        //if yes redirect to page 
      //else check if page is in list
        // redirect to loading page
      // else
        // add to list
        // redirect to loading page
        // get the page

        archive.addUrlToList(url, (boolean) => {
          fs.readFile(archive.paths.archivedSites + url, (err, data) => {
            res.end(data);
          });
        });
    });

  } else {
    res.end(archive.paths.list);
  }


};
