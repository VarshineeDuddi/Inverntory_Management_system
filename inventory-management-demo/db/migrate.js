#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

function printUsage() {
  console.log('Usage: node db/migrate.js <database-file> <sql-file> [<sql-file> ...]');
  console.log('Applies each .sql file to the target SQLite database file, in order.');
}

function run(argv) {
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    printUsage();
    return 0;
  }

  const [dbFile, ...sqlFiles] = argv;
  if (sqlFiles.length === 0) {
    console.error('Error: at least one .sql file is required.');
    printUsage();
    return 1;
  }

  const db = new DatabaseSync(dbFile);
  try {
    for (const sqlFile of sqlFiles) {
      const sql = fs.readFileSync(path.resolve(sqlFile), 'utf8');
      db.exec(sql);
      console.log(`Applied ${sqlFile} to ${dbFile}`);
    }
  } finally {
    db.close();
  }
  return 0;
}

if (require.main === module) {
  process.exitCode = run(process.argv.slice(2));
}

module.exports = { run };
