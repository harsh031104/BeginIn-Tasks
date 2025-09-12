require('dotenv').config();
require('express-async-errors'); // for throwing inside async routes
const express = require('express');
const app = express();
const auth = require('./middleware/auth');
const genresRouter = require('./routes/genres');
const moviesRouter = require('./routes/movies');

app.use(express.json());
app.use(auth); // protect all endpoints

app.use('/genres', genresRouter);
app.use('/movies', moviesRouter);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.isJoi) return res.status(400).json({ error: err.details[0].message });
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));

console.log('API_KEY loaded:', process.env.API_KEY);
