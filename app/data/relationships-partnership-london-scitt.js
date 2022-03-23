const OrgHelper = require('./helpers/organisation')
let relationships = []
let userOrg = OrgHelper.findOrg("Partnership London SCITT")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: false,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Sydney Russell Teacher Training Centre"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})
relationships.push({
  id: 2,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("St Angela's Teacher Training Centre"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})
relationships.push({
  id: 3,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("St. Edward’s Teacher Training Partnership"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})

module.exports = relationships
