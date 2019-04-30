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

const bear = knex(knexConfig);

//error reply for 404 and 500 and all others
const sendError = (msg, res) => {
  res.status(500).json({ error: `${msg}`});
};

const missingError = res => {
  res.status(404).json({ error: 'This bear does not exist'});
};

const newError = (sts, msg, res) => {
  res.status(sts).json({ error: `${msg}` })
}


router.get('/', (req, res) => {
  bear('bears')
  .then( bears => {
    res.status(200).json(bears);
  })
  .catch( err => {
    console.log(err);
    return sendError(err, res);
  })
})

router.get('/:id', (req, res) => { 
  bear('bears')
  //similar syntax to SQL
  .where({ id: req.params.id })
  .first()
  .then(bear => {
    if (bear){
      res.status(200).json(bear);
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
    bear('bears')
    .insert(req.body, 'id')
    .then(ids => {
      bear('bears')
      .where({ id: ids[0] })
      .first()
      .then(bear => {
        res.status(201).json(bear);
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

router.put('/:id', (req, res) => {
  if (req.body.name) {  
    bear('bears')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if(count > 0) {
        res.status(202).json({
          message: `${count} ${count > 1 ? 'records' : 'record'} updated`
        })
      }
      else{
        return missingError(res);
      }
    })
    .catch( err => {
      return sendError(err, res);
    })
  }
  else {
    return newError(406, 'Please Provide New Name!', res);
  }
})

router.delete('/:id', (req, res) => {
  bear('bears')
  .where({ id: req.params.id })
  .del()
  .then(count => {
    if(count > 0) {
      res.status(202).json({
        message: `${count} ${count > 1 ? 'records' : 'record'} deleted`
      })
    }
    else{
      return missingError(res);
    }
  })
  .catch( err => {
    return sendError(err, res);
  })
})



//export 
module.exports = router