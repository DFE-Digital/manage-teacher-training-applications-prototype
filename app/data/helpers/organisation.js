
const organisations = require('../organisations.json')

exports.findOrg = (name) => {
  return organisations.find(org => org.name == name)
}
