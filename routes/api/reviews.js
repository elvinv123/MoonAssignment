const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');


const Book = require('../../models/Book');
const validateReviewInput = require('../../validation/reviews');

// tested works
//posts reviews on a book if a registered user is logged in
// have to find a way to check if the author exists
router.post('/',
    passport.authenticate('jwt', { session: false }),
    
    (req, res) => {
        const { errors, isValid } = validateReviewInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        
        Book.findById(req.body.book)
            .then(book => {

                let sameAuthor = false;
                if(book){
                    book.reviews.forEach( review =>{
                        //try returning here if found same author try Array find() try making function to do this
                        if(req.user._id.toString() === review.author.toString()){
                            sameAuthor = true;
                        }
                    })
                }else{
                    return res.status(400).json({ book: "this book does not exist" }) 
                }

                if(!sameAuthor){
                    book.reviews.push({
                        text: req.body.text,
                        author: req.user.id,
                        book: req.body.book
                    })
                }else{
                    return res.status(400).json({ book: "You have already posted a review for this book" }) 
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
                // const review = book.reviews.id(req.params.id);
                //simplify the following
                if (book && req.user._id.toString() === book.reviews.id(req.params.id).author.toString()) {
                    book.reviews.id(req.params.id).text = req.body.text;
                } else {
                    return res.status(400).json({ book: "this book does not exist or you didn't author this review" })
                }

                book.save()
                    .then(review => res.json(review))
                    .catch(err => console.log(err));
            })

    }
);
//works tested functions 100%
router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {        

        Book.findById(req.body.book)
            .then(book => {
                // const review = book.reviews.id(req.params.id);
                //simplify the following
                if (book && book.reviews.id(req.params.id) && req.user._id.toString() === book.reviews.id(req.params.id).author.toString()) {
                    const index = book.reviews.indexOf(book.reviews.id(req.params.id));
                    book.reviews[index].remove();
                } else {
                    return res.status(400).json({ book: "this book does not exist, you didnt author this review, or this review doesnt exist" })
                }

                book.save()
                    .then(review => res.json(review))
                    .catch(err => console.log(err));
            })

    }
);

module.exports = router;