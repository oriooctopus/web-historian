var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!




exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    var statusCode = 200;
    res.writeHead(statusCode);
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
          res.writeHead(404);
          res.end('File not found');
        }
      });

    }
    
  } else if (req.method === 'POST') {
    res.writeHead(302);
    req.on('data', (data) => {
      archive.addUrlToList(data.toString('utf-8').substring(4), () => {
        res.end();
      });
    });

  } else {
    res.end(archive.paths.list);
  }




};
