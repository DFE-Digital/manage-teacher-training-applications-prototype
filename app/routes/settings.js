const applications = require('../data/applications')

module.exports = router => {
  router.post('/admin/settings', (req, res) => {
    if (Array.isArray(req.body.settings) && req.body.settings.includes('Turn on start new cycle')) {
      req.session.data.applications = applications.filter(app => {
        if (app.cycle === 'Previous cycle (2019 to 2020)') {
          return app.status === 'Deferred'
        }
      })
    } else {
      req.session.data.applications = applications.filter(app => {
        if (app.status === 'Deferred' && app.cycle === 'Previous cycle (2019 to 2020)') {
          return false;
        } else {
          return true;
        }
      })
    }

    res.redirect('/')
  })
}
