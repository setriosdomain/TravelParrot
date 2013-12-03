var multiparty = require('multiparty')
    , fs = require('fs')
    , path = require('path')
    , util = require('util')

/**
 * Create a article
 */
exports.serverFileUpload = function(req, res) {
    if (req.url === '/upload' && req.method === 'POST') {
        // parse a file upload
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {


            if(!files || !files.file){return;}
            for (var i = 0; i < files.file.length; i++) {
                var file = files.file[i];

                fs.readFile(file.path, function (err, data) {
                    var uploadPath = __dirname + "/../../public/uploads/";

                    var writeToUploadDir = function(filePath){
                        var newPath = uploadPath + path.basename(filePath);
                        fs.writeFile(newPath, data, function (err) {
                            //res.redirect('/');
                            res.writeHead(200, {'content-type': 'text/plain'});
                            //res.write('received upload:\n\n' + path.basename(file.path));
                            res.end(path.basename(filePath));
                            //console.log('file uploaded to: '+ newPath);
                        });
                    };

                    path.exists(uploadPath, function(exists) {
                    if(!exists){
                          var mkdirp = require('mkdirp');
                          mkdirp(uploadPath, function(err) {
                              // path was created unless there was error
                              writeToUploadDir(file.path);

                          });
                    } else{ writeToUploadDir(file.path);}


                    });

                });
            }

        });

        return;

    }
}