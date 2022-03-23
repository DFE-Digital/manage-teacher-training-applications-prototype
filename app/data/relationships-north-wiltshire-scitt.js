const OrgHelper = require('./helpers/organisation')
let relationships = []
let userOrg = OrgHelper.findOrg("North Wiltshire SCITT")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: false,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Blue Kite Academy Trust"),
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
  org2: OrgHelper.findOrg("Pickwick Learning"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})

module.exports = relationships
