const ApplicationHelper = require('../data/helpers/application')
const { DateTime } = require('luxon')

const trainingProviders = require('./organisations.json').filter(org => {
  return !org.isAccreditedBody
})

const accreditedBodies = require('./organisations.json').filter(org => {
  return org.isAccreditedBody
})

let applications = require('./applications.json')

let users = require('./users.json')

applications = applications.map(application => {
  Object.defineProperty(application, 'statusText', {
    get() {
      return ApplicationHelper.getStatusText(application);
    },
    enumerable: true
  })

  Object.defineProperty(application.personalDetails, 'name', {
    get() {
      return `${this.givenName} ${this.familyName}`
    },
    enumerable: true
  })

  Object.defineProperty(application, 'respondByDate', {
    get() {
      return DateTime.fromISO(application.submittedDate).plus({ days: 40 })
    },
    enumerable: true
  })

  Object.defineProperty(application, 'daysToRespond', {
    get() {
      if(application.status != 'Awaiting decision') {
        return null;
      }
      const now = DateTime.fromISO('2020-08-15')
      let diff = application.respondByDate.diff(now, 'days').toObject().days
      diff = Math.round(diff)
      if (diff < 1) {
        diff = 0
      }
      return diff;
    },
    enumerable: true
  })

  if(application.offer) {
    Object.defineProperty(application.offer, 'declineByDate', {
      get() {
        return DateTime.fromISO(application.offer.madeDate).plus({ days: 10 })
      },
      enumerable: true
    })

    Object.defineProperty(application.offer, 'daysToDecline', {
      get() {
        if(application.status != 'Offered') {
          return null;
        }
        const now = DateTime.fromISO('2020-08-15')
        let diff = application.offer.declineByDate.diff(now, 'days').toObject().days
        diff = Math.round(diff)
        if (diff < 1) {
          diff = 0
        }
        return diff;
      },
      enumerable: true
    })
  }

  return application
})

applications = applications
  .filter(app => {
    if (app.status === 'Deferred' && app.cycle === '2019 to 2020') {
      return false;
    } else {
      return true;
    }
  })
  .filter(app => {
    if (app.status === 'Accepted' && app.cycle === '2019 to 2020') {
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
  emailsettings: ['Application submitted', 'Application withdrawn', 'Application automatically rejected', 'Offer accepted', 'Offer declined automatically', 'Offer declined'],
  settings: [],
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
  'new-offer': {
    'standard-conditions': [
      "Fitness to teach check",
      "Disclosure and barring service check"
    ]
  },
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
