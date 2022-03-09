const OrgHelper = require('./helpers/organisation')
const users = require('./users.json')
// const relationships = require('./relationships-the-millais-alliance')
const relationships = require('./relationships-yorkshire-and-humber-teacher-training')

// set up user orgs
let userOrgs = [];
userOrgs.push(OrgHelper.findOrg('Yorkshire and Humber Teacher Training'))

// create user object
let user = users[0] // we know the first one is the test participant
user.organisations = userOrgs

// put relationships onto the user
user.relationships = relationships

module.exports = user
