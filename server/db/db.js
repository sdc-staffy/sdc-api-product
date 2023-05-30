const { Pool } = require('pg');
require("dotenv").config();

const db = new Pool({
    host: process.env.HOST,
    port: process.env.PGPORT,
    database: process.env.DB,
    user: process.env.USER,
    password: process.env.PASSWORD
  })

  module.exports = db;