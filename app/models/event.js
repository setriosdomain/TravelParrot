/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Event Schema
 */
var EventSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    file_url: {
        type: String,
        default: '',
        trim: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    comments: [{ body: String,
                 date: Date,
                 user: {
                        type: Schema.ObjectId,
                        ref: 'User'
                }}]
});

/**
 * Validations
 */
EventSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');
/**
 * Statics
 */
EventSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};
mongoose.model('Event', EventSchema);