const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const { User, validateUpdate, validateCreate } = require('../models/user');
const router = express.Router();

// show all users:
router.get('/', async (req, res)=>{
    const users = await User.find();
    res.send(users);
});

// add a user:
router.post('/', async (req, res) => {
    const { error } = validateCreate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');
    
    try {
        const user = new User( _.pick(req.body, ['name', 'email', 'password']));
        await user.save();
        res.send(_.pick(user, ['_id', 'name', 'email']));
    } catch (err) {
        console.error('Error saving user', err);
        res.status(500).send("Something went wrong while saving user.");
    }
});

// edit a user:
router.patch('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return res.status(404).send('The user with the given ID was not found.');

    const { error } = validateUpdate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.password !== undefined) user.password = req.body.password;

    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
});


// delete a user:
router.delete('/:id',async(req, res)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

// show the customer with the given ID:
router.get('/:id', async (req, res)=>{
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;