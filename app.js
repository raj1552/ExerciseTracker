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
const Exercises =[]

app.post('/api/users', (req, res) => {

  const { username } = req.body;

  const _id = Number(generateUniqueId())

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

  let user = Users.find((user) => user._id === Number(_id)); 

  if (!user) {
     return res.json({ error: 'User not found' });
  }

  let exerciseDate;

  if (date === undefined) {
      exerciseDate= new Date().toDateString();
  }
  else{
      exerciseDate = new Date(date).toDateString()
  }

  const exercise = {
      description: String(description),
      duration: Number(duration),
      date: exerciseDate
  };

  Exercises.push(exercise);

  res.json({
     username : user.username,
     description : description,
     duration : duration , 
     date : exerciseDate,
     _id : user._id
  });

});

app.get('/api/users/:_id/exercises', (req, res) => {

  const {_id} = req.params;
  
  const user = Users.find((user) => user._id === Number(_id))
  
  if(!user){
      return res.json({error: "User not found"})
  }

  const userExercise = Exercises[user]

  res.json({ username: user.username, log: userExercise });
})


app.get('/api/users/:_id/logs' , (req , res) =>{

  const { _id } = req.params;

  const user = Users.find((user) => user._id === Number(_id));

  if(!user){
       return res.json({error : "User not found"})
  }

  const userExercise = Exercises[user]
  res.json({
      username : user.username,
      count : Exercises.length ,
      _id : user._id,
      log: userExercise
  })
})



const listener = app.listen(process.env.PORT || 7777, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
