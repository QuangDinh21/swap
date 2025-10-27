/* eslint-disable @typescript-eslint/no-var-requires */
// const dotenv = require('dotenv')
// dotenv.config()
// const express = require('express')
// const bodyParser = require('body-parser')
// const crypto = require('crypto')
// const axios = require('axios')

// const ON_RAMP_HTTP_METHOD = 'GET'
// const ON_RAMP_REQUEST_PATH = '/index/rampPageBuy'
// const APP_ID = process.env.REACT_APP_ALCHEMY_PAY_APP_ID || ''
// const APP_SECRET = process.env.REACT_APP_ALCHEMY_PAY_APP_SECRET || ''
// const BASE_RAMP_URL = process.env.REACT_APP_ALCHEMY_PAY_BASE_RAMP_URL || ''

// const BASE_API_URL = process.env.REACT_APP_ALCHEMY_PAY_BASE_API_URL || ''

// const QUOTE_API_HTTP_METHOD = 'POST'
// const QUOTE_API_REQUEST_PATH = '/open/api/v4/merchant/quotes'

// const FIAT_API_HTTP_METHOD = 'GET'
// const FIAT_API_REQUEST_PATH = '/open/api/v4/merchant/fiat/list'
// const CRYPTO_API_HTTP_METHOD = 'GET'
// const CRYPTO_API_REQUEST_PATH = '/open/api/v4/merchant/crypto/list'

// function generateSignature(timestamp, httpMethod, requestPath, secretKey) {
//   const signatureString = timestamp + httpMethod + requestPath

//   const hmac = crypto.createHmac('sha256', secretKey)
//   hmac.update(signatureString)
//   const signature = hmac.digest('base64')

//   return encodeURIComponent(signature)
// }

// function getStringToSign(params) {
//   const sortedKeys = Object.keys(params).sort()
//   const s2s = sortedKeys
//     .map(key => {
//       const value = params[key]
//       if (Array.isArray(value) || value === '') {
//         return null
//       }
//       return `${key}=${value}`
//     })
//     .filter(Boolean)
//     .join('&')

//   return s2s
// }

// function removeEmptyKeys(map) {
//   const retMap = {}

//   for (const [key, value] of Object.entries(map)) {
//     if (value !== null && value !== '') {
//       retMap[key] = value
//     }
//   }

//   return retMap
// }

// function sortObject(obj) {
//   if (typeof obj !== 'object') {
//     return obj
//   }

//   if (Array.isArray(obj)) {
//     const objectList = []
//     const intList = []
//     const floatList = []
//     const stringList = []
//     const jsonArray = []

//     for (const item of obj) {
//       if (typeof item === 'object') {
//         jsonArray.push(item)
//       } else if (Number.isInteger(item)) {
//         intList.push(item)
//       } else if (typeof item === 'number') {
//         floatList.push(item)
//       } else if (typeof item === 'string') {
//         stringList.push(item)
//       } else {
//         intList.push(item)
//       }
//     }

//     intList.sort((a, b) => a - b)
//     floatList.sort((a, b) => a - b)
//     stringList.sort()

//     objectList.push(...intList, ...floatList, ...stringList, ...jsonArray)
//     obj.length = 0
//     obj.push(...objectList)

//     const retList = []
//     for (const item of obj) {
//       if (typeof item === 'object') {
//         retList.push(sortObject(item))
//       } else {
//         retList.push(item)
//       }
//     }
//     return retList
//   }

//   const sortedMap = new Map(Object.entries(removeEmptyKeys(obj)).sort(([aKey], [bKey]) => aKey.localeCompare(bKey)))

//   for (const [key, value] of sortedMap.entries()) {
//     if (typeof value === 'object') {
//       sortedMap.set(key, sortObject(value))
//     }
//   }

//   return Object.fromEntries(sortedMap.entries())
// }

// function getPath(requestUrl) {
//   const uri = new URL(requestUrl)
//   const path = uri.pathname
//   const params = Array.from(uri.searchParams.entries())

