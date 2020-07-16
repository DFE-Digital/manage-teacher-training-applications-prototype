const organisations = require('./organisations')
const applications = require('./applications')

module.exports = {
  applications,
  organisations: Object.values(organisations).filter(org => {
    return org.enabled;
  }),
  accreditedbodies: Object.values(organisations).filter(org => {
    return org.isaccreditedbody;
  }),

  settings: ["Only show deferred applications for current cycle"],
  cycle: "Current cycle (2020 to 2021)",
  sortby: 'most urgent',
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
