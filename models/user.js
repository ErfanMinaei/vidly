const Joi = require('joi');
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
        unique : true,
        minlength: 15
    },
    password: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 4
    },
});

const User = mongoose.model('user', usersSchema);


//validate fuctions:

const baseUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string()
    .email({ tlds: { allow: ['com'] } }) // Ensures contains "@" and ends with ".com"
    .min(15),
  password: Joi.string().min(4).max(10)
});

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