//   if (params.length === 0) {
//     return path
//   } else {
//     const sortedParams = [...params].sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
//     const queryString = sortedParams.map(([key, value]) => `${key}=${value}`).join('&')
//     return `${path}?${queryString}`
//   }
// }

// function getJsonBody(body) {
//   let map = {}

//   try {
//     map = JSON.parse(body)
//   } catch (error) {
//     map = {}
//   }

//   if (Object.keys(map).length === 0) {
//     return ''
//   }

//   map = removeEmptyKeys(map)
//   map = sortObject(map)

//   return JSON.stringify(map)
// }

// function getApiSignature(timestamp, method, path, body, secretkey) {
//   const content = timestamp + method.toUpperCase() + path + getJsonBody(body)
//   const signVal = crypto
//     .createHmac('sha256', secretkey)
//     .update(content, 'utf8')
//     .digest('base64')

//   return signVal
// }

// async function getQuote(payload) {
//   const timestamp = String(Date.now())
//   const method = QUOTE_API_HTTP_METHOD
//   const path = QUOTE_API_REQUEST_PATH
//   const body = JSON.stringify(payload)
//   const sign = getApiSignature(timestamp, method, path, body, APP_SECRET)

//   const res = await axios.post(`${BASE_API_URL}${QUOTE_API_REQUEST_PATH}`, payload, {
//     headers: {
//       'Content-Type': 'application/json',
//       appid: APP_ID,
//       timestamp: timestamp,
//       sign: sign
//     }
//   })
//   return res.data
// }

// async function getFiatList() {
//   const timestamp = String(Date.now())
//   const method = FIAT_API_HTTP_METHOD
//   const path = FIAT_API_REQUEST_PATH
//   const body = ''
//   const sign = getApiSignature(timestamp, method, path, body, APP_SECRET)

//   const res = await axios.get(`${BASE_API_URL}${FIAT_API_REQUEST_PATH}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       appid: APP_ID,
//       timestamp: timestamp,
//       sign: sign
//     }
//   })
//   return res.data
// }

// async function getCryptoList() {
//   const timestamp = String(Date.now())
//   const method = CRYPTO_API_HTTP_METHOD
//   const path = CRYPTO_API_REQUEST_PATH
//   const body = ''
//   const sign = getApiSignature(timestamp, method, path, body, APP_SECRET)

//   const res = await axios.get(`${BASE_API_URL}${CRYPTO_API_REQUEST_PATH}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       appid: APP_ID,
//       timestamp: timestamp,
//       sign: sign
//     }
//   })
//   return res.data
// }

// function getOnRampUrl(params) {
//   const timestamp = String(Date.now())

//   const paramsToSign = {
//     address: params.address,
//     crypto: params.crypto,
//     fiat: params.fiat,
//     fiatAmount: params.fiatAmount,
//     merchantOrderNo: params.merchantOrderNo,
//     network: params.network,
//     timestamp: timestamp,
//     appId: APP_ID,
//     redirectUrl: params.redirectUrl
//   }

//   const rawDataToSign = getStringToSign(paramsToSign)
//   const requestPathWithParams = ON_RAMP_REQUEST_PATH + '?' + rawDataToSign
//   const onRampSignature = generateSignature(timestamp, ON_RAMP_HTTP_METHOD, requestPathWithParams, APP_SECRET)

//   const finalLink = `${BASE_RAMP_URL}?${rawDataToSign}&sign=${onRampSignature}`
//   return finalLink
// }

// const port = parseInt(process.env.PORT, 10) || 3001

// const bootstrap = async () => {
//   const app = express()

//   // Body parser for JSON (needed to parse request bodies)
//   app.use(bodyParser.json())
//   app.use(bodyParser.urlencoded({ extended: false }))

//   // CORS (allow frontend to call your API)
//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

//     if (req.method === 'OPTIONS') {
//       return res.sendStatus(200)
//     }
//     return next()
//   })

//   // Alchemy Pay API routes
//   app.get('/api/fiat/list', (req, res, next) => {
//     getFiatList()
//       .then(fiats => {
//         res.json(fiats)
//       })
//       .catch(err => {
//         next(err)
//       })
//   })

