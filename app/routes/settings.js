module.exports = router => {
  router.post('/admin/settings', (req, res) => {

    if(Array.isArray(req.body.settings) && req.body.settings.includes('Turn on start new cycle')) {
      var applications = Object.values(req.session.data.applications).filter(app => {
        if(app.cycle == "Current cycle (2020 to 2021)") {
          return app.status == "Deferred"
        } else {
          return true;
        }
      })

      req.session.data.applications = {};

      applications.forEach(app => {
        req.session.data.applications[app.id] = app;
      })
    } else {
      req.session.data.applications = require('../data/applications')
    }

    res.redirect('/');

  })
}
