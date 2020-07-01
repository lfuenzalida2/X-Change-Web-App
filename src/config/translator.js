require('dotenv').config();

module.exports = {
  'content-type': 'application/octet-stream',
  'x-rapidapi-host': process.env.RAPIDAPI_HOST,
  'x-rapidapi-key': process.env.RAPIDAPI_KEY,
  useQueryString: true,
};
