const trainingProviders = require('./organisations.json').filter(org => {
  return !org.isAccreditedBody
})

const accreditedBodies = require('./organisations.json').filter(org => {
  return org.isAccreditedBody
})

let applications = require('./applications.json')

let users = require('./users.json')

applications = applications.map(application => {
  Object.defineProperty(application.personalDetails, 'name', {
    get() {
      return `${this.givenName} ${this.familyName}`
    },
    enumerable: true
  })
  return application
})

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

let relationships = [{
  org1: trainingProviders[0],
  org1Permissions: {
    makeDecisions: false,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: accreditedBodies[0],
  org2Permissions: {
    makeDecisions: false,
    viewSafeguardingInformation: true,
    viewDiversityInformation: false
  }
}, {
  org1: trainingProviders[0],
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: accreditedBodies[1],
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: false
  }
}];

let userOrgs = [trainingProviders[0], accreditedBodies[0], accreditedBodies[1]];

module.exports = {
  user: {
    givenName: "Claudine",
    familyName: "Adams",
    emailAddress: "claudine.adams@newzoescitt.co.uk",
    organisations: userOrgs,
    relationships: relationships
  },
  "standard-conditions" : [
    "Fitness to teach check",
    "Disclosure and barring service check"
  ],
  relationships,
  applications,
  trainingProviders,
  accreditedBodies,
  organisations: require('./organisations.json'),
  users,
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
