const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const mongoose = require('mongoose');

// modeling:
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 15
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 4
  },
});

usersSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
      { _id: this._id },
      config.get('jwtPrivateKey')
  );
  return token ;
};

const User = mongoose.model('user', usersSchema);

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
  name: Joi.string().min(3).max(50),
  email: Joi.string().email().min(5).max(255),
  password: passwordComplexity(complexityOptions)
});

// validation functions
function validateCreate(user) {
  return baseUserSchema
    .fork(['name', 'email', 'password'], (field) => field.required())
    .validate(user);
}

function validateUpdate(user) {
  return baseUserSchema.validate(user);
}

module.exports = {
  User,
  validateUpdate,
  validateCreate
};