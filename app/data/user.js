const OrgHelper = require('./helpers/organisation')
const users = require('./users.json')
let userOrg = OrgHelper.findOrg("Goldsmiths, University of London")

// set up user orgs
let userOrgs = [];
userOrgs.push(userOrg)

// create user object
let user = users[0] // we know the first one is the test participant
user.organisations = userOrgs

module.exports = user
