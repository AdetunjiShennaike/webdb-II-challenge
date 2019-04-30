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

const zoo = knex(knexConfig);

//error reply for 404 and 500 and all others
const sendError = (msg, res) => {
  res.status(500).json({ error: `${msg}`});
};

const missingError = res => {
  res.status(404).json({ error: 'This zoo does not exist'});
};

const newError = (sts, msg, res) => {
  res.status(sts).json({ error: `${msg}` })
}


router.get('/', (req, res) => {
  zoo('zoos')
  .then( zoos => {
    res.status(200).json(zoos);
  })
  .catch( err => {
    console.log(err);
    return sendError(err, res);
  })
})

router.get('/:id', (req, res) => { 
  zoo('zoos')
  //similar syntax to SQL
  .where({ id: req.params.id })
  .first()
  .then(zoo => {
    if (zoo){
      res.status(200).json(zoo);
    }
    else {
      return missingError(res);
    }
  })
  .catch( err => {
    return sendError(err, res);
  })
})

router.post('/', (req, res) => {
  if (req.body.name) {
    zoo('zoos')
    .insert(req.body, 'id')
    .then(ids => {
      zoo('zoos')
      .where({ id: ids[0] })
      .first()
      .then(zoo => {
        res.status(201).json(zoo);
      })
      .catch( err => {
        return sendError(err, res);
      })
    })
    .catch( err => {
      return sendError(err, res);
    })
  }
  else {
    return newError(406, 'Provide a name', res);
  }
})


//export 
module.exports = router