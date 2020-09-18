module.exports = (faker, params) => {
  const interviews = { items: [] }

  if (params.status !== 'Submitted') {
    interviews.items.push({
      id: faker.random.uuid(),
      date: faker.date.past(),
      time: faker.helpers.randomize(['9am', '9:15am', '9:30am', '9:45am', '10am']),
      details: "Some details of the interview go here"
    })
  }

  return interviews
}
