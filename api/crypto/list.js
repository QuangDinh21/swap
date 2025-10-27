/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv')
dotenv.config()

const crypto = require('crypto')
const axios = require('axios')

const BASE_API_URL = process.env.REACT_APP_ALCHEMY_PAY_BASE_API_URL || ''
const APP_ID = process.env.REACT_APP_ALCHEMY_PAY_APP_ID || ''
const APP_SECRET = process.env.REACT_APP_ALCHEMY_PAY_APP_SECRET || ''

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
    obj.length = 0
    obj.push(...objectList)

    const retList = []
    for (const item of obj) {
      if (typeof item === 'object') {
        retList.push(sortObject(item))
      } else {
        retList.push(item)
      }
    }
    return retList
  }

  const sortedMap = new Map(Object.entries(removeEmptyKeys(obj)).sort(([aKey], [bKey]) => aKey.localeCompare(bKey)))

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
  } catch (error) {
    map = {}
  }

  if (Object.keys(map).length === 0) {
    return ''
  }

  map = removeEmptyKeys(map)
  map = sortObject(map)

  return JSON.stringify(map)
}

function getApiSignature(timestamp, method, path, body, secretkey) {
  const content = timestamp + method.toUpperCase() + path + getJsonBody(body)
  const signVal = crypto
    .createHmac('sha256', secretkey)
    .update(content, 'utf8')
    .digest('base64')
  return signVal
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const timestamp = String(Date.now())
    const method = 'GET'
    const path = '/open/api/v4/merchant/crypto/list'
    const body = ''
    const sign = getApiSignature(timestamp, method, path, body, APP_SECRET)

    const response = await axios.get(`${BASE_API_URL}/crypto/list`, {
      headers: {
        'Content-Type': 'application/json',
        appid: APP_ID,
        timestamp: timestamp,
        sign: sign
      }
    })

    res.status(200).json(response.data)
  } catch (error) {
    console.error('Error fetching crypto list:', error)
    res.status(500).json({ error: 'Failed to fetch crypto list' })
  }
}
