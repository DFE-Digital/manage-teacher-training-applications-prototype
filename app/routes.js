const express = require('express')
const router = express.Router()

require('./routes/application-list')(router)
require('./routes/application')(router)
require('./routes/enroll')(router)
require('./routes/withdraw-offer')(router)
require('./routes/make-offer')(router)
require('./routes/make-offer-to-new-provider')(router)
require('./routes/make-offer-to-new-course')(router)
require('./routes/make-offer-to-new-location')(router)
require('./routes/reject-application')(router)
require('./routes/change-offer-provider')(router)
require('./routes/change-offer-course')(router)
require('./routes/change-offer-location')(router)
require('./routes/change-condition-status')(router)
require('./routes/notes')(router)
require('./routes/organisations')(router)
require('./routes/users')(router)
require('./routes/email')(router)

// Render other application pages
router.all('/search-results', (req, res) => {
  res.render('search-results', {
    q: req.query.q
  })
})

module.exports = router
