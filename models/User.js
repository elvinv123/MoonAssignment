const mongoose = require('mongoose');
const Schema = mongoose.Schema; //Mongoose schema object used to define new schemas

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

//Passing the model name and the user schema into the mongoose model function
module.exports = User = mongoose.model('users', UserSchema)