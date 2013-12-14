var async = require('async');

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);



    //Setting up the users api
    app.get('/users', auth.requiresLogin, users.all);
    app.post('/users', users.create);
    app.put('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.update);
    app.del('/users/:userId', auth.requiresLogin, auth.user.hasAuthorization, users.destroy);

    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    app.get('/users/me', users.me);
    app.get('/users/:userId', users.show);

    //$ ajax calls
    app.post('/enc',auth.requiresLogin, users.getEncPassword);
    app.post('/queryUsers',auth.requiresLogin, users.queryUsers);
    app.post('/getUsersNearby',auth.requiresLogin, users.getUsersNearby);


    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Article Routes
    var articles = require('../app/controllers/articles');
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);
    app.post('/queryArticles', auth.requiresLogin, articles.queryArticles);
    app.post('/addArticleComment', auth.requiresLogin, articles.addComment);

    //Finish with setting up the articleId param
    app.param('articleId', articles.article);
    //file uploads
    var fileUpload = require('../app/controllers/file-upload');
    app.post('/upload', auth.requiresLogin, fileUpload.serverFileUpload);

    //Event Routes
    var events = require('../app/controllers/events');
    app.get('/events', events.all);
    app.post('/events', auth.requiresLogin, events.create);
    app.get('/events/:eventId', events.show);
    app.put('/events/:eventId', auth.requiresLogin, auth.event.hasAuthorization, events.update);
    app.del('/events/:eventId', auth.requiresLogin, auth.event.hasAuthorization, events.destroy);
    app.post('/queryEvents', auth.requiresLogin, events.queryEvents);
    app.post('/addEventComment', auth.requiresLogin, events.addComment);
    //Finish with setting up the articleId param
    app.param('eventId', events.event);
    app.get('/uploads/', function(){});//ignore request



    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

    //$ ajax calls
    app.post('/getUserRecentEvents', index.getUserRecentEvents);
    app.post('/getUserRecentArticles', index.getUserRecentArticles);
    app.get('/getRecentEvents', index.getRecentEvents);
    app.get('/getRecentArticles', index.getRecentArticles);




};