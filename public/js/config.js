//Setting up route
window.app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        //articles
        when('/articles/:name/find', {
                templateUrl: 'views/articles/list.html',
                controller: 'ArticlesController'
        }).
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
        when('/events/:name/find', {
                templateUrl: 'views/events/list.html',
                controller: 'EventsController'
        }).
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
        //users
        when('/users/:name/find', {
                templateUrl: 'views/users/list.html',
                controller: 'UsersController'
            }).
        when('/users/:userId/nearby', {
                templateUrl: 'views/users/nearby.html',
                controller: 'UsersController'
        }).
        when('/users', {
                templateUrl: 'views/users/list.html',
                controller: 'UsersController'
        }).
        when('/users/:userId/edit', {
                templateUrl: 'views/users/edit.html',
                controller: 'UsersController'
        }).
        when('/users/:userId/changePassword', {
                templateUrl: 'views/users/change-password.html',
                controller: 'UsersController'
        }).
        when('/users/:userId/delete', {
                templateUrl: 'views/users/delete.html',
                controller: 'UsersController'
        }).
        when('/users/:userId', {
                templateUrl: 'views/users/view.html',
                controller: 'UsersController'
        }).
        //users
        when('/faq/', {
                templateUrl: 'views/faq.html'
        }).
            //messages
            when('/messages/:name/find', {
                templateUrl: 'views/messages/list.html',
                controller: 'MessagesController'
            }).
            when('/messages', {
                templateUrl: 'views/messages/list.html',
                controller: 'MessagesController'
            }).
            when('/messages/create', {
                templateUrl: 'views/messages/create.html',
                controller: 'MessagesController'
            }).
            when('/messages/:messageId/edit', {
                templateUrl: 'views/messages/edit.html',
                controller: 'MessagesController'
            }).
            when('/messages/:messageId/delete', {
                templateUrl: 'views/messages/delete.html',
                controller: 'MessagesController'
            }).
            when('/messages/:messageId', {
                templateUrl: 'views/messages/view.html',
                controller: 'MessagesController'
            }).
        //home
        when('/', {templateUrl: 'views/index.html',
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