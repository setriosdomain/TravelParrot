/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * Message Schema
 */
var MessageSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    user2: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    comments: [{ body: String,
        date: Date,
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }]
});


/**
 * Statics
 */
MessageSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').populate('user2', 'name username').exec(cb);
    }
};

mongoose.model('Message', MessageSchema);