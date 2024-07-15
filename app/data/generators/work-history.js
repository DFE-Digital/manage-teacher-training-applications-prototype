const { fakerUK: faker } = require('@faker-js/faker')
const DateHelper = require('../helpers/dates');

module.exports = (submittedDate) => {
  const answer = faker.helpers.arrayElement(['yes', 'no-work-history', 'no--in-full-time-education'])
  const reason = (answer === 'no-work-history') ? 'I was unemployed': null;
  const items = []
  const count = faker.number.int({ min: 0, max: 8 })

  // get a date previously to the application submitted date
  let endDate = DateHelper.getPastDate(submittedDate, 30, 150)

  if(answer === 'yes' && count > 0) {
    for (var i = 0; i < count; i++) {

      // get an end date that is prior to the previous start date item
      endDate = DateHelper.getPastDate(endDate)

      // get a start date that is between 30 and 500 days prior to the end date
      startDate = DateHelper.getPastDate(endDate, 30, 500)

      const jobType = faker.helpers.arrayElement(['job', 'break'])
      if (jobType === 'job') {

        items.push({
          role: faker.helpers.arrayElement([
            'Analyst',
            'Consultant',
            'Life coach',
            'Sales assistant',
            'Director',
            'Manager',
            'Supervisor',
            'Legal executive',
            'Planner',
          ]),
          org: faker.company.companyName(),
          type: faker.helpers.arrayElement(['Full time', 'Part time']),
          relevantToTeaching: faker.helpers.arrayElement(['Yes', 'No']),
          category: 'job',
          startDate: startDate,
          isStartDateApproximate: faker.helpers.arrayElement([true, false, false, false]),
          endDate: faker.helpers.arrayElement([endDate, false]),
          isEndDateApproximate: false
        })
      } else {

        let description = faker.helpers.arrayElement([
          null,
          'I volunteered with a marine conservation charity in the Seychelles as part of a career break.'
        ])

        items.push({
          description: description,
          category: 'break',
          duration: `${faker.number.int({ min: 1, max: 12 })} months`,
          startDate: startDate,
          endDate: endDate
        })
      }
       // this make sure the next cycle of the loop makes a date prior to the previous event's start date
       endDate = startDate
    }
  }

  return { answer, reason, items }

}