//   app.get('/api/crypto/list', (req, res, next) => {
//     getCryptoList()
//       .then(cryptos => {
//         res.json(cryptos)
//       })
//       .catch(err => {
//         next(err)
//       })
//   })

//   app.post('/api/quotes', (req, res, next) => {
//     getQuote(req.body)
//       .then(quote => {
//         res.json(quote)
//       })
//       .catch(err => {
//         next(err)
//       })
//   })

//   app.get('/api/onramp/url', (req, res, next) => {
//     const { address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl } = req.query
//     const url = getOnRampUrl({ address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl })
//     res.json({ url })
//   })

//   // catch 404 and forward to error handler
//   app.use((req, res, next) => {
//     const err = new Error('Not Found - no root')
//     err.status = 404
//     next(err)
//   })

//   // error handlers

//   // Error handler
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500).json({
//       message: err.message,
//       ...(app.get('env') === 'development' && { error: err })
//     })
//   })

//   app.listen(port, err => {
//     if (err) throw err
//     console.log(`Server is running on port ${port}`)
//   })
// }
// bootstrap()

// api/index.js
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const axios = require('axios')
const serverless = require('serverless-http')

const ON_RAMP_HTTP_METHOD = 'GET'
const ON_RAMP_REQUEST_PATH = '/index/rampPageBuy'

const APP_ID = process.env.ALCHEMY_PAY_APP_ID || process.env.REACT_APP_ALCHEMY_PAY_APP_ID || ''
const APP_SECRET = process.env.ALCHEMY_PAY_APP_SECRET || process.env.REACT_APP_ALCHEMY_PAY_APP_SECRET || ''
const BASE_RAMP_URL = process.env.ALCHEMY_PAY_BASE_RAMP_URL || process.env.REACT_APP_ALCHEMY_PAY_BASE_RAMP_URL || ''
const BASE_API_URL = process.env.ALCHEMY_PAY_BASE_API_URL || process.env.REACT_APP_ALCHEMY_PAY_BASE_API_URL || ''

const QUOTE_API_HTTP_METHOD = 'POST'
const QUOTE_API_REQUEST_PATH = '/open/api/v4/merchant/quotes'

const FIAT_API_HTTP_METHOD = 'GET'
const FIAT_API_REQUEST_PATH = '/open/api/v4/merchant/fiat/list'

const CRYPTO_API_HTTP_METHOD = 'GET'
const CRYPTO_API_REQUEST_PATH = '/open/api/v4/merchant/crypto/list'

function generateSignature(timestamp, httpMethod, requestPath, secretKey) {
  const signatureString = timestamp + httpMethod + requestPath
  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(signatureString)
  const signature = hmac.digest('base64')
  return encodeURIComponent(signature)
}

function getStringToSign(params) {
  const sortedKeys = Object.keys(params).sort()
  const s2s = sortedKeys
    .map(key => {
      const value = params[key]
      if (Array.isArray(value) || value === '') return null
      return `${key}=${value}`
    })
    .filter(Boolean)
    .join('&')
  return s2s
}

function removeEmptyKeys(map) {
  const retMap = {}
  for (const [key, value] of Object.entries(map)) {
    if (value !== null && value !== '') retMap[key] = value
  }
  return retMap
}

function sortObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) {
    const objectList = []
    const intList = []
    const floatList = []
    const stringList = []
    const jsonArray = []

    for (const item of obj) {
      if (typeof item === 'object' && item !== null) jsonArray.push(item)
      else if (Number.isInteger(item)) intList.push(item)
      else if (typeof item === 'number') floatList.push(item)
      else if (typeof item === 'string') stringList.push(item)
      else intList.push(item)
    }

    intList.sort((a, b) => a - b)
    floatList.sort((a, b) => a - b)
    stringList.sort()

    objectList.push(...intList, ...floatList, ...stringList, ...jsonArray)
    const retList = []
    for (const item of objectList) retList.push(sortObject(item))
    return retList
  }

  const sortedMap = new Map(Object.entries(removeEmptyKeys(obj)).sort(([a], [b]) => a.localeCompare(b)))
  for (const [key, value] of sortedMap.entries()) {
    if (typeof value === 'object' && value !== null) sortedMap.set(key, sortObject(value))
  }
  return Object.fromEntries(sortedMap.entries())
}

