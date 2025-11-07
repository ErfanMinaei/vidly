const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const { User } = require('../models/user');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const router = express.Router();


router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send('Invalid email or password!');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password!');

  const token = user.generateAuthToken();
  res.send(token);
});


// Password complexity options
const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

// base schema for validation
const baseUserSchema = Joi.object({
  email: Joi.string().email().min(5).max(255),
  password: passwordComplexity(complexityOptions)
});

// validation functions
function validate(user) {
  return baseUserSchema
    .fork(['email', 'password'], (field) => field.required())
    .validate(user);
}


module.exports = router;