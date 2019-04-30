const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const zooRoute = require('./routes/zooRoute');
const bearRoute = require('./routes/bearRoute')

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.use('/api/zoos', zooRoute);
server.use('/api/bears', bearRoute);

module.exports = server;