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
  const mainOrg = organisations.find(org => org.name == "University of Leicester")
  // const mainOrg = organisations.find(org => org.name == "Goldsmiths, University of London")
  // const mainOrg = organisations.find(org => org.name == "South West Teacher Training")
  // const mainOrg = organisations.find(org => org.name == "Essex Teacher Training")
  // const mainOrg = organisations.find(org => org.name == "Endeavour TSA")
  // const mainOrg = organisations.find(org => org.name == "Tes Institute")
  // const mainOrg = organisations.find(org => org.name == "Thomas Estley Community College")
  // const mainOrg = organisations.find(org => org.name == "Riverley Primary School")

  // users.push({
  //   id: faker.random.uuid(),
  //   firstName: "Louise",
  //   lastName: "Whaley",
  //   emailAddress: "louise.whaley@le.ac.uk",
  //   organisation: mainOrg,
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
  //   firstName: "Louise",
  //   lastName: "Whaley",
  //   emailAddress: "louise.whaley@le.ac.uk",
  //   organisation: organisations.find(org => org.name == "Ashlawn Teaching School"),
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
  //   firstName: "James",
  //   lastName: "Miller",
  //   emailAddress: "j.miller@gold.ac.uk",
  //   organisation: mainOrg,
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
  //   firstName: "Cassie",
  //   lastName: "Leicester",
  //   emailAddress: "cassie.leicester@westexe.devon.sch.uk",
  //   organisation: mainOrg,
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
  //   firstName: "Alex",
  //   lastName: "Rolle",
  //   emailAddress: "alex.rolle@essexteachertraining.co.uk",
  //   organisation: mainOrg,
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
  //   firstName: "Andrea",
  //   lastName: "Wright",
  //   emailAddress: "andrea.wright@tidemillacademy.org",
  //   organisation: mainOrg,
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
  //   firstName: "Jane",
  //   lastName: "Coleman",
  //   emailAddress: "jane.coleman@tes.com",
  //   organisation: mainOrg,
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
  //   firstName: "Jo",
  //   lastName: "Robotham",
  //   emailAddress: "tela@thomasestley.org.uk",
  //   organisation: mainOrg,
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
  //   firstName: "Charlotte",
  //   lastName: "Foulston",
  //   emailAddress: "charlotte.foulston@griffinschoolstrust.org",
  //   organisation: mainOrg,
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
