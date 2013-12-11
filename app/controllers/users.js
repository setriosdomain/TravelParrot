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
    if(user.hashed_password_confirm != ''){

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