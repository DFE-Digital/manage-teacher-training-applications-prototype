const { fake } = require('faker');
const { DateTime } = require('luxon')

module.exports = (faker, params) => {
  const interviews = { items: [] }
  const now = DateTime.fromISO('2019-08-15')
  const randomNumber = faker.random.number({ 'min': 1, 'max': 20 });
  const past = now.minus({ days: randomNumber }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  });
  const future = now.plus({ days: randomNumber }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  });;

  var interview = {};
  interview.id = faker.random.uuid()
  interview.details = "Some details of the interview go here"

  if (params.status === 'Awaiting decision') {
    interview.date = faker.helpers.randomize([past, future])
    if(faker.helpers.randomize(["has interviews", ""]) == "has interviews") {
      interviews.items.push(interview)
    }
  } else {
    interview.date = past
    interviews.items.push(interview)
  }

  return interviews
}
