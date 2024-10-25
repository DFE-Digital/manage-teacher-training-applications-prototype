const { fakerEN_GB: faker } = require('@faker-js/faker')


module.exports = () => {

  let withdrawal = {
    date: faker.date.past(),
    feedback: {
      reason: faker.helpers.randomize([
        'Candidate asked to withdraw their application',
        'Candidate did not reply to messages',
        'Other'
      ])
    }
  }

  if(withdrawal.feedback.reason == 'Other') {
    withdrawal.feedback['other-reason-details'] = faker.lorem.paragraph()
  }

  return withdrawal
}
