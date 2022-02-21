const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {

  const defaults = {
    reasons: 'No',
    'course-full': 'No',
    why: '',
    'other-feedback': 'No'
  }

  const behaviour = {
    actions: 'Yes',
    'actions-reasons': [
      'Did not reply to messages',
      'Other'
    ],
    'actions-reasons-other': faker.lorem.paragraph(),
    'actions-reasons-other-improve': faker.lorem.paragraph()
  }

  const course = {
    'course-full': 'Yes'
  }

  const why = {
    why: faker.lorem.paragraph(5)
  }

  const additionalFeedback = {
    'other-feedback': 'Yes',
    'other-feedback-details': faker.lorem.paragraph(5)
  }

  // Withdrawal scenarios
  const scenario1 = {...behaviour, ...additionalFeedback}
  const scenario2 = {...course, ...additionalFeedback}
  const scenario3 = {...why, ...additionalFeedback}

  return faker.helpers.randomize([scenario1, scenario2, scenario3])
}
