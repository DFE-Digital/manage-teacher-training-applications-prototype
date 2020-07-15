module.exports = router => {
  router.post('/admin/settings', (req, res) => {

    console.log(req.session.data)

    if(Array.isArray(req.body.settings)) {
      if(req.body.settings.includes('Exclude deferred offers')) {

        var applications = Object.values(req.session.data.applications).filter(app => {
          return app.status != "Deferred"
        })

        req.session.data.applications = {};

        applications.forEach(app => {
          req.session.data.applications[app.id] = app;
        })
      } else {
        req.session.data.applications = require('../data/applications')
      }
    } else {
      req.session.data.applications = require('../data/applications')
    }

    res.redirect('/');

  })
}
