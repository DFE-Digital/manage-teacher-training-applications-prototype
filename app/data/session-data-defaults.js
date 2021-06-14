const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')
const OrgHelper = require('../data/helpers/organisation')
const { DateTime } = require('luxon')
const organisations = require('./organisations.json')
let applications = require('./applications.json')
const users = require('./users.json')
// const relationships = require('./relationships-leicester.js')
const relationships = require('./relationships-goldsmiths.js')
// const relationships = require('./relationships-south-west-teacher-training.js')
// const relationships = require('./relationships-endeavour-tsa.js')
// const relationships = require('./relationships-tes-institute.js')
// const relationships = require('./relationships-thomas-estley-community-college.js')
// const relationships = require('./relationships-riverly-primary-school.js')
// const relationships = require('./relationships-teach-kent-and-sussex-scitt.js')
// const userOrg = OrgHelper.findOrg("University of Leicester")
const userOrg = OrgHelper.findOrg("Goldsmiths, University of London")
// const userOrg = OrgHelper.findOrg("South West Teacher Training")
// const userOrg = OrgHelper.findOrg("Essex Teacher Training")
// const userOrg = OrgHelper.findOrg("Endeavour TSA")
// const userOrg = OrgHelper.findOrg("Tes Institute")
// const userOrg = OrgHelper.findOrg("Thomas Estley Community College")
// const userOrg = OrgHelper.findOrg("Riverley Primary School")
// const userOrg = OrgHelper.findOrg("Teach Kent and Sussex SCITT")

const trainingProviders = organisations.filter(org => {
  return !org.isAccreditedBody
})

const accreditedBodies = organisations.filter(org => {
  return org.isAccreditedBody
})

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

let userOrgs = [];

userOrgs.push(userOrg)
// userOrgs.push(OrgHelper.findOrg("Ashlawn Teaching School"))

let user = users[0]
user.organisations = userOrgs

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
