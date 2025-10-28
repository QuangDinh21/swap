/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const bodyParser = require('body-parser')
const { getFiatList, getCryptoList, getQuote, getOnRampUrl } = require('./common')

const port = parseInt(process.env.PORT, 10) || 3001

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  return next()
})

// Routes
app.get('/api/fiat/list', async (req, res, next) => {
  try {
    res.json(await getFiatList())
  } catch (err) {
    next(err)
  }
})

app.get('/api/crypto/list', async (req, res, next) => {
  try {
    res.json(await getCryptoList())
  } catch (err) {
    next(err)
  }
})

app.post('/api/quotes', async (req, res, next) => {
  try {
    res.json(await getQuote(req.body))
  } catch (err) {
    next(err)
  }
})

app.get('/api/onramp/url', (req, res) => {
  const { address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl } = req.query
  const url = getOnRampUrl({ address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl })
  res.json({ url })
})

// 404
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    ...(app.get('env') === 'development' && { error: err })
  })
})

app.listen(port, err => {
  if (err) throw err
  console.log(`Server is running on port ${port}`)
})