function getJsonBody(body) {
  let map = {}
  try {
    map = JSON.parse(body)
  } catch {
    map = {}
  }
  if (Object.keys(map).length === 0) return ''
  map = removeEmptyKeys(map)
  map = sortObject(map)
  return JSON.stringify(map)
}

function getApiSignature(timestamp, method, path, body, secretkey) {
  const content = timestamp + method.toUpperCase() + path + getJsonBody(body)
  return crypto
    .createHmac('sha256', secretkey)
    .update(content, 'utf8')
    .digest('base64')
}

async function getQuote(payload) {
  const timestamp = String(Date.now())
  const body = JSON.stringify(payload)
  const sign = getApiSignature(timestamp, QUOTE_API_HTTP_METHOD, QUOTE_API_REQUEST_PATH, body, APP_SECRET)

  const res = await axios.post(`${BASE_API_URL}${QUOTE_API_REQUEST_PATH}`, payload, {
    headers: {
      'Content-Type': 'application/json',
      appid: APP_ID,
      timestamp,
      sign
    }
  })
  return res.data
}

async function getFiatList() {
  const timestamp = String(Date.now())
  const sign = getApiSignature(timestamp, FIAT_API_HTTP_METHOD, FIAT_API_REQUEST_PATH, '', APP_SECRET)

  const res = await axios.get(`${BASE_API_URL}${FIAT_API_REQUEST_PATH}`, {
    headers: {
      'Content-Type': 'application/json',
      appid: APP_ID,
      timestamp,
      sign
    }
  })
  return res.data
}

async function getCryptoList() {
  const timestamp = String(Date.now())
  const sign = getApiSignature(timestamp, CRYPTO_API_HTTP_METHOD, CRYPTO_API_REQUEST_PATH, '', APP_SECRET)

  const res = await axios.get(`${BASE_API_URL}${CRYPTO_API_REQUEST_PATH}`, {
    headers: {
      'Content-Type': 'application/json',
      appid: APP_ID,
      timestamp,
      sign
    }
  })
  return res.data
}

function getOnRampUrl(params) {
  const timestamp = String(Date.now())
  const paramsToSign = {
    address: params.address,
    crypto: params.crypto,
    fiat: params.fiat,
    fiatAmount: params.fiatAmount,
    merchantOrderNo: params.merchantOrderNo,
    network: params.network,
    timestamp,
    appId: APP_ID,
    redirectUrl: params.redirectUrl
  }

  const rawDataToSign = getStringToSign(paramsToSign)
  const requestPathWithParams = ON_RAMP_REQUEST_PATH + '?' + rawDataToSign
  const onRampSignature = generateSignature(timestamp, ON_RAMP_HTTP_METHOD, requestPathWithParams, APP_SECRET)
  const finalLink = `${BASE_RAMP_URL}?${rawDataToSign}&sign=${onRampSignature}`
  return finalLink
}

// ---------- Express app (no app.listen) ----------
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// CORS (adjust origin in production if needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // set to your domain in prod
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// ---- Routes (NO /api prefix here) ----
app.get('api/fiat/list', async (req, res, next) => {
  try {
    res.json(await getFiatList())
  } catch (err) {
    next(err)
  }
})

app.get('api/crypto/list', async (req, res, next) => {
  try {
    res.json(await getCryptoList())
  } catch (err) {
    next(err)
  }
})

app.post('api/quotes', async (req, res, next) => {
  try {
    res.json(await getQuote(req.body))
  } catch (err) {
    next(err)
  }
})

app.get('api/onramp/url', (req, res) => {
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

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { error: err })
  })
})

// Export a serverless handler for Vercel
module.exports = serverless(app)

// Start the server when running locally (not on Vercel)
if (require.main === module) {
  const port = parseInt(process.env.PORT, 10) || 3001
  app.listen(port, err => {
    if (err) throw err
    console.log(`Server is running on port ${port}`)
  })
}
