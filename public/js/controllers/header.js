angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [
    {
        "title": "Articles",
        "link": "articles",
        "submenu":     [
            {
                "title": "List Articles",
                "link": "articles"
            },
            {
            "title": "Create New Article",
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
}]);