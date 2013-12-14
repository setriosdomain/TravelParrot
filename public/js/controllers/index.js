angular.module('mean.system').controller('IndexController', ['$scope', 'Global','$location','Users', function ($scope, Global,$location,Users) {
    $scope.global = Global;
    var user = $scope.global.user;
    $scope.confCarousel ={};
    $scope.confCarousel.slides = [];

    $scope.confCarousel.slides.push({active: true,
        title: 'TELL ABOUT YOUR BUSINESS AND CORPORATE.',
        text:'We are Bootbusiness and we are awesome.We solve your technology problems by our awesome products.We are Bootbusiness and we are awesome.We solve your technology problems by our awesome products.',
        image: '/../img/bootbusiness/placeholder.jpg'});
    $scope.confCarousel.slides.push({title: 'TELL ABOUT YOUR NATURE OF WORK',
        text:'We are Bootbusiness and we design ultimate website applications.We are Bootbusiness and we design ultimate website applications.',
        image: '/../img/bootbusiness/placeholder.jpg'});
    $scope.confCarousel.slides.push({title: 'TELL ABOUT YOUR PRODUCT',
        text:'Get excited about our products.We build awesome products in mobile.We build awesome products in mobile.We build awesome products in mobile.',
        image: '/../img/bootbusiness/placeholder.jpg'});
    $scope.confCarousel.slides.push({title: 'TELL ABOUT YOUR ANOTHER PRODUCT',
        text:'Get excited about our products.We build awesome products in mobile.We build awesome products in mobile.We build awesome products in mobile.',
        image: '/../img/bootbusiness/placeholder.jpg'});
    $scope.confCarousel.interval = 10000;
    $scope.confCarousel.setActiveSlide = function(idx) {
        $scope.slides[idx].active=true;
    };

    $scope.getUserRecentEvents = function(){
        if(!user){return;}
        $.ajax({
            type: 'POST',
            url: '/getUserRecentEvents',
            data: {
                userId: user._id
            },
            dataType: 'json',
            success: function(events) {
                if(!events){return;}
                Global.safeApply($scope, function(){
                    $scope.userRecentEvents = events;
                });

            }
        });
    };
    $scope.getUserRecentEvents();

    $scope.getUserRecentArticles = function(){
        if(!user){return;}
        $.ajax({
            type: 'POST',
            url: '/getUserRecentArticles',
            data: {
                userId: user._id
            },
            dataType: 'json',
            success: function(articles) {
                if(!articles){return;}
                Global.safeApply($scope, function(){
                    $scope.userRecentArticles = articles;
                });

            }
        });
    };
    $scope.getUserRecentArticles();

    $scope.getRecentEvents = function(){
        if(!user){return;}
        $.ajax({
            url: '/getRecentEvents',
            success: function(events) {

                if(!events){return;}
                Global.safeApply($scope, function(){
                    $scope.recentEvents = events;
                });

            }
        });
    };
    $scope.getRecentEvents();

    $scope.getRecentArticles = function(){
        if(!user){return;}
        $.ajax({
            url: '/getRecentArticles',
            success: function(articles) {

                if(!articles){return;}
                Global.safeApply($scope, function(){
                    $scope.recentArticles = articles;
                });
            }
        });
    };
    $scope.getRecentArticles();


    $scope.articleSearch = function(){
        var input = $('#articleSearchInput').val();
        if(!input){
            $location.url('/articles');
            return;
        }
        $location.url('/articles/'+$.trim(input)+'/find');

    };
    $scope.eventSearch = function(){
        var input = $('#eventSearchInput').val();

        if(!input){
            $location.url('/events');
            return;
        }
        $location.url('/events/'+$.trim(input)+'/find');

    };
    $scope.findUsersNearby = function(){
        Users.get({
            userId: $scope.global.user._id
        }, function(userObj) {

            Global.getCurrentLocation(function(position){
                //position.coords.latitude, position.coords.longitude

                userObj.currentLocation={latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    date: new Date()};
                userObj.$update(function() {
                    $location.url('/users/'+user._id+'/nearby');
                });

        });





        });

    };


}]);