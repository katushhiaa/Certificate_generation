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

app.post('/signup', async (req) => {
  const { name, email, password, role } = req.body
  try {
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      return console.log('Користувач з цією електронною адресою вже існує')
    }
    const newUser = new User({ name, email, password, role })
    console.log(newUser)
    await newUser.save()
    console.log('User registered successfully')
  } catch (error) {
    console.error(error)
  }
})

app.post('/login', async (req) => {
  const { name, password, role } = req.body
  try {
    const user = await User.findOne({ name, password, role })
    if (user) {
      console.log('Вхід успішний', user)
    } else {
      console.log('Неправильні дані входу')
    }
  } catch (error) {
    console.error(error)
    return console.log('Помилка сервера')
  }
})

app.listen(3001, () => {
  console.log('Server is running')
})
