const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');


// modeling:
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    genre: {
      type : genreSchema,
      required: true},
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('movie', movieSchema);


//validate fuctions:
const baseSchema = Joi.object({
  title: Joi.string().min(3).max(50),
  genreId: Joi.objectId(),
  numberInStock: Joi.number().min(0),
  dailyRentalRate: Joi.number().min(0)
});


function validateCreate(movie) {
  return baseSchema
    .fork(
      ['title', 'genreId', 'numberInStock', 'dailyRentalRate'],
      field => field.required()
    )
    .validate(movie);
}


function validateUpdate(movie) {
  return baseSchema.validate(movie);
}



module.exports = {
  Movie,
  validateUpdate,
  validateCreate
};