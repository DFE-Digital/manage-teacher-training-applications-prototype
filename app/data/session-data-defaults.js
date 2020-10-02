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

let relationships = [{
  org: trainingProviders[0],
  orgPermissions: {
    makeDecisions: true,
    safeguarding: true,
    diversity: true
  },
  partner: accreditedBodies[0],
  partnerPermissions: {
    makeDecisions: false,
    safeguarding: true,
    diversity: false
  }
}, {
  org: trainingProviders[0],
  orgPermissions: {
    makeDecisions: true,
    safeguarding: true,
    diversity: true
  },
  partner: accreditedBodies[1],
  partnerPermissions: {
    makeDecisions: false,
    safeguarding: true,
    diversity: false
  }
}, {
  org: trainingProviders[1],
  orgPermissions: {
    makeDecisions: true,
    safeguarding: true,
    diversity: true
  },
  partner: accreditedBodies[1],
  partnerPermissions: {
    makeDecisions: false,
    safeguarding: true,
    diversity: false
  }
}]

relationships = [{
  org: accreditedBodies[0],
  orgPermissions: {
    makeDecisions: true,
    safeguarding: false,
    diversity: true
  },
  partner: trainingProviders[1],
  partnerPermissions: {
    makeDecisions: false,
    safeguarding: false,
    diversity: false
  }
}, {
  org: trainingProviders[0],
  orgPermissions: {
    safeguarding: true,
    diversity: true
  },
  partner: accreditedBodies[0],
  partnerPermissions: {
    safeguarding: true,
    diversity: false
  }
}, {
  org: accreditedBodies[1],
  partner: trainingProviders[1],
}];

let userOrgs = [accreditedBodies[0], trainingProviders[0], accreditedBodies[1]];

module.exports = {
  settings: ["hasCombinedConditions"],
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
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
