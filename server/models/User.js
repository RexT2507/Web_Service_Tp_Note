const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    account: Number,
    bank: String,
});

module.exports = mongoose.model('user', userSchema, 'users');