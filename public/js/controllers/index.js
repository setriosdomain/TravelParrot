angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
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
                $scope.$apply(function(){
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
                $scope.$apply(function(){
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
                $scope.$apply(function(){
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
                $scope.$apply(function(){
                    $scope.recentArticles = articles;
                });
            }
        });
    };
    $scope.getRecentArticles();




}]);