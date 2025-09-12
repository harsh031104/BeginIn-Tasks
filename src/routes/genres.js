const express = require('express');
const router = express.Router();
const knex = require('../db');
const Joi = require('joi');

// GET /genres
router.get('/', async (req, res) => {
  const rows = await knex('genres').select('id','name','created_at');
  res.json(rows);
});

// POST /genres
router.post('/', async (req, res) => {
  const schema = Joi.object({ name: Joi.string().trim().min(1).required() });
  const { error, value } = schema.validate(req.body);
  if (error) throw error;

  try {
    const [id] = await knex('genres').insert({ name: value.name });
    const genre = await knex('genres').where({ id }).first();
    res.status(201).json(genre);
  } catch (e) {
    // unique conflict
    if (e.message && e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Genre already exists' });
    throw e;
  }
});

// GET /genres/:id/movies (paginated)
router.get('/:id/movies', async (req, res) => {
  const genreId = parseInt(req.params.id, 10);
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = parseInt(req.query.offset, 10) || 0;

  const countRes = await knex('movies').where({ genre_id: genreId }).count('* as cnt').first();
  const movies = await knex('movies')
    .where({ genre_id: genreId })
    .select('id','title','year','director','metadata','genre_id','created_at')
    .limit(limit).offset(offset);

  // parse metadata JSON
  const parsed = movies.map(m => ({ ...m, metadata: m.metadata ? JSON.parse(m.metadata) : null }));
  res.json({ count: countRes.cnt, limit, offset, results: parsed });
});

module.exports = router;
