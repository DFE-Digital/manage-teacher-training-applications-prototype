const OrgHelper = require('./helpers/organisation')
const users = require('./users.json')
// const userOrg = OrgHelper.findOrg("Ignite Teaching School")

// set up user orgs
let userOrgs = [];
userOrgs.push(OrgHelper.findOrg("Ignite Teaching School"))
userOrgs.push(OrgHelper.findOrg("The OAKS Norfolk"))

// create user object
let user = users[0] // we know the first one is the test participant
user.organisations = userOrgs

module.exports = user
