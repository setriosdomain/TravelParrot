angular.module('mean.users').controller('UsersController', ['$scope', '$upload', '$routeParams', '$location' ,'Global','Users','$http', function ($scope, $upload, $routeParams, $location, Global, Users, $http) {
    $scope.global = Global;


    $scope.usersHome = function () {
        $location.url('/users/');
    };
    $scope.remove = function() {
        var user = $scope.user;
        user.$remove(function(){
            for (var i in $scope.users) {
                if ($scope.users[i] == user) {
                    $scope.users.splice(i, 1);
                }
            }
            $http.get('/signout')
                .success(function (data, status, headers, config) {
                    //TODO: check not redirecting tested in firefox only.
                    $location.path('/');
                })
                .error(function (data, status, headers, config) {
                    alert("Dang It!" + status);
                });

        });




        //$http.get('/signout');
        //$location.path("/signout");



    };

    $scope.update = function() {
        if(typeof $scope.file_url == 'undefined'){ $scope.file_url = '';}
        var user = $scope.user;
        if (!user.updated) {
            user.updated = [];
        }
        user.updated.push(new Date().getTime());
        user.picture = $scope.file_url;

        user.$update(function() {
            $location.path('users/' + user._id);
        });
    };


    $scope.find = function() {
        Users.query(function(users) {
            $scope.users = users;
            //pager
            $scope.confPagination.totalItems = $scope.users.length;
            //pager
        });


    };

    $scope.findOne = function() {
        Users.get({
            userId: $routeParams.userId
        }, function(user) {
            $scope.user = user;
            $scope.file_url = user.picture;
        });
    };


    //start => pagination
    $scope.confPagination = {};
    $scope.confPagination.maxSize = 5;
    $scope.confPagination.pageSize = 10;

    $scope.confPagination.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.confPagination.currentPage = 1;
    $scope.confPagination.boundaryLinks = true;
    //end => pagination

    //start file upload
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
                    //console.log('file uploaded: ' + data.data);
                    $scope.file_url = data.data;
                });
        }
    };
    //end file upload
    $scope.clearImage = function(){
        $scope.file_url = '';
    };

    $scope.showImage = function(user){
        if(!user){return false;}
        return user.picture != '';
    }
}]);