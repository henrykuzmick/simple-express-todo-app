const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;

const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/todoapp'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extender: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

MongoClient.connect(url, (err, database) => {
  console.log('MongoDB connected');
  if(err) throw err;

  db = database;
  Todos = db.collection('todos');
  app.listen(port, () => {
    console.log('Server running on port ' +port);
  })

});

app.get('/', (req, res, next) => {
  Todos.find({}).toArray((err, todos) => {
    if(err) {
      return console.log(err);
    }
    console.log(todos)
    res.render('index', {
      todos: todos
    });
  });
})

app.post('/todo/add', (req, res, next) => {
  const todo = {
    text: req.body.text,
    body: req.body.body
  }

  Todos.insert(todo, (err, result) => {
    if(err) {
      return console.log(err);
    }
    console.log('Todo Added');
    res.redirect('/')
  });
});

app.delete('/todo/delete/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)}
  Todos.deleteOne(query, (err, response) => {
    if(err) {
      return console.log(err);
    }
    console.log('Todo Removed');
    res.send(200);
  })
})

app.get('/todo/edit/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)}
  Todos.find(query).next((err, todo) => {
    if(err) {
      return console.log(err);
    }
    res.render('edit', {
      todo: todo
    });
  });
})

app.post('/todo/edit/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)}

  const todo = {
    text: req.body.text,
    body: req.body.body
  }

  Todos.updateOne(query, {$set:todo}, (err, result) => {
    if(err) {
      return console.log(err);
    }
    console.log('Todo Updated');
    res.redirect('/')
  });
});
