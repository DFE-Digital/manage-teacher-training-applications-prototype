const { fakerUK: faker } = require('@faker-js/faker')

const CycleHelper = require('../helpers/cycles')

module.exports = (params = {}) => {
  let cycleCode = faker.helpers.arrayElement([
    CycleHelper.PREVIOUS_CYCLE.code,
    CycleHelper.CURRENT_CYCLE.code
  ])

  if (params.status === 'Received' || params.status === 'Interviewing') {
    cycleCode = CycleHelper.CURRENT_CYCLE.code
  }

  return cycleCode
}
