/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Message = mongoose.model('Message'),
    _ = require('underscore')



/**
 * Find Message by id
 */
exports.message = function(req, res, next, id) {
    Message.load(id, function(err, message) {
        if (err) return next(err);
        if (!message) return next(new Error('Failed to load message ' + id));
        req.message = message;
        next();
    });
};

/**
 * Create an Message
 */
exports.create = function(req, res) {

    var message = new Message(req.body);
    message.user = req.user;

    ///////////////////////////////////////////////////////////

    Message.findOne({
        user: message.user,
        user2: message.user2
    })
        .exec(function(err, messages) {

            if (err) {
                console.log("error");

            } else {
                if (!messages)
                {




                    Message.findOne({
                        user: message.user2,
                        user2: message.user
                    })
                        .exec(function(err, messages2) {

                            if (err) {
                                console.log("error");

                            } else {
                                if (!messages2)
                                {



                                    message.save(function(err) {
                                     if (err) {
                                     return res.send('users/signup', {
                                     errors: err.errors,
                                     message: message
                                     });
                                     } else {
                                     res.jsonp(message);
                                     }
                                     });
                                }
                                else
                                {

                                    res.jsonp(messages2);
                                }
                            }



                        });



                }
                else
                {

                    res.jsonp(messages);
                }
            }



        });

    //////////////////////////////////////////////////////////

};
/**
 * Add an message comment.
 */
exports.addComment = function(req, res) {
    if(!req.body.messageId || !req.body.comment){return;}


    Message.load(req.body.messageId, function(err, orgMessage) {
        if (err) return next(err);
        if (!orgMessage) return next(new Error('Failed to load message ' + req.body.messageId));
        if(!orgMessage.comments){
            orgMessage.comments = [];
        }
        orgMessage.created = req.body.created;
        orgMessage.comments.push(req.body.comment);

        orgMessage.save(function(err) {
            res.jsonp(orgMessage);
        });

    });
};
/**
 * Update a message
 */
exports.update = function(req, res) {
    var message = req.message;

    message = _.extend(message, req.body);

    message.save(function(err) {
        res.jsonp(message);
    });
};

/**
 * Delete a message
 */
exports.destroy = function(req, res) {
    var message = req.message;

    message.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
          res.jsonp(message);
        }
    });
};

/**
 * Show a message
 */
exports.show = function(req, res) {
    //console.log("llegaaaa a show de mensaje");
    res.jsonp(req.message);
};

/**
 * List of messages
 */
exports.all = function(req, res) {
    Message.find().or([{ user: req.user }, { user2: req.user }]).sort('-created').populate('user', 'name username').populate('user2', 'name username').exec(function(err, messages) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(messages);
        }
    });
};
/**
 * queryMessages
 */
exports.queryMessages = function(req, res) {
    if(!req.body.name){return;}
    var lookup = req.body.name;
    var regexp = new RegExp(lookup, 'i');


    Message.find({$or : [{'title' : regexp}, {'content': regexp}]}).
        sort('-created').
        exec(function(err, messages) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(messages);
            }
        });
};