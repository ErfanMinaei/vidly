const express = require('express');
const mongoose = require('mongoose');
const { Customer, validateCreate, validateUpdate } = require('../models/customer');
const router = express.Router();

// show all customers:
router.get('/', async (req, res)=>{
    const customers = await Customer.find();
    res.send(customers);
});

// add a customer:
router.post('/', async (req, res) => {
    const { error } = validateCreate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
        });
        await customer.save();
        res.send(customer);
    } catch (err) {
        console.error('Error saving customer', err);
        res.status(500).send("Something went wrong while saving customer.");
    }
});

// edit a customer:
router.patch('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
        return res.status(404).send('The customer with the given ID was not found.');

    const { error } = validateUpdate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    
    if (req.body.name !== undefined) customer.name = req.body.name;
    if (req.body.isGold !== undefined) customer.isGold = req.body.isGold;
    if (req.body.phone !== undefined) customer.phone = req.body.phone;

    await customer.save();
    res.send(customer);
});


// delete a customer:
router.delete('/:id',async(req, res)=>{
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});

// show the customer with the given ID:
router.get('/:id', async (req, res)=>{
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});

module.exports = router;