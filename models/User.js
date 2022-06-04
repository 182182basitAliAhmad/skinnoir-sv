const mongoose = require('mongoose')
const { Schema } = mongoose

const User = mongoose.model('User', new Schema({
    name: String,
    email: String,
    password: String,
    steamID: String
}))


module.exports = User;

