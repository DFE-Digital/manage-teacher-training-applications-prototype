const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')
const { DateTime } = require('luxon')
const organisations = require('./organisations.json')

function findOrg(name) {
  return organisations.find(org => org.name == name)
}

const trainingProviders = organisations.filter(org => {
  return !org.isAccreditedBody
})

const accreditedBodies = organisations.filter(org => {
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

let userOrg = findOrg("Leeds Trinity University")

let relationships = [{
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: false,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("Co-op Academies Trust School Direct - Primary"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 2,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("Diocese of Leeds BKCAT Alliance"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 3,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("Dixons Multi-Academy Trust (DMAT)"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 4,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("East One Partnership"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 5,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("Ilkley All Saints’ Teacher Training Partnership"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 6,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("Nicholas Postgate Catholic Academy Trust"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 7,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("North Star"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 8,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("Rodillian"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 9,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("St Anthony’s Primary Learning Partnership"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 10,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("St Bede’s Deanery Teaching Alliance"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 11,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("St. Mary’s TSA"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 12,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("The Beckfoot School Direct Partnership"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 13,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("The Catholic Schools Partnership Teaching School Alliance"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}, {
  id: 14,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: findOrg("The Yorkshire Rose Teaching Alliance"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
}];

let userOrgs = [userOrg];

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
  users,
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
