import express from 'express'
import mongoose from 'mongoose'

const app = express()

app.use(express.json())

mongoose.connect('mongodb://localhost:27017/database')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
})
const User = mongoose.model('User', userSchema)

app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body

  const newUser = new User({ name, email, password, role })
  console.log(newUser)
  db.collection('users').insertOne(newUser, (err) => {
    if (err) {
      throw err
    } else {
      console.log('User registered successfully')
      res.status(200).json({ message: 'User registered successfully' })
    }
  })
})

app.listen(3001, () => {
  console.log('Server is running')
})
