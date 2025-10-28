/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv')
dotenv.config()
const crypto = require('crypto')
const axios = require('axios')

const BASE_API_URL = process.env.REACT_APP_ALCHEMY_PAY_BASE_API_URL || ''
const APP_ID = process.env.REACT_APP_ALCHEMY_PAY_APP_ID || ''
const APP_SECRET = process.env.REACT_APP_ALCHEMY_PAY_APP_SECRET || ''
const BASE_RAMP_URL = process.env.REACT_APP_ALCHEMY_PAY_BASE_RAMP_URL || ''

// Utility functions
function removeEmptyKeys(map) {
  const retMap = {}
  for (const [key, value] of Object.entries(map)) {
    if (value !== null && value !== '') {
      retMap[key] = value
    }
  }
  return retMap
}

function sortObject(obj) {
  if (typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    const objectList = []
    const intList = []
    const floatList = []
    const stringList = []
    const jsonArray = []

    for (const item of obj) {
      if (typeof item === 'object') {
        jsonArray.push(item)
      } else if (Number.isInteger(item)) {
        intList.push(item)
      } else if (typeof item === 'number') {
        floatList.push(item)
      } else if (typeof item === 'string') {
        stringList.push(item)
      } else {
        intList.push(item)
      }
    }

    intList.sort((a, b) => a - b)
    floatList.sort((a, b) => a - b)
    stringList.sort()

    objectList.push(...intList, ...floatList, ...stringList, ...jsonArray)
    const retList = []
    for (const item of objectList) {
      if (typeof item === 'object') {
        retList.push(sortObject(item))
      } else {
        retList.push(item)
      }
    }
    return retList
  }

  const sortedMap = new Map(Object.entries(removeEmptyKeys(obj)).sort(([a], [b]) => a.localeCompare(b)))
  for (const [key, value] of sortedMap.entries()) {
    if (typeof value === 'object') {
      sortedMap.set(key, sortObject(value))
    }
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

function generateSignature(timestamp, httpMethod, requestPath, secretKey) {
  const signatureString = timestamp + httpMethod + requestPath
  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(signatureString)
  const signature = hmac.digest('base64')
  return encodeURIComponent(signature)
}

// API functions
async function getFiatList() {
  const timestamp = String(Date.now())
  const method = 'GET'
  const path = '/open/api/v4/merchant/fiat/list'
  const sign = getApiSignature(timestamp, method, path, '', APP_SECRET)

  const response = await axios.get(`${BASE_API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      appid: APP_ID,
      timestamp,
      sign
    }
  })
  return response.data
}

async function getCryptoList() {
  const timestamp = String(Date.now())
  const method = 'GET'
  const path = '/open/api/v4/merchant/crypto/list'
  const sign = getApiSignature(timestamp, method, path, '', APP_SECRET)

  const response = await axios.get(`${BASE_API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      appid: APP_ID,
      timestamp,
      sign
    }
  })
  return response.data
}

async function getQuote(payload) {
  const timestamp = String(Date.now())
  const method = 'POST'
  const path = '/open/api/v4/merchant/quotes'
  const body = JSON.stringify(payload)
  const sign = getApiSignature(timestamp, method, path, body, APP_SECRET)

  const response = await axios.post(`${BASE_API_URL}${path}`, payload, {
    headers: {
      'Content-Type': 'application/json',
      appid: APP_ID,
      timestamp,
      sign
    }
  })
  return response.data
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
  const requestPathWithParams = '/index/rampPageBuy?' + rawDataToSign
  const onRampSignature = generateSignature(timestamp, 'GET', requestPathWithParams, APP_SECRET)
  const finalLink = `${BASE_RAMP_URL}?${rawDataToSign}&sign=${onRampSignature}`
  return finalLink
}

module.exports = {
  getFiatList,
  getCryptoList,
  getQuote,
  getOnRampUrl
}
