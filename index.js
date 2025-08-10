const express = require('express')
const axios = require('axios')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

const API_BASE_URL = 'http://109.73.206.144:6969/api'
const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

const forwardRequest = (endpoint) => async (req, res) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      params: {
        ...req.query,
        key: API_KEY,
      },
    })
    res.json(data)
  } catch (error) {
    console.error('Ошибка при обращении к внешнему API:', error?.response?.data || error.message)
    res.status(error?.response?.status || 500).json({
      error: 'Ошибка при запросе к внешнему API',
      details: error?.response?.data || error.message,
    })
  }
}

app.get('/api/incomes', forwardRequest('incomes'))
app.get('/api/orders', forwardRequest('orders'))
app.get('/api/sales', forwardRequest('sales'))
app.get('/api/stocks', forwardRequest('stocks'))

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
