module.exports = (faker, cycle) => {
  let events = {
    items: [{
      title: 'Application submitted',
      user: faker.name.findName(),
      date: faker.date.past()
    }, {
      title: 'Note added',
      user: faker.name.findName(),
      date: faker.date.past(),
      meta: {
        noteIndex: 0
      }
    }, {
      title: 'Offer made',
      user: faker.name.findName(),
      date: faker.date.past()
    }, {
      title: 'Offer accepted',
      user: 'Candidate',
      date: faker.date.past()
    }]
  }

  return events;

}
