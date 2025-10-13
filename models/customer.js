const Joi = require('joi');
const mongoose = require('mongoose');


// modeling:
const customersSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default : false
    },
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    phone: {
        type: String,
        required: true,
        maxlength: 11,
        minlength: 8
    }
});

const Customer = mongoose.model('customer', customersSchema);


//validate fuctions:
const baseSchema = Joi.object({
  isGold: Joi.boolean(),
  name: Joi.string().min(3).max(50),
  phone: Joi.string().min(8).max(11)
});

function validateCreate(customer) {
  return baseSchema
    .fork(['name', 'phone'], field => field.required()) 
    .validate(customer);
};


function validateUpdate(customer) {
  return baseSchema.validate(customer); 
};

module.exports = {
  Customer,
  validateUpdate,
  validateCreate
};