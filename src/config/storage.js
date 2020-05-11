require('dotenv').config();
const fs = require('fs');
const path = require('path');

const gTokenPath = path.join(`${__dirname}/gToken.json`);
if (!fs.existsSync(gTokenPath)) {
  fs.writeFileSync(gTokenPath, process.env.STORAGE_KEY);
}

const gcsKeyFile = JSON.parse(process.env.STORAGE_KEY);

module.exports = {
  provider: 'google',
  keyFilename: gTokenPath, // path to a JSON key file
  projectId: gcsKeyFile.project_id, // project id
};
