angular.module('mean.system').controller('HeaderController', ['$scope', 'Global','$location', function ($scope, Global,$location) {
    $scope.global = Global;

    $scope.menu = [
    {
        "title": "Posts",
        "link": "articles",
        "submenu":     [
            {
                "title": "List Posts",
                "link": "articles"
            },
            {
            "title": "Create New Post",
            "link": "articles/create"
            }
            ]
    },
    {
        "title": "Events",
        "link": "events",
        "submenu": [
            {
                "title": "List Events",
                "link": "events"
            },
            {
            "title": "Create New Event",
            "link": "events/create"
           }
            ]
    }
    ];
    
    $scope.isCollapsed = false;

    $scope.userSearch = function(){

        var input = $('#userSearchInput').val();
        if(!input){
            $location.url('/users/');
            return;
        }
        $location.url('/users/'+$.trim(input)+'/find');

    };
}]);