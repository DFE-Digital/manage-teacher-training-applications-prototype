
const organisations = require('../organisations.json')

exports.findOrg = (name) => {
  return organisations.find(org => org.name == name)
}

exports.findOrgById = (id) => {
  return organisations.find(org => org.id == id)
}
