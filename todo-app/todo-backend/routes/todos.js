const express = require('express');
const redis = require('../redis');
const { Todo } = require('../mongo');
const { findByIdAndUpdate } = require('../mongo/models/Todo');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* GET statistics listing. */
router.get('/statistics', async (_, res) => {
  const added_todos = await redis.getAsync('added_todos')

  if (added_todos) {
    res.json({added_todos: parseInt(added_todos)})
  } else {
    res.json({added_todos: 0})
  }
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  res.send(todo);

  const added_todos = await redis.getAsync('added_todos')

  if (added_todos) {
    await redis.setAsync('added_todos', parseInt(added_todos) + 1)
  } else {
    await redis.setAsync('added_todos', 1)
  }
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = {
    text: req.body.text,
    done: req.body.done
  }

  await Todo.findByIdAndUpdate(req.todo.id, todo)

  res.send(todo); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
