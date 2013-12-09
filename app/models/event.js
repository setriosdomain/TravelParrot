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
    periodFrom: Date,
    periodTo: Date,
    public: {
        type: Boolean,
        default: true
    },
    destinations:[{lat: Number, lng: Number, title: String}],
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
EventSchema.path('periodFrom').validate(function(periodFrom) {
    return periodFrom.length;
}, 'periodFrom cannot be blank');
EventSchema.path('periodTo').validate(function(periodTo) {
    return periodTo.length;
}, 'periodTo cannot be blank');
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