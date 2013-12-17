angular.module('mean.users').controller('UsersController', ['$scope', '$upload', '$routeParams', '$location' ,'Global','Users','$http','SignoutService', function ($scope, $upload, $routeParams, $location, Global, Users, $http, SignoutService) {
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
            SignoutService.signout().success(function (data, status, headers, config) {
                window.user = null;
                Global.user = null;
                Global.authenticated = null;
                $location.path('/');//fix and remove this.
            });


        });

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
        if(!$routeParams.name)
        {
            Users.query(function(users) {

                $scope.users = users;
                //pager
                $scope.confPagination.totalItems = $scope.users.length;
                //pager
            });
        }else{
            $.ajax({
                type: 'POST',
                url: '/queryUsers',
                data: {
                    name: $routeParams.name
                },
                dataType: 'json',
                success: function(users) {
                    //$scope.$apply(function(){
                    Global.safeApply($scope, function(){
                        $scope.users = users;
                        //pager
                        $scope.confPagination.totalItems = $scope.users.length;
                        //pager
                    });
                }
            });
        }
    };

    $scope.findOne = function() {
        Users.get({
            userId: $routeParams.userId
        }, function(user) {
            $scope.user = user;
            $scope.file_url = user.picture;
            $scope.changePasswordFields.oldPasswordEnc = user.hashed_password;
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
    $scope.changePasswordFields = {
        oldPasswordEnc: '',
        oldPasswordConfirm: '',
        oldPasswordEncConfirm: '',
        password: '',
        passwordConfirm: ''
    };
    $scope.updatePassword = function(){
        var pswrds = $scope.changePasswordFields;
        if(!pswrds.oldPasswordEnc){return;}
        if(!pswrds.oldPasswordConfirm){return;}
        if(!pswrds.password){return;}
        if(!pswrds.passwordConfirm){return;}
        if(pswrds.password != pswrds.passwordConfirm){return;}
        if(pswrds.oldPasswordEnc != pswrds.oldPasswordEncConfirm){return;}
        //
        $.ajax({
            type: 'POST',
            url: '/enc',
            data: {
                salt: $scope.user.salt,
                data: pswrds.password
            },
            dataType: 'json',
            success: function(data) {
                //console.log('result ajax call:' + data);
                $scope.user.hashed_password_confirm = pswrds.oldPasswordEnc;
                $scope.user.hashed_password = data;
                $scope.update();
                $location.path('passwordChanged/');
            }
        });


        $scope.changePasswordFields={};

    }
    $scope.passwordChangeRequestUpdate = function(newPassword){

        newPassword = $scope.changePasswordFields.oldPasswordConfirm;

            $.ajax({
                type: 'POST',
                url: '/enc',
                data: {
                    salt: $scope.user.salt,
                    data: newPassword
                },
                dataType: 'json',
                success: function(data) {
                    //console.log('result ajax call:' + data);
                    $scope.changePasswordFields.oldPasswordEncConfirm = data;
                }
            });

    };
    $scope.findNearby = function(){
        if(!$routeParams.userId){return;}
        //maxDistance in meters
        $.ajax({
            type: 'POST',
            url: '/getUsersNearby/',
            data: {
                userId: $routeParams.userId,
                maxDistance: 100000
            },
            dataType: 'json',
            success: function(users) {

                if(!users){return;}
                Global.safeApply($scope, function(){
                    $scope.users = users;
                    //pager
                    $scope.confPagination.totalItems = $scope.users.length;
                    //pager
                });

            }
        });
    };
}]);