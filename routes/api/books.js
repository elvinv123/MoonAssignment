const express = require('express');
const router = express.Router(); //router object
const mongoose = require('mongoose');
const passport = require('passport');

const Book = require('../../models/Book'); //Book model

// Allows users to view all books
router.get('/', (req, res) => {
    Book.find()
        .sort({ date: -1 })
        .then(books => res.json(books))
        .catch(err => res.status(404).json({ nobooksfound: 'No books found' }));
});

// Allows users to request a specific book, given a book id as a parameter
router.get('/:id', (req, res) => {
    Book.findById(req.params.id)
        .then(book => res.json(book))
        .catch(err =>
            res.status(404).json({ nobooksfound: 'No book found with that ID' })
        );
});

module.exports = router;