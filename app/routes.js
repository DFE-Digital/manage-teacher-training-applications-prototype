const express = require('express')
const router = express.Router()

require('./routes/application')(router)

module.exports = router
