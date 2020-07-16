const applications = require('../data/applications');

module.exports = router => {
  router.post('/admin/settings', (req, res) => {

    if(Array.isArray(req.body.settings) && req.body.settings.includes('Turn on start new cycle')) {
      req.session.data.applications = {};
      Object.values(applications).filter(app => {
        if(app.cycle == "Current cycle (2020 to 2021)") {
          return app.status == "Deferred"
        }
      }).forEach(app => {
        req.session.data.applications[app.id] = app;
      })
    } else {
      req.session.data.applications = Object.values(applications).filter(app => {
        return app.status != "Deferred";
      }).forEach(app => {
        req.session.data.applications[app.id] = app;
      });

    }

    res.redirect('/');

  })
}
