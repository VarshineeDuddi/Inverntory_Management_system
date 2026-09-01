'use strict';

const path = require('node:path');
const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'db', 'app.db');

const app = createApp(DB_FILE);

app.listen(PORT, () => {
  console.log(`Product API listening on port ${PORT} (db: ${DB_FILE})`);
});
