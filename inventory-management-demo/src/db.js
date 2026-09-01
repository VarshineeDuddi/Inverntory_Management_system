'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const MIGRATION_PATH = path.join(__dirname, '..', 'db', 'migrations', '001_create_products.sql');

function openDatabase(dbFile) {
  const db = new Database(dbFile);
  db.pragma('foreign_keys = ON');
  db.exec(fs.readFileSync(MIGRATION_PATH, 'utf8'));
  return db;
}

module.exports = { openDatabase };
