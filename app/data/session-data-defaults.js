const applications = require('./applications')

module.exports = {
  applications,
  cycle: "Current cycle (2020 to 2021)",
  sortby: 'most urgent',
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
