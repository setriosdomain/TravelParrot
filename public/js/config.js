//Setting up route
window.app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        //articles
        when('/articles', {
            templateUrl: 'views/articles/list.html',
            controller: 'ArticlesController'
        }).
        when('/articles/create', {
            templateUrl: 'views/articles/create.html',
            controller: 'ArticlesController'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'views/articles/edit.html',
            controller: 'ArticlesController'
        }).
        when('/articles/:articleId/delete', {
            templateUrl: 'views/articles/delete.html',
            controller: 'ArticlesController'
        }).
        when('/articles/:articleId', {
            templateUrl: 'views/articles/view.html',
            controller: 'ArticlesController'
        }).
        //events
        when('/events', {
                templateUrl: 'views/events/list.html',
                controller: 'EventsController'
        }).
        when('/events/create', {
                templateUrl: 'views/events/create.html',
                controller: 'EventsController'
        }).
        when('/events/:eventId/edit', {
                templateUrl: 'views/events/edit.html',
                controller: 'EventsController'
        }).
        when('/events/:eventId/delete', {
                templateUrl: 'views/events/delete.html',
                controller: 'EventsController'
        }).
        when('/events/:eventId', {
                templateUrl: 'views/events/view.html',
                controller: 'EventsController'
        }).
        //home
        when('/', {
            templateUrl: 'views/index.html',
            controller: 'IndexController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);