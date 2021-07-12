const OrgHelper = require('./helpers/organisation')
const relationships = []
const userOrg = OrgHelper.findOrg("The University of Sheffield")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Mercia Learning Alliance"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: false
  }
})

module.exports = relationships
