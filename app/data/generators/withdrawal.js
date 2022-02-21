const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {

  let withdrawal = {
    date: faker.date.past(),
    feedback: {
      reason: faker.helpers.randomize([
        'Did not reply to messages',
        'Candidate asked to withdraw their application',
        'Other'
      ])
    }
  }

  if(withdrawal.feedback.reason == 'Other') {
    withdrawal.feedback['other-reason-details'] = faker.lorem.paragraph()
  }

  return withdrawal
}
