angular.module('mean.messages').controller('MessagesController', ['$scope', '$routeParams', '$location' ,'Global','Messages','Users', function ($scope, $routeParams, $location, Global, Messages, Users) {
    $scope.global = Global;
    $scope.val_act ="";

    $scope.create = function() {

        if($('#user2').val()=="" || $scope.formCommentText == "") return;

        var val = $('#user2').val();
        var xyz = $('#comicstitle option').filter(function() {
            return this.value == val;
        }).data('xyz');


        if(!xyz) return;


        var message = new Messages({
            user2: xyz
        });

        message.$save(function(response) {

            var pictureFile = '';
            if(!Global.user.picture || Global.user.picture ==''){
                pictureFile = "img/user_placeholder.png";
            }
            else{
                pictureFile = "/uploads/"+Global.user.picture;
            }
            var newComment = {
                body: $scope.formCommentText,
                date: new Date(),
                user: Global.user._id,
                file_url: pictureFile
            };

            $.ajax({
                type: 'POST',
                url: '/addMessageComment',
                data: {
                    messageId: response._id,
                    comment: newComment
                },
                dataType: 'json',
                success: function(data) {
                    Global.safeApply($scope, function(){
                        $scope.message.comments.push(newComment);//for view purpose only
                    });
                }
            });

            $location.path("messages/" + response._id);
        });
    };

    $scope.messagesHome = function () {
        $location.url('/messages/');
    };
    $scope.remove = function() {
        var message = $scope.message;

        //http://docs.angularjs.org/api/ngResource.$resource
        //        A resource "class" object with methods for the default set of resource actions optionally extended with custom actions. The default set contains these actions:
        //
        //        { 'get':    {method:'GET'},
        //            'save':   {method:'POST'},
        //            'query':  {method:'GET', isArray:true},
        //            'remove': {method:'DELETE'},
        //            'delete': {method:'DELETE'} };
        //calling remove will make a DEL request which will intercepted
        //by app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);
        //in the routes configuration of the server. This will call the destroy function in the controller if authorized
        //and the destroy function will invoke remove method on moongoose model, which will elete the object from the database
        //and if successfull call of callback, which will rediret to articles (which will be intercepter by the server routing again yielding all articles), and intercepter on the client side by angular which will render the right view which will display all articles.
        message.$remove(function(){

            for (var i in $scope.messages) {
                if ($scope.messages[i] == message) {
                    $scope.messages.splice(i, 1);
                }
            }

            $location.path("messages/");
        });



    };

    $scope.update = function() {
        var message = $scope.message;
        if (!message.updated) {
            message.updated = [];
        }
        message.updated.push(new Date().getTime());
        message.comments.length = 0;
        for(var index =0; index < $scope.editModeComments.length; index++){
            if($scope.editModeComments[index]){
                message.comments.push($scope.editModeComments[index]);
            }
        }
        message.$update(function() {
            $location.path('messages/' + message._id);
        });
    };


    $scope.find = function() {
        if(!$routeParams.name){
            Messages.query(function(messages) {
                $scope.messages = messages;
                $scope.InitializeEventData2();
                //pager
                $scope.confPagination.totalItems = $scope.messages.length;
                //pager
            });
        }else{
            $.ajax({
                type: 'POST',
                url: '/queryMessages',
                data: {
                    name: $routeParams.name
                },
                dataType: 'json',
                success: function(messages) {
                    $scope.$apply(function(){
                        $scope.messages = messages;
                        //pager
                        $scope.confPagination.totalItems = $scope.messages.length;
                        //pager
                    });
                }
            });

        }
    };

    $scope.findOne = function() {
        Messages.get({
            messageId: $routeParams.messageId
        }, function(message) {
            $scope.message = message;

            $scope.InitializeEventData();
        });



    };
    $scope.getName = function() {

        //alert("llega a getU")
        Users.get({
            userId: $scope.global.user._id
            //userId: hola
        }, function(user) {
            if(!user){return;}
            Global.safeApply($scope, function(){

                $scope.val_act = user.name;

            });
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

    $scope.showImage = function(message){
        if(!message){return false;}
        return message.file_url != '';
    };

    $scope.InitializeEventData2 = function(){
        if(!$scope.messages){return;}

        for(var i in $scope.messages)
        {
            $scope.fillPicture2($scope.messages[i]);
        }


    };

    $scope.InitializeEventData = function(){
        if(!$scope.message){return;}
        $scope.file_url = $scope.message.file_url;
        $scope.setWith();
                $scope.loadComments();
    };

    //comments
    $scope.setWith = function(){

        if($scope.message.user._id == Global.user._id)
            $scope.message["with"] =  $scope.message.user2.name;
        else
            $scope.message["with"] =  $scope.message.user.name;
    };



    //comments
    $scope.loadComments = function(){
        if(!$scope.message.comments){
            $scope.message.comments = [];
        }
        for(var i in $scope.message.comments){
            $scope.fillPicture($scope.message.comments[i]);
        }
        $scope.editModeComments = $scope.message.comments.slice();//shallow copy

    };
    $scope.fillPicture = function(comment){
        if(!comment || !comment.user/*userId*/){return;}
        Users.get({
            userId: comment.user
        }, function(user) {
            if(!user){return;}
            Global.safeApply($scope, function(){
                if(!user.picture || user.picture ==''){
                    comment.file_url = "img/user_placeholder.png";
                }
                else{
                    comment.file_url = "/uploads/"+user.picture;
                }

                comment["uname"] = user.name;

            });
        });
    };
    $scope.fillPicture2 = function(message){

        var iduser;
        if(message.user._id == Global.user._id)
        {
            message["with"] =  message.user2.name;
            iduser = message.user2._id;
        }
        else
        {
            message["with"] =  message.user.name;
            iduser = message.user._id;
        }
        Users.get({
            userId: iduser
        }, function(user) {
            if(!user){return;}
            Global.safeApply($scope, function(){
                if(!user.picture || user.picture ==''){
                    message.file_url = "img/user_placeholder.png";
                }
                else{
                    message.file_url = "/uploads/"+user.picture;
                }

            });
        });



    };

    $scope.getUsers = function() {

        $.ajax({
            type: 'POST',
            url: '/getAllUsers',
            dataType: 'json',
            success: function(data) {
                Global.safeApply($scope, function(){

                    $scope.list_users = data;

                });
            }
        });


    }

    $scope.addComment = function(){

        var pictureFile = '';
        if(!Global.user.picture || Global.user.picture ==''){
            pictureFile = "img/user_placeholder.png";
        }
        else{
            pictureFile = "/uploads/"+Global.user.picture;
        }
       // var uname = +Global.user.name;
        var newComment = {
            body: $scope.formCommentText,
            date: new Date(),
            user: Global.user._id,
            file_url: pictureFile
        };

        $.ajax({
            type: 'POST',
            url: '/addMessageComment',
            data: {
                messageId: $scope.message._id,
                created: new Date(),
                comment: newComment
            },
            dataType: 'json',
            success: function(data) {
                Global.safeApply($scope, function(){
                    newComment["uname"] = Global.user.name;
                    $scope.message.comments.push(newComment);//for view purpose only

                    //$scope.message.comments.push(newComment);//for view purpose only

                });
            }
        });

        $scope.formCommentText = '';
    };
    $scope.removeComment = function(index){
        delete $scope.editModeComments[index];
    };
    $scope.gotoNew = function(index){
        $location.path("messages/create");
    };



    //comments
}]);