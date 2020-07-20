const faker = require('faker')
const organisation = require('./generators/organisation')

const generateFakeOrgansations = (count) => {
  const organisations = []

  for (var i = 0; i < count; i++) {
    organisations.push(organisation(faker))
  }

  return organisations
}

module.exports = (() => {
  return generateFakeOrgansations(10)
})()
