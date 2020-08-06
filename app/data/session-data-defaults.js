const trainingProviders = require('./organisations.json').filter(org => {
  return !org.isAccreditedBody
})

const accreditedBodies = require('./organisations.json').filter(org => {
  return org.isAccreditedBody
})

let applications = require('./applications.json')

applications = applications
  .filter(app => {
    if (app.status === 'Deferred' && app.cycle === 'Previous cycle (2019 to 2020)') {
      return false;
    } else {
      return true;
    }
  })
  .filter(app => {
    if (app.status === 'Accepted' && app.cycle === 'Previous cycle (2019 to 2020)') {
      return false;
    } else {
      return true;
    }
  })

module.exports = {
  user: {
    givenName: "Adam",
    familyName: "Silver",
    emailAddress: "adam.silver@tescitt.co.uk",
    organisations: [trainingProviders[0], trainingProviders[1]]
  },
  applications,
  trainingProviders,
  accreditedBodies,
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
