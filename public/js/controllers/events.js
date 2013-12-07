angular.module('mean.events').controller('EventsController', ['$scope', '$upload', '$routeParams', '$location' ,'Global','Events', function ($scope, $upload, $routeParams, $location, Global, Events) {
    $scope.global = Global;

    $scope.create = function() {
        if(typeof $scope.file_url == 'undefined'){ $scope.file_url = '';}
        var event = new Events({
            title: this.title,
            file_url:  $scope.file_url,
            content: this.content

        });
        event.$save(function(response) {
            $location.path("events/" + response._id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.eventsHome = function () {
        $location.url('/events/');
    };
    $scope.remove = function() {
        var event = $scope.event;

        event.$remove(function(){

            for (var i in $scope.events) {
                if ($scope.events[i] == article) {
                    $scope.events.splice(i, 1);
                }
            }

            $location.path("events/");
        });



    };

    $scope.update = function() {
        if(typeof $scope.file_url == 'undefined'){ $scope.file_url = '';}
        var event = $scope.event;
        if (!event.updated) {
            event.updated = [];
        }
        event.updated.push(new Date().getTime());
        event.file_url = $scope.file_url;

        event.$update(function() {
            $location.path('events/' + event._id);
        });
    };


    $scope.find = function() {
        Events.query(function(events) {
            $scope.events = events;
            //pager
            $scope.confPagination.totalItems = $scope.events.length;
            //pager
        });


    };

    $scope.findOne = function() {
        Events.get({
            eventId: $routeParams.eventId
        }, function(event) {
            $scope.event = event;
            $scope.file_url = event.file_url;
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

    $scope.showImage = function(event){
        if(!event){return false;}
        return event.file_url != '';
    }
}]);