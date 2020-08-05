const organisations = require('./organisations.json')
let applications = require('./applications.json')

applications = applications.filter(app => {
  if (app.status === 'Deferred' && app.cycle === 'Previous cycle (2019 to 2020)') {
    return false;
  } else {
    return true;
  }
})

// applications = applications.filter(app => {
//   return app.status === 'Deferred'
// })

module.exports = {
  applications,
  organisations: organisations.filter(org => {
    return org.enabled
  }),
  accreditedbodies: organisations.filter(org => {
    return org.isaccreditedbody
  }),
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
