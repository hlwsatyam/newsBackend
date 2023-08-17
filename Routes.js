var express = require('express');
const { Signup, Login } = require('./Controllers');
const UserRouting = express.Router()

UserRouting.get('/signup', Signup)
UserRouting.get('/login', Login)

module.exports = UserRouting