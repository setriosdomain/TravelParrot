/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Article = mongoose.model('Article'),
    _ = require('underscore'),
    fileUpload = require('./file-upload');



/**
 * Find article by id
 */
exports.article = function(req, res, next, id) {
    Article.load(id, function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

/**
 * Create an article
 */
exports.create = function(req, res) {

    var article = new Article(req.body);
    article.user = req.user;

    article.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                article: article
            });
        } else {
            res.jsonp(article);
        }
    });
};
/**
 * Add an article comment.
 */
exports.addComment = function(req, res) {
    if(!req.body.articleId || !req.body.comment){return;}


    Article.load(req.body.articleId, function(err, orgArticle) {
        if (err) return next(err);
        if (!orgArticle) return next(new Error('Failed to load article ' + req.body.articleId));
        if(!orgArticle.comments){
            orgArticle.comments = [];
        }
        orgArticle.comments.push(req.body.comment);

        orgArticle.save(function(err) {
            res.jsonp(orgArticle);
        });

    });
};
/**
 * Update an article
 */
exports.update = function(req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        res.jsonp(article);
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {

            fileUpload.deleteUploadedFile(article.file_url);

            res.jsonp(article);
        }
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Article.find().sort('-created').populate('user', 'name username').exec(function(err, articles) {
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
 * queryArticles
 */
exports.queryArticles = function(req, res) {
    if(!req.body.name){return;}
    var lookup = req.body.name;
    var regexp = new RegExp(lookup, 'i');


    Article.find({$or : [{'title' : regexp}, {'content': regexp}]}).
        sort('-created').
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