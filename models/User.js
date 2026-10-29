const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is Required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required']
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile Number is Required']
    },

    // Dating Profile Fields (ALL REQUIRED)
    gender: {
        type: String,
        required: [true, 'Gender is Required']
    },
    age: {
        type: Number,
        required: [true, 'Age is Required']
    },
    status: {
        type: String,
        required: [true, 'Status is Required']
    },
    hobbies: {
        type: String,
        required: [true, 'Hobbies are Required']
    },
    lookingFor: {
        type: String,
        required: [true, 'Looking For field is Required']
    },
    profileImage: {
        type: String,
        required: [true, 'Profile Image is Required']
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);