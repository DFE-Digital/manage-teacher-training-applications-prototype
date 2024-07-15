const faker = require('@faker-js/faker').faker
faker.locale = 'en_GB'

const CycleHelper = require('../helpers/cycles')

module.exports = (params = {}) => {
  let cycleCode = faker.helpers.randomize([
    CycleHelper.PREVIOUS_CYCLE.code,
    CycleHelper.CURRENT_CYCLE.code
  ])

  if (params.status === 'Received' || params.status === 'Interviewing') {
    cycleCode = CycleHelper.CURRENT_CYCLE.code
  }

  return cycleCode
}
