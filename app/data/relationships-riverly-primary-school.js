const OrgHelper = require('./helpers/organisation')
let relationships = []
let userOrg = OrgHelper.findOrg("Riverley Primary School")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("University of East London"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})

module.exports = relationships
