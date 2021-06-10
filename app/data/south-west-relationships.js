const OrgHelper = require('./helpers/organisation')
let relationships = []
let userOrg = OrgHelper.findOrg("South West Teacher Training")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Exeter Consortium"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: false
  }
})

module.exports = relationships
