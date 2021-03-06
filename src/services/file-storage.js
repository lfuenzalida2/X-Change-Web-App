const fs = require('fs');
const { storage } = require('pkgcloud');
const storageConfig = require('../config/storage');

const CONTAINER_NAME = 'xchangestorage';

class FileStorage {
  constructor() {
    try {
      this.client = storage.createClient(storageConfig);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Cloud file storage service could not be initialized. No upload or download support will be available. Error: ${e.message}`);
      this.noClientError = new Error('No cloud file storage service available');
    }
  }

  upload(fileData) {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(this.noClientError);
      }
      const writeStream = this.client.upload({ container: CONTAINER_NAME, remote: fileData.name });
      writeStream.on('error', reject);
      writeStream.on('success', resolve);
      const fileStream = fs.createReadStream(fileData.path);
      fileStream.pipe(writeStream);
    });
  }

  download(remotePath) {
    if (!this.client) {
      return Promise.reject(this.noClientError);
    }
    return this.client.download({ container: CONTAINER_NAME, remote: remotePath });
  }
}

module.exports = new FileStorage();
