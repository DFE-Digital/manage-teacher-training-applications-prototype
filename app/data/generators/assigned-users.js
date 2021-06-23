const faker = require('faker')
faker.locale = 'en_GB'

const _ = require('lodash')

let users = require('../users.json')

module.exports = (organisation, status) => {
  const assignedUsers = []

  if (status.toLowerCase() !== 'received') {
    users = users.filter(user => {
      return user.organisation.id == organisation.id
    })

    let user = faker.helpers.randomize(users)

    // clone the users so we can clean the data and only use what we need
    user = _.cloneDeep(user)

    // remove unnecessary data
    // delete user.organisation
    delete user.organisations
    delete user.permissions

    assignedUsers.push(user)
  }

  return assignedUsers
}
