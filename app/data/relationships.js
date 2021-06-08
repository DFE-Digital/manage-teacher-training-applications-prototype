const OrgHelper = require('./helpers/organisation')
let relationships = []
let userOrg = OrgHelper.findOrg("University of Leicester")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Ashlawn Teaching School"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: false
  }
})
relationships.push({
  id: 2,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("The Beauchamp Lionheart Training Partnership"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: false
  }
})
relationships.push({
  id: 3,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: false
  },
  org2: OrgHelper.findOrg("President Kennedy Teaching School Alliance"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})
relationships.push({
  id: 4,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Southam Teaching Alliance"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})
// relationships.push({
//   id: 5,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: false,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Fenland Teaching School Alliance"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })
// relationships.push({
//   id: 6,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: false,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Goldington Academy"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })
// relationships.push({
//   id: 7,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: false,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Luton Futures"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })
// relationships.push({
//   id: 8,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: false,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Middlefield Primary Academy"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })
// relationships.push({
//   id: 9,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: false,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Nene and Ramnoth"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })
// relationships.push({
//   id: 10,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: false,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Redborne Upper School And Community College"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })
// relationships.push({
//   id: 11,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: false,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Thorndown Primary School"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })

module.exports = relationships
