const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Book = require('../../models/Book');
//const validateReviewInput = require('../../validation/books');

//tested works
//shows all books
router.get('/', (req, res) => {
    Book.find()
        .sort({ date: -1 })
        .then(books => res.json(books))
        .catch(err => res.status(404).json({ nobooksfound: 'No books found' }));
});

//tested works
//finds books given a specific bookid
router.get('/:id', (req, res) => {
    Book.findById(req.params.id)
        .then(book => res.json(book))
        .catch(err =>
            res.status(404).json({ nobooksfound: 'No book found with that ID' })
        );
});

//lists reviews for a book
router.get('/:id/reviews', (req, res) => {
    Book.findById(req.params.id).populate('reviews')
        .then(reviews => res.json(reviews))
        .catch(err =>
            res.status(404).json({ noreviewsfound: 'No reviews for this book' })
        );
});

router.post('/',

);

module.exports = router;