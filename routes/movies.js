const express = require('express');
const mongoose = require('mongoose');
const { Movie, validateUpdate, validateCreate } = require('../models/movie');
const { Genre } = require('../models/genre');
const router = express.Router();

// show all movies:
router.get('/', async (req, res) => {
  const movie = await Movie.find();
  res.send(movie);
});

// add a movie:
router.post('/', async (req, res) => {
    const { error } = validateCreate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre...');

    try {
        const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: { 
            _id : genre._id,
            name: genre.name}
        });
        await movie.save();
        res.send(movie);
    } catch (err) {
        console.error('Error saving movie', err);
        res.status(500).send("Something went wrong while saving movie.");
    }
});

// edit a movie:
router.patch('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  let genre; // declare variable in outer scope
  if (req.body.genreId) {
    genre = await Genre.findById(req.body.genreId);
    if (!genre)
      return res.status(400).send('Invalid genre...');
  }

  const { error } = validateUpdate(req.body);
  if (error)
    return res.status(400).send(error.details[0].message);

  if (req.body.title !== undefined) movie.title = req.body.title;
  if (req.body.numberInStock !== undefined) movie.numberInStock = req.body.numberInStock;
  if (req.body.dailyRentalRate !== undefined) movie.dailyRentalRate = req.body.dailyRentalRate;
  if (genre) movie.genre = { _id: genre._id, name: genre.name };

  await movie.save();
  res.send(movie);
});



// delete a movie:
router.delete('/:id',async(req, res)=>{
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie);
});

// show the movie with the given ID:
router.get('/:id', async (req, res)=>{
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie);
});

module.exports = router;