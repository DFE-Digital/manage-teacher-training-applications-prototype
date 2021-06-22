
const organisations = require('../organisations.json')
// const relationships = require('../relationships-leicester')

exports.findOrg = (name) => {
  return organisations.find(org => org.name == name)
}

// exports.getPartnerOrgs = (name) => {
//   return relationships
//     .filter(relationship => relationship.org1.name == name)
//     .map(relationship => relationship.org2)
// }
