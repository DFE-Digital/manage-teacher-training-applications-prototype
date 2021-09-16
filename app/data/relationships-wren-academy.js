const OrgHelper = require('./helpers/organisation')
const relationships = []
const userOrg = OrgHelper.findOrg('Wren Academy')

const partners = [
  'UCL, University College London',
  'Goldsmiths, University of London'
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
