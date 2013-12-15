/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Article = mongoose.model('Article'),
    Event = mongoose.model('Event'),
    _ = require('underscore');


exports.render = function(req, res) {
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

/**
 * get user recent events.
 */
exports.getUserRecentEvents = function(req, res) {
    var user = req.user;
    Event.find({user: user._id}).sort('-created').
        populate('user', 'name username').
        //limit(5).
        exec(function(err, events) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(events);
            }
        });
};
/**
 * get user recent articles.
 */
exports.getUserRecentArticles = function(req, res) {
    var user = req.user;
    Article.find({user: user._id}).sort('-created').
        populate('user', 'name username').
        //limit(54).
        exec(function(err, articles) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(articles);
            }
        });
};

/**
 * get recent events.
 */
exports.getRecentEvents = function(req, res) {
    Event.find().sort('-created').
        populate('user', 'name username').
        limit(10).
        exec(function(err, events) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(events);
            }
    });
};

/**
 * get recent articles.
 */
exports.getRecentArticles = function(req, res) {
    Article.find().sort('-created').
                   populate('user', 'name username').
                   limit(10).
                   exec(function(err, articles) {
                        if (err) {
                            res.render('error', {
                                status: 500
                            });
                        } else {
                            res.jsonp(articles);
                        }
    });

};