const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')
const OrgHelper = require('../data/helpers/organisation')
const { DateTime } = require('luxon')
let applications = require('./applications.json')
const users = require('./users.json')
const relationships = require('./relationships-leicester.js')
const user = require('./user')

// get related training providers
const trainingProviders = []
const accreditedBodies = []
user.organisations.forEach(org => {
  if(org.isAccreditedBody) {
    accreditedBodies.push(org)
      relationships
        .filter(relationship => relationship.org1.id == org.id)
        .map(relationship => relationship.org2).forEach(org => {
          trainingProviders.push(org)
        })
  } else {
    trainingProviders.push(org)
    relationships
      .filter(relationship => relationship.org1.id == org.id)
      .map(relationship => relationship.org2).forEach(org => {
        accreditedBodies.push(org)
      })
  }
})

const organisations = trainingProviders.concat(accreditedBodies)

applications = applications.map(application => {
  Object.defineProperty(application.personalDetails, 'name', {
    get() {
      return `${this.givenName} ${this.familyName}`
    },
    enumerable: true
  })

  Object.defineProperty(application, 'respondByDate', {
    get() {
      return DateTime.fromISO(application.submittedDate).plus({ days: 40 }).toISO()
    },
    enumerable: true
  })

  Object.defineProperty(application, 'daysToRespond', {
    get() {
      if(application.status != 'Received' && application.status != 'Interviewing') {
        return null;
      }
      const now = SystemHelper.now()
      let diff = DateTime.fromISO(application.respondByDate).diff(now, 'days').toObject().days
      diff = Math.round(diff)
      if (diff < 1) {
        diff = 0
      }
      return diff;
    },
    enumerable: true
  })

  if(application.offer) {
    application.offer.declineByDate = ApplicationHelper.calculateDeclineDate(application)
    application.offer.daysToDecline = ApplicationHelper.calculateDaysToDecline(application)
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
    if (app.status === 'Awaiting conditions' && app.cycle === '2019 to 2020') {
      return false;
    } else {
      return true;
    }
  })

module.exports = {
  emailsettings: ['Application submitted', 'Application withdrawn', 'Application automatically rejected', 'Offer accepted', 'Offer declined automatically', 'Offer declined'],
  settings: [],
  user,
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
  organisations,
  users
}
