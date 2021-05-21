const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'
const generatorHelpers = require('../app/data/helpers/generators')
const generateUser = require('../app/data/generators/user')

const generateFakeUser = (params = {}) => {
  return generateUser(faker, params)
}

const generateFakeUsers = (count) => {
  const organisations = require('../app/data/organisations.json')
  const users = []

  users.push({
    id: faker.random.uuid(),
    firstName: "Emma",
    lastName: "Turner-Lindley",
    emailAddress: "e.turner-lindley@leedstrinity.ac.uk",
    organisation: organisations.find(org => org.name == "Leeds Trinity University"),
    permissions: {
      manageOrganisation: true,
      manageUsers: true,
      setupInterviews: true,
      makeDecisions: true,
      viewSafeguardingInformation: true,
      viewDiversityInformation: true
    }
  })


  for(var i = 0; i < 100; i++) {
    let firstName = generatorHelpers.firstName(faker.helpers.randomize([0,1]))
    let lastName = generatorHelpers.lastName()
    let organisation = faker.helpers.randomize(organisations)
    users.push({
      id: faker.random.uuid(),
      firstName,
      lastName,
      emailAddress: `${firstName.replace(/\s/g, '').toLowerCase()}.${lastName.toLowerCase()}@${organisation.domain}`,
      organisation,
      permissions: {
        manageOrganisation: true,
        manageUsers: true,
        setupInterviews: true,
        makeDecisions: true,
        viewSafeguardingInformation: true,
        viewDiversityInformation: true
      }
    })
  }

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
