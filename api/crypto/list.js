/* eslint-disable @typescript-eslint/no-var-requires */
const { getCryptoList } = require('../backend/common')

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
    const data = await getCryptoList()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching crypto list:', error)
    res.status(500).json({ error: 'Failed to fetch crypto list' })
  }
}
