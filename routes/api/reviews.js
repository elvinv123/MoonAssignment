const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');


const Book = require('../../models/Book');
const validateReviewInput = require('../../validation/reviews');

router.get('/', (req, res) => {
    Review.find()
        .sort({ date: -1 })
        .then(reviews => res.json(reviews))
        .catch(err => res.status(404).json({ noreviewsfound: 'No reviews found' }));
});

router.get('/user/:user_id', (req, res) => {
    Review.find({ user: req.params.user_id })
        .then(reviews => res.json(reviews))
        .catch(err =>
            res.status(404).json({ noreviewsfound: 'No reviews found from that user' }
            )
        );
});

router.get('/:id', (req, res) => {
    Review.findById(req.params.id)
        .then(review => res.json(review))
        .catch(err =>
            res.status(404).json({ noreviewsfound: 'No review found with that ID' })
        );
});

// tested works
//posts reviews on a book if a registered user is logged in
router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateReviewInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        
        Book.findById(req.body.book)
            .then(book => {
                if(book){
                    book.reviews.push({
                        text: req.body.text,
                        author: req.user.id,
                        book: req.body.book
                    })
                }else{
                    return res.status(400).json({ email: "this book does not exist" }) 
                }

                book.save()
                    .then(review => res.json(review))
                    .catch(err => console.log(err));
            })

    }
);
//tested works
//lets you edit reviews when logged in
router.patch('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateReviewInput(req.body);
        
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Book.findById(req.body.book)
            .then(book => {
                const review = book.reviews.id(req.params.id);
                
                if (book && req.user._id.toString() === review.author.toString()) {
                    review.text = req.body.text;
                } else {
                    return res.status(400).json({ email: "this book does not exist or you didnt author this review" })
                }

                book.save()
                    .then(review => res.json(review))
                    .catch(err => console.log(err));
            })

    }
);

module.exports = router;