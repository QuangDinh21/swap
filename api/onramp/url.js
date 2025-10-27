/* eslint-disable @typescript-eslint/no-var-requires */
const crypto = require('crypto')

const APP_ID = process.env.REACT_APP_ALCHEMY_PAY_APP_ID || ''
const APP_SECRET = process.env.REACT_APP_ALCHEMY_PAY_APP_SECRET || ''
const BASE_RAMP_URL = process.env.REACT_APP_ALCHEMY_PAY_BASE_RAMP_URL || ''
const ON_RAMP_REQUEST_PATH = '/index/rampPageBuy'

function getStringToSign(params) {
  const sortedKeys = Object.keys(params).sort()
  const s2s = sortedKeys
    .map(key => {
      const value = params[key]
      if (Array.isArray(value) || value === '') {
        return null
      }
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

function getOnRampUrl(params) {
  const timestamp = String(Date.now())

  const paramsToSign = {
    address: params.address,
    crypto: params.crypto,
    fiat: params.fiat,
    fiatAmount: params.fiatAmount,
    merchantOrderNo: params.merchantOrderNo,
    network: params.network,
    timestamp: timestamp,
    appId: APP_ID,
    redirectUrl: params.redirectUrl
  }

  const rawDataToSign = getStringToSign(paramsToSign)
  const requestPathWithParams = ON_RAMP_REQUEST_PATH + '?' + rawDataToSign
  const onRampSignature = generateSignature(timestamp, 'GET', requestPathWithParams, APP_SECRET)

  const finalLink = `${BASE_RAMP_URL}?${rawDataToSign}&sign=${onRampSignature}`
  return finalLink
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
    const { address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl } = req.query
    const url = getOnRampUrl({ address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl })
    res.status(200).json({ url })
  } catch (error) {
    console.error('Error generating onramp URL:', error)
    res.status(500).json({ error: 'Failed to generate onramp URL' })
  }
}
