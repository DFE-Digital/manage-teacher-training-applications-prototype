const express = require('express')
const router = express.Router()

require('./routes/application')(router)
require('./routes/email')(router)

// Render other application pages
router.all('/search-results', (req, res) => {
  res.render('search-results', {
    q: req.query.q
  })
})

module.exports = router
