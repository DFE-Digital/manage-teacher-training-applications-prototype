const organisations = require('./organisations.json')
const applications = require('./applications.json').filter(app => {
  return app.status != "Deferred";
})

module.exports = {
  applications,
  organisations: organisations.filter(org => {
    return org.enabled
  }),
  accreditedbodies: organisations.filter(org => {
    return org.isaccreditedbody
  }),
  cycle: 'Current cycle (2020 to 2021)',
  sortby: 'most urgent',
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
