const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const mongoose = require('mongoose');
const { validate, Genre } = require('../models/genre');
const router = express.Router();

// show all genres:
router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
});

// add a genre:
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const genre = new Genre( {
    name: req.body.name
    });
    await genre.save();
    res.send(genre); 
  } catch (err) {
    console.error("Error saving genre:", err);
    res.status(500).send("Something went wrong while saving genre.");
  }
});

// edit a genre:
router.put('/:id', auth, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  genre.name = req.body.name; 
  await genre.save();
  res.send(genre);
});

// delete a genre:
router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

// show the genre with the given ID:
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});


module.exports = router;