const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reviews = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author_publisher: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    // reviews: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'review'
    // }],
    reviews: [Reviews],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Book = mongoose.model('book', BookSchema);