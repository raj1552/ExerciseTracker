const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(express.urlencoded({ extended: false }));

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

function generateUniqueId() {
  return Math.floor(Math.random() * 10000)
}

const Users = []

app.post('/api/users', (req, res) => {
  const { username } = req.body;

  const _id = generateUniqueId()

  const newusers = { _id, username }
  Users.push(newusers)

  res.json(newusers)

})

app.get('/api/users', (req, res) => {
  res.json(Users)
})

app.post('/api/users/:_id/exercises', (req, res) => {

  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const user = Users.find((user) => user._id === Number(_id)); 

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  if (date === " ") {
   return date = new Date().toISOString().substring(0, 10);
  }

  const exercise = {
    description: String(description),
    duration: Number(duration),
    date: new Date(date).toDateString(),
  };

  if (!user.exercises) {
    user.exercises = [];
  }

  user.exercises.push(exercise);

  res.json(user);
});

app.get('/api/users/:_id/exercises', (req, res) => {
  const {_id} = req.params;
  const user = Users.find((user) => user._id === _id)
  
  if(!user){
    res.json({error: "User not found"})
  }

  if (!user.exercises) {
    return res.json({ username: user.username, log: [] });
  }

  res.json({ username: user.username, log: user.exercises });
})




const listener = app.listen(process.env.PORT || 4000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
