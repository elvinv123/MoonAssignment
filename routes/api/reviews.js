const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');


const Book = require('../../models/Book'); // Book model
const validateReviewInput = require('../../validation/reviews');

//Allows logged in users to post a review
//Body of request must have 'book' as key and id of book as value, 'text' as key and review of the book as value
//Passport added as middleware function to protect route, allowing access to only users who are logged in
//Corresponding JSON web token must be added as Authorization header in request to have access
//Request (req) object will have a user key that will be the current user based on JSON web token

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

//Allows logged in users to edit their own review
//Body of request must have 'book' as key and id of book as value, 'text' as key and review of the book as value, id of review as a parameter
//Passport added as middleware function to protect route, allowing access to only users who are logged in

router.patch('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateReviewInput(req.body);
        
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Book.findById(req.body.book)
            .then(book => {
                
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

//Allows logged in users to delete their own review
//Body of request must have 'book' as key and id of book as value, id of review as a parameter
//Passport added as middleware function to protect route, allowing access to only users who are logged in

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {        

        Book.findById(req.body.book)
            .then(book => {
                
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