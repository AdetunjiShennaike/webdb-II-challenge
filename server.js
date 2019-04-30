const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const zooRoute = require('./routes/zooRoute');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.use('/api/zoos', zooRoute);


module.exports = server;