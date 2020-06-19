const applications = require('./applications')

module.exports = {
  applications,
  cycle: "2019-20",
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
