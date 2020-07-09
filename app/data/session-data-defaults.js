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

  cycle: "Current cycle (2020 to 2021)",
  sortby: 'needs most attention',
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
