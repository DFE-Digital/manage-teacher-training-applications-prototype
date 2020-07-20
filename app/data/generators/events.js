module.exports = (faker, params) => {

  let events = { items: [] };

  events.items.push({
    title: 'Application submitted',
    user: "Candidate",
    date: faker.date.past()
  })

  events.items.push({
    title: 'Note added',
    user: faker.name.findName(),
    date: faker.date.past(),
    meta: {
      noteIndex: 0
    }
  })

  if(params.status === "Rejected") {
    events.items.push({
      title: 'Application rejected',
      user: faker.name.findName(),
      date: faker.date.past()
    })
  }

  if(params.status === "Application withdrawn") {
    events.items.push({
      title: 'Application withdrawn',
      user: 'Candidate',
      date: faker.date.past()
    })
  }

  if(params.offer) {
    events.items.push({
      title: 'Offer made',
      user: faker.name.findName(),
      date: faker.date.past()
    })
  }

  if(params.status === "Offer withdrawn") {
    events.items.push({
      title: 'Offer withdrawn',
      user: faker.name.findName(),
      date: faker.date.past()
    })
  }

  if(params.status === "Accepted") {
    events.items.push({
      title: 'Offer accepted',
      user: 'Candidate',
      date: faker.date.past()
    })
  } else if(params.status === "Declined") {
    events.items.push({
      title: 'Offer declined',
      user: 'Candidate',
      date: faker.date.past()
    })
  }

  if(params.status === "Conditions met") {
    events.items.push({
      title: 'Conditions met',
      user: faker.name.findName(),
      date: faker.date.past()
    })
  }

  if(params.status === "Conditions not met") {
    events.items.push({
      title: 'Conditions not met',
      user: faker.name.findName(),
      date: faker.date.past()
    })
  }

  return events;
}
