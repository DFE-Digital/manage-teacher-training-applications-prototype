const applications = require('../data/applications')
const _ = require('lodash');
const SettingsHelper = require('../data/helpers/settings')
module.exports = router => {

  router.post('/admin/settings/new-cycle', (req, res) => {
    var settings = req.session.data.settings

    // Disable start of new cycle
    if(settings.includes('new-cycle')) {
      req.session.data.applications = SettingsHelper.getMidCycleApplications(applications)
      _.remove(settings, function(item) { return item == 'new-cycle' })

    // Enable start of new cycle
    } else {
      req.session.data.applications = SettingsHelper.getStartOfCycleApplications(applications)
      settings.push('new-cycle')
    }
    res.redirect('/applications')
  })
}
