const { DateTime } = require('luxon')

module.exports = (faker, params) => {
  const interviews = { items: [] }

  if (params.status === 'Awaiting decision' && faker.helpers.randomize([0,1]) === 1 || params.status !== 'Awaiting decision') {

    const randomNumber = faker.random.number({
      'min': 1,
      'max': 20
    });

    const now = DateTime.fromISO('2019-08-15')
    const past = now.minus({ days: randomNumber });
    const future = now.plus({ days: randomNumber });

    interviews.items.push({
      id: faker.random.uuid(),
      date: faker.helpers.randomize([past, future]),
      time: faker.helpers.randomize(['9am', '9:15am', '9:30am', '9:45am', '10am']),
      details: "Some details of the interview go here"
    })
  }

  return interviews
}
