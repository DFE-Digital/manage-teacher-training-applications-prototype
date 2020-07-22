const organisations = require('./organisations')
const applications = require('./applications.json').filter(app => {
  return app.status != "Deferred";
})

module.exports = {
  applications,
  organisations: Object.values(organisations).filter(org => {
    return org.enabled
  }),
  accreditedbodies: Object.values(organisations).filter(org => {
    return org.isaccreditedbody
  }),
  cycle: 'Current cycle (2020 to 2021)',
  sortby: 'most urgent',
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
