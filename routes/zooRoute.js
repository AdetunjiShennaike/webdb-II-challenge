//add knex
const knex = require('knex');
//add route
const router = require('express').Router();


const knexConfig = {
  //client its using to connect to the database, same as filetype
  client: 'sqlite3',
  //database it should connect to
  connection: {
    filename: './data/lambda.sqlite3',
  },
  useNullAsDefault: true
}




//export 
module.exports = router