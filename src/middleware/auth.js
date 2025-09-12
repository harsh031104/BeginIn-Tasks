require('dotenv').config();
module.exports = function(req, res, next) {
  const authHeader = req.headers.authorization;
  const apiKeyHeader = req.headers['x-api-key'];
  const token = authHeader && authHeader.split(' ')[1] ? authHeader.split(' ')[1] : apiKeyHeader;
  const expected = process.env.API_KEY; // set in .env
  if (!token || token !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
  console.log('Received token:', token);
  console.log('Expected token:', expected);
};

