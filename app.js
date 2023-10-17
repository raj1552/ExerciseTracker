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
    _id: 1
  }
]

app.get('/api/users', (req, res) => {
  res.send(Users)
})

app.post('/api/users', (req, res) => {

  const { username } = req.body;

  const _id = Number(generateUniqueId())

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

  let user = Users.find((user) => user._id === Number(_id));

  if (!description) {
    return res.json({ description: "Error" })
  }

  if (!duration) {
    return res.json({ duration: "Error" })
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

  res.json(user);

});

app.get('/api/users/:_id/exercises', (req, res) => {

  const { _id } = req.params;

  const user = Users.find((user) => user._id === Number(_id))

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

  const user = Users.find((user) => user._id === Number(_id));

  if (!user) {
    return res.json({ error: "User not found" });

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


