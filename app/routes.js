const express = require('express')
const router = express.Router()

require('./routes/application-list')(router)
require('./routes/activity-log')(router)
require('./routes/set-up-permissions')(router)
require('./routes/application')(router)
require('./routes/offer')(router)
require('./routes/withdraw-offer')(router)
require('./routes/make-offer')(router)
require('./routes/make-offer-to-new-provider')(router)
require('./routes/make-offer-to-new-course')(router)
require('./routes/make-offer-to-new-location')(router)
require('./routes/reject-application')(router)
require('./routes/feedback')(router)
require('./routes/change-offer-provider')(router)
require('./routes/change-offer-course')(router)
require('./routes/change-offer-location')(router)
require('./routes/change-condition-status')(router)
require('./routes/reconfirm-offer')(router)
require('./routes/reconfirm-change-condition-status')(router)
require('./routes/reconfirm-change-condition-status-to-new-course')(router)
require('./routes/reconfirm-change-condition-status-to-new-location')(router)
require('./routes/notes')(router)
require('./routes/organisations')(router)
require('./routes/users')(router)
require('./routes/email')(router)
require('./routes/settings')(router)

// Render other application pages
router.all('/search-results', (req, res) => {
  res.render('search-results', {
    q: req.query.q
  })
})

module.exports = router
