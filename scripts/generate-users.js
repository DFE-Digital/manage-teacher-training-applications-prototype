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
  const mainOrg = organisations.find(org => org.name == "University of Bedfordshire")

  users.push({
    id: faker.random.uuid(),
    firstName: "Rachel",
    lastName: "Reeds",
    emailAddress: "rachel.reeds@beds.ac.uk",
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

  // users.push({
  //   id: faker.random.uuid(),
  //   firstName: "Rachel",
  //   lastName: "Reeds",
  //   emailAddress: "rachel.reeds@beds.ac.uk",
  //   organisation: organisations.find(org => org.name == "ATT Partnership"),
  //   permissions: {
  //     manageOrganisation: true,
  //     manageUsers: true,
  //     setupInterviews: true,
  //     makeDecisions: true,
  //     viewSafeguardingInformation: true,
  //     viewDiversityInformation: true
  //   }
  // })

  // users.push({
  //   id: faker.random.uuid(),
  //   firstName: "Rachel",
  //   lastName: "Reeds",
  //   emailAddress: "rachel.reeds@beds.ac.uk",
  //   organisation: organisations.find(org => org.name == "Castle Newnham Partnership"),
  //   permissions: {
  //     manageOrganisation: true,
  //     manageUsers: true,
  //     setupInterviews: true,
  //     makeDecisions: true,
  //     viewSafeguardingInformation: true,
  //     viewDiversityInformation: true
  //   }
  // })

  // users.push({
  //   id: faker.random.uuid(),
  //   firstName: "Rachel",
  //   lastName: "Reeds",
  //   emailAddress: "rachel.reeds@beds.ac.uk",
  //   organisation: organisations.find(org => org.name == "Fenland Teaching School Alliance"),
  //   permissions: {
  //     manageOrganisation: true,
  //     manageUsers: true,
  //     setupInterviews: true,
  //     makeDecisions: true,
  //     viewSafeguardingInformation: true,
  //     viewDiversityInformation: true
  //   }
  // })

  // users.push({
  //   id: faker.random.uuid(),
  //   firstName: "Rachel",
  //   lastName: "Reeds",
  //   emailAddress: "rachel.reeds@beds.ac.uk",
  //   organisation: organisations.find(org => org.name == "Goldington Academy"),
  //   permissions: {
  //     manageOrganisation: true,
  //     manageUsers: true,
  //     setupInterviews: true,
  //     makeDecisions: true,
  //     viewSafeguardingInformation: true,
  //     viewDiversityInformation: true
  //   }
  // })

  // users.push({
  //   id: faker.random.uuid(),
  //   firstName: "Rachel",
  //   lastName: "Reeds",
  //   emailAddress: "rachel.reeds@beds.ac.uk",
  //   organisation: organisations.find(org => org.name == "Middlefield Primary Academy"),
  //   permissions: {
  //     manageOrganisation: true,
  //     manageUsers: true,
  //     setupInterviews: true,
  //     makeDecisions: true,
  //     viewSafeguardingInformation: true,
  //     viewDiversityInformation: true
  //   }
  // })

  // users.push({
  //   id: faker.random.uuid(),
  //   firstName: "Rachel",
  //   lastName: "Reeds",
  //   emailAddress: "rachel.reeds@beds.ac.uk",
  //   organisation: organisations.find(org => org.name == "Redborne Upper School And Community College"),
  //   permissions: {
  //     manageOrganisation: true,
  //     manageUsers: true,
  //     setupInterviews: true,
  //     makeDecisions: true,
  //     viewSafeguardingInformation: true,
  //     viewDiversityInformation: true
  //   }
  // })

  // users.push({
  //   id: faker.random.uuid(),
  //   firstName: "Rachel",
  //   lastName: "Reeds",
  //   emailAddress: "rachel.reeds@beds.ac.uk",
  //   organisation: organisations.find(org => org.name == "Thorndown Primary School"),
  //   permissions: {
  //     manageOrganisation: true,
  //     manageUsers: true,
  //     setupInterviews: true,
  //     makeDecisions: true,
  //     viewSafeguardingInformation: true,
  //     viewDiversityInformation: true
  //   }
  // })

  for(var i = 0; i < 20; i++) {
    let firstName = generatorHelpers.firstName(faker.helpers.randomize([0,1]))
    let lastName = generatorHelpers.lastName()
    let organisation = faker.helpers.randomize([mainOrg], faker.helpers.randomize(organisations))
    users.push({
      id: faker.random.uuid(),
      firstName,
      lastName,
      emailAddress: `${firstName.replace(/\s/g, '').toLowerCase()}.${lastName.toLowerCase()}@${organisation.domain}`,
      organisation,
      permissions: {
        manageOrganisation: faker.helpers.randomize([true, false]),
        manageUsers: faker.helpers.randomize([true, false]),
        setupInterviews: faker.helpers.randomize([true, false]),
        makeDecisions: faker.helpers.randomize([true, false]),
        viewSafeguardingInformation: faker.helpers.randomize([true, false]),
        viewDiversityInformation: faker.helpers.randomize([true, false])
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
