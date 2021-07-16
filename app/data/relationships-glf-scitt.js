const OrgHelper = require('./helpers/organisation')
const relationships = []
const userOrg = OrgHelper.findOrg("GLF School’s Teacher Training")

const partners = [
  'GLF School’s Teacher Training',
  'Glyn School'
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
