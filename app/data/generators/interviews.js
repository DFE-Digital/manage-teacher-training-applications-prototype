const { fake } = require('faker');
const { DateTime } = require('luxon')

function getInterview(faker, params) {
  const now = DateTime.fromISO('2020-08-15')
  const randomNumber = faker.random.number({ 'min': 1, 'max': 20 });
  const past = now.minus({ days: randomNumber }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  });
  const future = now.plus({ days: randomNumber }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  });

  var interview = {};
  interview.id = faker.random.uuid()
  interview.details = faker.helpers.randomize([faker.lorem.sentence(20), ''])

  faker.locale = 'en_GB'

  interview.location = faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.zipCode()

  interview.organisation = faker.helpers.randomize(["The Royal Borough Teaching School Alliance", "Kingston University"])

  if (params.status === 'Awaiting decision') {
    interview.date = faker.helpers.randomize([past, future])
    if(faker.helpers.randomize(["has interviews", ""]) == "has interviews") {
      return interview
    }
  } else {
    interview.date = past
    return interview
  }
}


module.exports = (faker, params) => {
  const interviews = { items: [] }

  let interview1 = getInterview(faker, params);

  if(interview1) {
    interviews.items.push(interview1)
  }

  let interview2 = getInterview(faker, params);

  if(interview2) {
    interviews.items.push(interview2)
  }

  return interviews
}
