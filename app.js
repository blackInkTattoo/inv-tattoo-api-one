const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { connectionDB } = require('./database/connection')
const router = require('./src/routes/index')
const { defaultUser } = require('./src/services/users/user.services')

const PORT = process.env.PORT || 3002
const app = express()

app.set('port', PORT)
app.use(express.json())
app.use(cors())
app.use('/', router)

app.listen(app.get('port'), async () => {
  try {
    console.log(`server running on port ${app.get('port')}`)
    await connectionDB.connect()
    await defaultUser()
  } catch (error) {
    throw new Error(error)
  }
})
