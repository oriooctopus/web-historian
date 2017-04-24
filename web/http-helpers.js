var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // check if file is index
  if (asset === '/') {
    fs.readFile(archive.paths.siteAssets + '/index.html', (err, data) => {
      if (err) {console.log('error!', err);}

      res.end(data.toString('utf-8'));
    });
  } else {
    // check if file is in public directory
    fs.readdir(archive.paths.siteAssets, (err, files) => {
      console.log('this is the asset', asset.substring(1));
      if (files.includes(asset.substring(1))) {
        fs.readFile(archive.paths.siteAssets + asset, (err, file) => {
          if (err) console.log('error!', err);

          res.end(file.toString('utf-8'));
        }) 
      } else {
        archive.isUrlArchived(asset, (isArchived) => {
          if (isArchived) {
            fs.readFile(archive.paths.archivedSites + '/' + asset, (err, data) => {
              if (err) throw err;

              res.writeHead(200);
              res.end(data.toString('utf-8'));
            });
          } else {
            // redirect with loading page
            res.writeHead(302, {Location: '/loading.html'});
            res.end();
          }
        });

      }
    });
    
  }
    // if it does
      // serve it
    // if it doesn't
      // check if exists in txt file
        // if it does
          // check if it exists in directory
            // if it does
              // serve file
            // if it doesn't
              // serve loading page
        // if it doesn't
          // serve loading page
};



// As you progress, keep thinking about what helper functions you can put here!
