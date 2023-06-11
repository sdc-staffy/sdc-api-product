const { Pool } = require('pg');
require("dotenv").config();

const db = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDB,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  })

  module.exports = db;