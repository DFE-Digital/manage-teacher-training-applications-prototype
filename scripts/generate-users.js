const fs = require('fs')
const path = require('path')
const { fakerEN_GB: faker } = require('@faker-js/faker')
const generatorHelpers = require('../app/data/helpers/generators')
const OrgHelper = require('../app/data/helpers/organisation')
const generateUser = require('../app/data/generators/user')

const generateFakeUser = (params = {}) => {
  return generateUser(faker, params)
}

const generateFakeUsers = (count) => {
  const organisations = require('../app/data/organisations.json')
  const users = []
  const mainOrg = OrgHelper.findOrg('Birmingham SCITT')

  const firstName = 'Lydia'
  const lastName = 'Obirek'
  const emailAddress = 'l.obirek@warwick.ac.uk'

  users.push({
    id: faker.string.uuid(),
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    organisation: mainOrg,
    permissions: {
      manageOrganisation: true,
      manageUsers: true,
      setupInterviews: true,
      makeDecisions: true,
      viewSafeguardingInformation: true,
      viewDiversityInformation: true
    }
  })

  // organisations.forEach(organisation => {
  //   for(var i = 0; i < 5; i++) {
  //     let firstName = generatorHelpers.firstName(faker.helpers.arrayElement([0,1]))
  //     let lastName = generatorHelpers.lastName()
  //     users.push({
  //       id: faker.string.uuid(),
  //       firstName,
  //       lastName,
  //       emailAddress: `${firstName.replace(/\s/g, '').toLowerCase()}.${lastName.toLowerCase()}@${organisation.domain}`,
  //       organisation,
  //       permissions: {
  //         manageOrganisation: faker.helpers.arrayElement([true, false]),
  //         manageUsers: faker.helpers.arrayElement([true, false]),
  //         setupInterviews: faker.helpers.arrayElement([true, false]),
  //         makeDecisions: faker.helpers.arrayElement([true, false]),
  //         viewSafeguardingInformation: faker.helpers.arrayElement([true, false]),
  //         viewDiversityInformation: faker.helpers.arrayElement([true, false])
  //       }
  //     })
  //   }
  // })

  return users
}

const generateUsersFile = (filePath) => {
  const users = generateFakeUsers()
  const filedata = JSON.stringify(users, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`User data generated: ${filePath}`)
    }
  )
}

generateUsersFile(path.join(__dirname, '../app/data/users.json'))
