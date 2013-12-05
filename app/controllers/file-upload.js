var multiparty = require('multiparty')
    , fs = require('fs')
    , path = require('path');

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
                            if (err) throw err;
                            //res.redirect('/');
                            res.writeHead(200, {'content-type': 'text/plain'});
                            //res.write('received upload:\n\n' + path.basename(file.path));
                            res.end(path.basename(filePath));
                            //console.log('file uploaded to: '+ newPath);

                            //delete tmp server file
                            fs.unlink(filePath, function (err) {
                                if (err) throw err;
                                console.log('deleted' + filePath);
                            });
                            //delete tmp server file
                        });
                    };

                    path.exists(uploadPath, function(exists) {
                    if(!exists){
                          var mkdirp = require('mkdirp');
                          mkdirp(uploadPath, function(err) {
                              if (err) throw err;
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