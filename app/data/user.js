const OrgHelper = require('./helpers/organisation')
const users = require('./users.json')
let userOrg = OrgHelper.findOrg("Endeavour TSA")

// set up user orgs
let userOrgs = [];
userOrgs.push(userOrg)

// create user object
let user = users[0]
user.organisations = userOrgs

module.exports = user