const { Pool } = require('pg');
const fs = require('fs');
require("dotenv").config();

const db = new Pool({
    host: 'localhost',
    port: process.env.PGPORT,
    database: process.env.DB,
    user: process.env.USER,
    password: process.env.PASSWORD
  })

  module.exports = db;