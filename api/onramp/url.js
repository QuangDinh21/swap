/* eslint-disable @typescript-eslint/no-var-requires */
const { getOnRampUrl } = require('../../backend/common')

module.exports = async function handler(req, res) {
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
