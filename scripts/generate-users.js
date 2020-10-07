const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'

const generateUser = require('../app/data/generators/user')

const generateFakeUser = (params = {}) => {
  return generateUser(faker, params)
}

const generateFakeUsers = (count) => {
  const organisations = require('../app/data/organisations.json')
  const users = []

  let user1 = generateFakeUser({
    firstName: 'Claudine',
    lastName: 'Adams',
    emailAddress: 'claudine.adams@newzoescitt.co.uk',
    organisations: [{
      org: organisations[2],
      permissions: {
        manageOrganisation: true,
        manageUsers: true,
        makeDecisions: true,
        viewSafeguardingInformation: true,
        viewDiversityInformation: true
      }
    }, {
      org: organisations[1],
      permissions: {
        manageOrganisation: true,
        manageUsers: true,
        makeDecisions: true,
        viewSafeguardingInformation: true,
        viewDiversityInformation: true
      }
    }]
  })

  users.push(user1)

  let user2 = generateFakeUser({
    firstName: 'Duncan',
    lastName: 'Patricks',
    emailAddress: 'duncan.patricks@newzoescitt.co.uk',
    organisations: [{
      org: organisations[2],
      permissions: {
        manageOrganisation: true,
        manageUsers: true,
        makeDecisions: true,
        viewSafeguardingInformation: true,
        viewDiversityInformation: true
      }
    }]
  })

  users.push(user2)

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
