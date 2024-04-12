/*let express = require('express')

const { MongoClient } = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbName = 'Diplom'

async function dbConnect() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db(dbName)
    return db
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
    throw err
  }
}

async function registerUser(userData) {
  try {
    const db = await dbConnect()
    const collection = db.collection('users')
    const result = await collection.insertOne(userData)
    console.log('User registered:', result.insertedId)
    return result.insertedId
  } catch (err) {
    console.error('Error registering user:', err)
    throw err
  }
}

module.exports = { dbConnect, registerUser }*/
