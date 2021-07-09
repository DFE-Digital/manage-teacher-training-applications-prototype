const OrgHelper = require('./helpers/organisation')
const relationships = []
const userOrg = OrgHelper.findOrg("Chiltern Training Group")

const partners = [
  'Chiltern Training Group part of the Chiltern Learning trust',
  'The Acorn Teaching School'
]

partners.forEach((partner, i) => {
  relationships.push({
    id: i,
    org1: userOrg,
    org1Permissions: {
      makeDecisions: true,
      viewSafeguardingInformation: false,
      viewDiversityInformation: true
    },
    org2: OrgHelper.findOrg(partner),
    org2Permissions: {
      makeDecisions: true,
      viewSafeguardingInformation: false,
      viewDiversityInformation: false
    }
  })
})

module.exports = relationships
