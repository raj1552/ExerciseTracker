const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
require('dotenv').config()

app.use(express.urlencoded({ extended: false }));

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {

  res.sendFile(__dirname + '/views/index.html')
});

app.listen(port, ()=> console.log(`app listening on port ${port}!`))

function generateUniqueId() {

  return Math.floor(Math.random() * 10000)
}


const Users = [
  {
    username: "abcd",
    _id: "1"
  }
]

const Exercise = []


app.get('/api/users', (req, res) => {
  
  res.json(Users.map(u => ({ _id: u._id, username: u.username })))
})

app.post('/api/users', (req, res) => {

  const { username } = req.body;

  const _id = String(generateUniqueId())

  if (!username) {
    return res.json({ error: "username is required" })
  }

  const newusers = { _id, username }

  Users.push(newusers)

  res.json({
    username: username,
    _id: _id
  })

})



app.post('/api/users/:_id/exercises', (req, res) => {

  const { _id } = req.params;
  const description = req.body.description;
  const duration = req.body.duration;
  let date = new Date(req.body.date).toDateString();

  let user = Users.find((user) => user._id === _id);

  if (!description || !duration) {
    return res.json({ error: 'Description and duration are required' });
  }

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  if (new Date(req.body.date).toDateString() === 'Invalid Date') {
    date = new Date().toDateString();
  }

  const exercise = {
    description: String(description),
    duration: Number(duration),
    date: date
  };

  if (!user.log) {
    user.log = [];
  }

  user.log.push(exercise)
  Exercise.push(exercise)

  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id

  });

});

app.get('/api/users/:_id/exercises', (req, res) => {

  const { _id } = req.params;

  const user = Users.find((user) => user._id === _id)

  if (!user) {
    return res.json({ error: "User not found" })
  }

  res.json({ username: user.username, log: user.log });
})

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const from = req.query.from;
  const to = req.query.to;
  const limit = parseInt(req.query.limit);

  const user = Users.find((user) => user._id === _id);

  if (!user) {
    return res.json({ error: "User not found" });

  }

  if (!user.log || user.log.length === 0) {
    return res.json({
      username: user.username,
      count: 0,
      _id: user._id,
      log: [],
    });
  }

  let filteredLogs = user.log;

  if (from && to) {
    filteredLogs = filteredLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= new Date(from) && logDate <= new Date(to);
    });
  }

  if (!isNaN(limit) && limit > 0) {
    filteredLogs = filteredLogs.slice(0, limit);
  }

  res.json({
    username: user.username,
    count: filteredLogs.length,
    _id: user._id,
    log: filteredLogs,
  });
});

