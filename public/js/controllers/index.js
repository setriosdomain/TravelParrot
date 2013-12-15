angular.module('mean.system').controller('IndexController', ['$scope', 'Global','$location','Users', function ($scope, Global,$location,Users) {
    $scope.global = Global;
    var user = $scope.global.user;
    $scope.confCarousel ={};
    $scope.confCarousel.slides = [];

    $scope.confCarousel.slides.push({active: true,
        title: 'WELCOME TO TRAVEL PARROT',
        text:'Connect with travelers all around the world. Meet visiting travelers & locals at events in your area, get travel tips, discuss your interests, and have fun!',
        image: '/../img/carousel/1.jpg'});
    $scope.confCarousel.slides.push({title: 'REDISCOVER YOUR CITY',
        text:'There’s a community of just about enything you can think of. Many cities have weekly language exchanges, dance classes, hikes and dinners. Make new friends.',
        image: '/../img/carousel/2.jpg'});
    $scope.confCarousel.slides.push({title: 'JOIN AN EVENT',
        text:'Join an event - Events around the UK including challenge walks, marathons, skydives, patomime, polo matches aerobics class and more.',
        image: '/../img/carousel/3.jpg'});
    $scope.confCarousel.slides.push({title: 'ABOUT US',
        text:'We envision a world made better by travel and travel made richer by connection. Travelers share their lives with the people they encounter, fostering cultural exchange and mutual respect.',
        image: '/../img/carousel/4.jpg'});
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