const express = require('express');
const router = express.Router();
const knex = require('../db');
const Joi = require('joi');

// validation schema
const movieSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 1).optional(),
  director: Joi.string().allow('', null).optional(),
  genre_id: Joi.number().integer().required(),
  metadata: Joi.object().optional()
});

// GET /movies with filters & pagination
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit,10) || 20;
  const offset = parseInt(req.query.offset,10) || 0;
  const { genre_id, genre, q, year } = req.query;

  const base = knex('movies').select('movies.*','genres.name as genre_name')
    .leftJoin('genres', 'movies.genre_id', 'genres.id');

  if (genre_id) base.where('genre_id', genre_id);
  if (genre) base.where('genres.name', 'like', `%${genre}%`);
  if (year) base.where('year', year);
  if (q) base.where(function() {
    this.where('title', 'like', `%${q}%`).orWhere('director', 'like', `%${q}%`);
  });

  const countRes = await base.clone().countDistinct('movies.id as cnt').first();
  const results = await base.clone().limit(limit).offset(offset);
  const parsed = results.map(m => ({ ...m, metadata: m.metadata ? JSON.parse(m.metadata) : null }));

  res.json({ count: countRes.cnt, limit, offset, results: parsed });
});

// GET /movies/:id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id,10);
  const movie = await knex('movies').where({ 'movies.id': id }).leftJoin('genres', 'movies.genre_id','genres.id')
    .select('movies.*','genres.name as genre_name').first();
  if (!movie) return res.status(404).json({ error: 'Not found' });
  movie.metadata = movie.metadata ? JSON.parse(movie.metadata) : null;
  res.json(movie);
});

// POST /movies
router.post('/', async (req, res) => {
  const { error, value } = movieSchema.validate(req.body);
  if (error) throw error;

  // check genre exists
  const genre = await knex('genres').where({ id: value.genre_id }).first();
  if (!genre) return res.status(400).json({ error: 'genre_id must reference existing genre' });

  const insert = {
    title: value.title,
    year: value.year || null,
    director: value.director || null,
    metadata: value.metadata ? JSON.stringify(value.metadata) : null,
    genre_id: value.genre_id
  };

  const [id] = await knex('movies').insert(insert);
  const created = await knex('movies').where({ id }).first();
  created.metadata = created.metadata ? JSON.parse(created.metadata) : null;
  res.status(201).json(created);
});

// DELETE /movies/:id → delete a movie
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  // check if movie exists
  const movie = await knex('movies').where({ id }).first();
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  // delete movie
  await knex('movies').where({ id }).del();

  res.status(204).send(); // No Content
});

module.exports = router;
