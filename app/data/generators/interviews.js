const { fake } = require('faker');
const { DateTime } = require('luxon')

module.exports = (faker, params) => {
  const interviews = { items: [] }
  const now = DateTime.fromISO('2019-08-15')
  const randomNumber = faker.random.number({ 'min': 1, 'max': 20 });
  const past = now.minus({ days: randomNumber });
  const future = now.plus({ days: randomNumber });

  var interview = {};
  interview.id = faker.random.uuid()
  interview.time = faker.helpers.randomize(['9am', '9:15am', '9:30am', '9:45am', '10am'])
  interview.details = "Some details of the interview go here"

  if (params.status === 'Awaiting decision') {
    interview.date = faker.helpers.randomize([past, future])
  } else {
    interview.date = past
  }

  interviews.items.push(interview)

  return interviews
}
