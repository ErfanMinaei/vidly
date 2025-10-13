const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    maxlength : 50,
    minlength : 5
  }
});

const Genre = mongoose.model('genre', genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });

  return schema.validate(genre);
};

module.exports = {
  Genre,
  genreSchema,
  validate: validateGenre
};
