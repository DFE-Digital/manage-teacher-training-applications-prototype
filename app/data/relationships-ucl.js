const OrgHelper = require('./helpers/organisation')
const relationships = []
const userOrg = OrgHelper.findOrg("University College London")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("The Compton School"),
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
  org2: OrgHelper.findOrg("Academies Enterprise Trust: London"),
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
  org2: OrgHelper.findOrg("Beal High School (NELTA)"),
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
  org2: OrgHelper.findOrg("Catholic Schools’ Partnership"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})

relationships.push({
  id: 5,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Waltham Forest Teaching School Alliance"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})

relationships.push({
  id: 6,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: false,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Kingston School Direct"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})

module.exports = relationships
