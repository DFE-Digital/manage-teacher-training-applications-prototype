const OrgHelper = require('./helpers/organisation')
const users = require('./users.json')
const userOrg1 = OrgHelper.findOrg("Ignite Teaching School")
const userOrg2 = OrgHelper.findOrg("The OAKS Norfolk")

// set up user orgs
let userOrgs = [];
userOrgs.push(userOrg1)
userOrgs.push(userOrg2)

// create user object
let user = users[0] // we know the first one is the test participant
user.organisations = userOrgs

module.exports = user
