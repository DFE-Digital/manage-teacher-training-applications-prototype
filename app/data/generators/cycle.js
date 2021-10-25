const faker = require('faker')
faker.locale = 'en_GB'

const CycleHelper = require('../helpers/cycles')

module.exports = (params = {}) => {
  let cycle = faker.helpers.randomize([
    CycleHelper.PREVIOUS_CYCLE.code,
    CycleHelper.CURRENT_CYCLE.code
  ])

  if (params.status === 'Received' || params.status === 'Interviewing') {
    cycle = CycleHelper.CURRENT_CYCLE.code
  }

  return cycle
}
