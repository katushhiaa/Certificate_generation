import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

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
  try {
    const newUser = new User({ name, email, password, role })
    console.log(newUser)
    await newUser.save()
    console.log('User registered successfully')
    return res.status(200).json({ message: 'Користувач успішно зареєстрований' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Помилка при реєстрації користувача' })
  }
})

app.listen(3001, () => {
  console.log('Server is running')
})
