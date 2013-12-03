/**
 * Created by nicolaslarrea on 28/11/13.
 */
/*
//inject angular file upload directive.
angular.module('mean.fileUpload', ['angularFileUpload']);

var FileUploadCtrl = [ '$scope', '$upload', function($scope, $upload) {
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: 'upload',
                file: $file,
                progress: function(e){}
            }).then(function(data, status, headers, config) {
                    // file is uploaded successfully
                    if(!data.data){return;}
                    console.log('file uploaded: ' + data.data);
                    $scope.fileUploaded = {fileName: $file, fileServer: data.data};
                    //need to change this controller include it in the articles controoler
                    //the scope is local to view and the controller. the $scope.fileUploaded
                    //wont be available in the articles controller so we need to move this there
                    //they have differnt ids
                });
        }
    }
}];
*/