const OrgHelper = require('./helpers/organisation')
let relationships = []
let userOrg = OrgHelper.findOrg("Teach Kent and Sussex SCITT")

relationships.push({
  id: 1,
  org1: userOrg,
  org1Permissions: {
    makeDecisions: false,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  },
  org2: OrgHelper.findOrg("Bennett Memorial Diocesan School"),
  org2Permissions: {
    makeDecisions: true,
    viewSafeguardingInformation: true,
    viewDiversityInformation: true
  }
})
// relationships.push({
//   id: 2,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Claremont Primary School"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })
// relationships.push({
//   id: 3,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Eastbourne Area School Direct Alliance"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })
// relationships.push({
//   id: 4,
//   org1: userOrg,
//   org1Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   },
//   org2: OrgHelper.findOrg("Wealden Partnership"),
//   org2Permissions: {
//     makeDecisions: true,
//     viewSafeguardingInformation: true,
//     viewDiversityInformation: true
//   }
// })

module.exports = relationships
