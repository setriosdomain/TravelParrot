/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    _ = require('underscore'),
    fileUpload = require('./file-upload');

/**
 * Find event by id.
 */
exports.event = function(req, res, next, id) {
    Event.load(id, function(err, event) {
        if (err) return next(err);
        if (!event) return next(new Error('Failed to load event ' + id));
        req.event = event;
        next();
    });
};

/**
 * Create an event
 */
exports.create = function(req, res) {

    var event = new Event(req.body);
    event.user = req.user;

    if(!event.periodTo || !event.periodFrom){event.periodTo = null;event.periodFrom = null;
    }else if(event.periodTo < event.periodFrom){event.periodTo = event.periodFrom;}

    event.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                article: event
            });
        } else {
            res.jsonp(event);
        }
    });
};
/**
 * Add an event comment.
 */
exports.addComment = function(req, res) {
    if(!req.body.eventId || !req.body.comment){return;}


    Event.load(req.body.eventId, function(err, orgEvent) {
        if (err) return next(err);
        if (!orgEvent) return next(new Error('Failed to load event ' + req.body.eventId));
        if(!orgEvent.comments){
            orgEvent.comments = [];
        }
        orgEvent.comments.push(req.body.comment);

        orgEvent.save(function(err) {
            res.jsonp(orgEvent);
        });

    });
};


/**
 * Update an event
 */
exports.update = function(req, res) {
    var event = req.event;

    event = _.extend(event, req.body);

    if(!event.periodTo || !event.periodFrom){event.periodTo = null;event.periodFrom = null;
    }else if(event.periodTo < event.periodFrom){event.periodTo = event.periodFrom;}

    event.save(function(err) {
        res.jsonp(event);
    });
};
/**
 * Delete an event
 */
exports.destroy = function(req, res) {
    var event = req.event;

    event.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {

            fileUpload.deleteUploadedFile(event.file_url);

            res.jsonp(event);
        }
    });
};
/**
 * Show an event
 */
exports.show = function(req, res) {
    res.jsonp(req.event);
};

/**
 * List of events
 */
exports.all = function(req, res) {
    Event.find().sort({periodFrom: 'desc'}).populate('user', 'name username').exec(function(err, events) {
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
 * queryEvents
 */
exports.queryEvents = function(req, res) {
    if(!req.body.name){return;}
    var lookup = req.body.name;
    var regexp = new RegExp(lookup, 'i');


    Event.find({$or : [{'title' : regexp}, {'content': regexp}]}).
        sort('-created').
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
 * Add a participant to an event.
 */
exports.addParticipant = function(req, res) {
    if(!req.body.eventId || !req.body.participant){return;}


    Event.load(req.body.eventId, function(err, orgEvent) {
        if (err) return next(err);
        if (!orgEvent) return next(new Error('Failed to load event ' + req.body.eventId));
        if(!orgEvent.participants){
            orgEvent.participants = [];
        }
        orgEvent.participants.push(req.body.participant);

        orgEvent.save(function(err) {
            res.jsonp(orgEvent);
        });

    });
};
