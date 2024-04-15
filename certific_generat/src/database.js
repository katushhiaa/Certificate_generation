import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbName = 'database'

async function dbConnect() {
  try {
    await client.connect()
    const db = client.db(dbName)
    console.log('Connected to the database')
    return db
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

async function insertUser(db, userData) {
  const users = db.collection('users')
  try {
    const result = await users.insertOne(userData)
    console.log(`User inserted with the _id: ${result.insertedId}`)
    return result
  } catch (error) {
    console.error('Error inserting user into the database:', error)
    throw error
  }
}

export { dbConnect, insertUser }
