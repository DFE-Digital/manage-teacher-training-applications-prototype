const SystemHelper = require('../helpers/system');
const faker = require('faker')
faker.locale = 'en_GB'

module.exports = (params) => {
  let submittedDate

  if(params.status == "Offered") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 10, 'max': 60 })
    })
  } else {
    submittedDate = SystemHelper.now().minus({ days: 20 }).toISO()
  }

  return submittedDate
}
