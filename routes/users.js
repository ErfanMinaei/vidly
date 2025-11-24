const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const { User, validateUpdate, validateCreate } = require('../models/user');
const router = express.Router();

// show the user with the given ID:
router.get('/me', auth, async (req, res)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

// add a user:
router.post('/', async (req, res) => {
    const { error } = validateCreate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');
    
    try {
        const newUser = new User( _.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        await newUser.save();
        const token = newUser.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(newUser, ['_id', 'name', 'email']));
    } catch (err) {
        console.error('Error saving user', err);
        res.status(500).send("Something went wrong while saving user.");
    }
});

// edit a user:
router.patch('/me', auth, async (req, res) => {
    const { error } = validateUpdate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try{
        const user = await User.findById(req.user._id);
        if (req.body.name !== undefined) user.name = req.body.name;
        if (req.body.email !== undefined) user.email = req.body.email;
        if (req.body.password !== undefined) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        };
    }catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal server error.');
    }

    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
});


module.exports = router;