const ApplicationHelper = require('../data/helpers/application')
const CycleHelper = require('../data/helpers/cycles')
const SystemHelper = require('../data/helpers/system')
const SettingsHelper = require('../data/helpers/settings')
// const OrgHelper = require('../data/helpers/organisation')
const { DateTime } = require('luxon')
const users = require('./users.json')
const user = require('./user')
const relationships = user.relationships
let applications = require('./applications.json')
let defaults = {}

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

defaults.emailsettings = [
  'Application received',
  'Application withdrawn',
  'Application automatically rejected',
  'Offer accepted',
  'Offer automatically declined',
  'Offer declined'
]

defaults.user = user

defaults["standard-conditions"] = [
  "Fitness to train to teach check",
  "Disclosure and Barring Service (DBS) check",
  "References"
]

defaults['new-offer'] = {
  'standard-conditions': [
    "Fitness to train to teach check",
    "Disclosure and Barring Service (DBS) check",
    "References"
  ]
}

defaults.relationships = relationships
defaults.trainingProviders = trainingProviders
defaults.accreditedBodies = accreditedBodies
defaults.organisations = organisations
defaults.users = users
defaults.currentCycle = CycleHelper.CURRENT_CYCLE
defaults.previousCycle = CycleHelper.PREVIOUS_CYCLE
defaults.nextCycle = CycleHelper.NEXT_CYCLE

// Uncomment this to put the prototype into a mid cycle state
defaults.applications = SettingsHelper.getMidCycleApplications(applications)
defaults.settings = []

defaults.sort = 'Status'

// Uncomment this to put the prototype into a start of cycle state
// defaults.applications = SettingsHelper.getStartOfCycleApplications(applications);
// defaults.settings = ['new-cycle']

module.exports = defaults
