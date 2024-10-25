const { fakerEN_GB: faker } = require('@faker-js/faker')
const DateHelper = require('../helpers/dates');

module.exports = (submittedDate) => {
  const hasExperience = faker.helpers.arrayElement([true, false])
  if(hasExperience) {
    const count = faker.number.int({ min: 1, max: 4 })
    const items = []

    // get a date previously to the application submitted date
    let endDate = DateHelper.getPastDate(submittedDate, 30, 150)

    for (var i = 0; i < count; i++) {

      // get an end date that is prior to the previous start date item
      endDate = DateHelper.getPastDate(endDate)

      // get a start date that is between 30 and 500 days prior to the end date
      startDate = DateHelper.getPastDate(endDate, 30, 500)

      items.push({
        role: faker.person.jobTitle(),
        org: faker.company.name(),
        workedWithChildren: faker.helpers.arrayElement(['Yes', 'No']),
        startDate: startDate,
        endDate: endDate,
        timeCommitment: faker.lorem.sentences(1)
      })

      // this make sure the next cycle of the loop makes a date prior to the previous event's start date
      endDate = startDate
    }
    return items
  }

}
