const applications = require('../data/applications')

module.exports = router => {
  router.post('/admin/settings', (req, res) => {
    if (Array.isArray(req.body.settings) && req.body.settings.includes('Turn on start new cycle')) {

      let deferredPast = applications
        .filter(app => app.cycle == "Previous cycle (2019 to 2020)")
        .filter(app => (app.status == 'Deferred'))

      let acceptedPast = applications
        .filter(app => app.cycle == "Previous cycle (2019 to 2020)")
        .filter(app => (app.status == 'Accepted'))

      let other = applications
        .filter(app => app.status !== 'Submitted')
        .filter(app => app.status !== 'Deferred')
        .filter(app => app.status !== 'Offered')
        .filter(app => app.status !== 'Accepted')
        .filter(app => app.status !== 'Conditions met')
        // .filter(app => app.status !== 'Rejected')

      req.session.data.applications = deferredPast.concat(acceptedPast).concat(other);

    } else {
      req.session.data.applications = applications.filter(app => {
        if (app.status === 'Deferred' && app.cycle === 'Previous cycle (2019 to 2020)') {
          return false;
        } else {
          return true;
        }
      })
      .filter(app => {
        if (app.status === 'Accepted' && app.cycle === 'Previous cycle (2019 to 2020)') {
          return false;
        } else {
          return true;
        }
      })
    }

    res.redirect('/')
  })
}
