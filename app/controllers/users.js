/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('underscore'),
    fileUpload = require('./file-upload');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();

    //Browser does not redirect the window on redirect on ajax response.
    //Thus we send the redirect url as content.
    //http://stackoverflow.com/questions/8240447/express-js-cant-redirect
    //res.redirect('/');
//    res.contentType('application/json');
//    var data = JSON.stringify('/');
//    res.header('Content-Length', data.length);
//    res.end(data);


    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = new User(req.body);

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                errors: err.errors,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};

/**
 * Update a user
 */
exports.update = function(req, res) {
    var user = req.profile;

    user = _.extend(user, req.body);

    //if changed password
    if(typeof user.hashed_password_confirm != 'undefined' &&
        user.hashed_password_confirm != ''){

        User
            .findOne({
                _id: user._id
            })
            .exec(function(err, oldUser) {
                if (err) return next(err);
                if (!oldUser) return next(new Error('Failed to change password for: ' + user._id));
                if(oldUser.hashed_password == user.hashed_password_confirm){
                    //server side validation password change
                    //delete property
                    delete user.hashed_password_confirm;
                    user.save(function(err) {
                        if (err) {
                            res.render('error changing password', {
                                status: 500
                            });
                        }
                        res.jsonp(user);
                    });

                }else{
                    return next(new Error('Failed to change password'));
                }


            });



    }//if changed password
    else{
        user.save(function(err) {
            res.jsonp(user);
        });
    }




};

/**
 * Delete a user
 */
exports.destroy = function(req, res) {
    var user = req.profile;

    user.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {

            fileUpload.deleteUploadedFile(user.picture);

            res.jsonp(user);
        }
    });
};
/**
 *  Show profile
 */
exports.show = function(req, res) {
    res.jsonp(req.profile);

//    var user = req.profile;
//
//    res.render('users/show', {
//        title: user.name,
//        user: user
//    });


};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};
/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

/**
 * List of Users
 */
exports.all = function(req, res) {
    User.find().sort('-username').exec(function(err, users) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(users);
        }
    });
};

/**
 * getEncPassword
 */
exports.getEncPassword = function(req, res) {
    if(!req.body || !req.body.salt || !req.body.data){return;}
    var user = new User({salt:req.body.salt});
    res.jsonp(user.encryptPassword(req.body.data));
};

/**
 * queryUsers
 */
exports.queryUsers = function(req, res) {
    if(!req.body.name){return;}
    var lookup = req.body.name;
    var regexp = new RegExp(lookup, 'i');


    User.find({$or : [{'name' : regexp}, {'username': regexp},{'email': regexp}]}).
        sort('-username').
        exec(function(err, users) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(users);
        }
    });
};
/**
 * get users nearby.
 */
exports.getUsersNearby = function(req, res) {
    if(!req.body.userId){return;}
    if(!req.body.maxDistance){
        req.body.maxDistance = 100000;//distance in meters. 100 Km
    }


    User
        .findOne({
            _id: req.body.userId
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + req.body.userId));
            if(!user.currentLocation)return next(new Error('User does not have currentLocation set cannot get people nearby: ' + user._id));

            var fromLatitude = user.currentLocation.latitude;
            var fromLongitude = user.currentLocation.longitude;



            User.find({currentLocation: {$ne: null}}).sort('-username').exec(function(err, users) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {

                    var nearbyUsers = [];
                    for(var i=0;i < users.length;i++){
                        if(!users[i].currentLocation){continue;}
                        if(users[i]._id == req.body.userId) {continue;}
                        var toLatitude = users[i].currentLocation.latitude;
                        var toLongitude = users[i].currentLocation.longitude;

                        if(!toLongitude || !toLatitude){continue;}
                        var distanceToUser =geoMeasurement(fromLatitude,fromLongitude,
                                            toLatitude,toLongitude);
                        if(distanceToUser < req.body.maxDistance){
                            users[i].currentLocation.distanceToOtherUser = distanceToUser * 0.001;
                            nearbyUsers.push(users[i]);
                        }

                    }
                    //order by distance
                    res.jsonp(_.sortBy(nearbyUsers, function(usr){
                        return usr.currentLocation.distanceToOtherUser;
                    }));
                }
            });
        });
};

/**
 * Get distance (meters) between two geoCoords.
 */
function geoMeasurement(lat1, lon1, lat2, lon2){
    var R = 6378.137; // Radius of earth in KM
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
};



