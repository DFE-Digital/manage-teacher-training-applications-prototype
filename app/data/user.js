const OrgHelper = require('./helpers/organisation')
const users = require('./users.json')
// const relationships = require('./relationships-the-millais-alliance')
// const relationships = require('./relationships-oxford-university')
const relationships = require('./relationships-the-university-of-warwick')

// set up user orgs
let userOrgs = [];
// userOrgs.push(OrgHelper.findOrg('The Millais Alliance'))
// userOrgs.push(OrgHelper.findOrg('Oxford University'))
userOrgs.push(OrgHelper.findOrg('The University of Warwick'))

// create user object
let user = users[0] // we know the first one is the test participant
user.organisations = userOrgs

// put relationships onto the user
user.relationships = relationships

module.exports = user
