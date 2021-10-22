const faker = require('faker')
faker.locale = 'en_GB'

const CyclesHelper = require('../helpers/cycles')

module.exports = (params = {}) => {
  let cycle = faker.helpers.randomize([
    CyclesHelper.PREVIOUS_CYCLE.code,
    CyclesHelper.CURRENT_CYCLE.code
  ])

  if (params.status === 'Received' || params.status === 'Interviewing') {
    cycle = CyclesHelper.CURRENT_CYCLE.code
  }

  return cycle
}
