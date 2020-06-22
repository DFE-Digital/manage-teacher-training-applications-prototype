const applications = require('./applications')

module.exports = {
  applications,
  cycle: "2020-2021 (current cycle)",
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
