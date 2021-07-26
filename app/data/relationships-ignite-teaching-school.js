const OrgHelper = require('./helpers/organisation')
const relationships = []
const userOrg = OrgHelper.findOrg("Ignite Teaching School")

const partners = [
  'Suffolk and Norfolk Secondary SCITT',
  'University of East Anglia',
  'Suffolk and Norfolk Primary SCITT',
  'The OAKS (Ormiston and Keele SCITT)'
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
