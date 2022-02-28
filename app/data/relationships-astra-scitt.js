const OrgHelper = require('./helpers/organisation')
let relationships = []
let userOrg = OrgHelper.findOrg("Astra SCITT")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: false,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Astra Aylesbury Hub"),
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
  org2: OrgHelper.findOrg("Astra Marlow Hub"),
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
  org2: OrgHelper.findOrg("Astra Amersham Hub"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})

module.exports = relationships
