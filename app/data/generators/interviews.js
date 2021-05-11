const faker = require('faker')
faker.locale = 'en_GB'
const { DateTime } = require('luxon')
const SystemHelper = require('../helpers/system')

function getInterview(params) {
  const now = SystemHelper.now()
  const past = now.minus({ days: faker.random.number({ 'min': 1, 'max': 20 }) }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  });
  const future = now.plus({ days: faker.random.number({ 'min': 0, 'max': 10 }) }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  });

  var interview = {};
  interview.id = faker.random.uuid()
  interview.details = faker.helpers.randomize([faker.lorem.sentence(20), ''])

  faker.locale = 'en_GB'

  interview.location = faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.zipCode()

  interview.organisation = faker.helpers.randomize(["The Royal Borough Teaching School Alliance", "Kingston University"])

  if (params.status === 'Interviewing') {
    interview.date = faker.helpers.randomize([past, future, now, now.plus({days: 1})])
    if(faker.helpers.randomize(["has interviews", ""]) == "has interviews") {
      return interview
    }
  } else {
    interview.date = past
    return interview
  }
}


module.exports = (params) => {
  const interviews = { items: [] }

  if(params.status === 'Received') {
    return interviews
  }

  let interview1 = getInterview(params);

  if(interview1) {
    interviews.items.push(interview1)
  }

  let interview2 = getInterview(params);

  if(interview2) {
    interviews.items.push(interview2)
  }

  return interviews
}
