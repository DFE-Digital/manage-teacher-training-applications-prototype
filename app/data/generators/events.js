module.exports = (faker, params) => {
  const events = { items: [] }

  const date = faker.helpers.randomize([
    '2019-08-12',
    '2019-08-11',
    faker.date.past(),
    faker.date.past(),
    faker.date.past(),
    faker.date.past(),
    faker.date.past()
  ])

  events.items.push({
    title: 'Application submitted',
    user: 'Candidate',
    date: date
  })

  events.items.push({
    title: 'Note added',
    user: faker.name.findName(),
    date: date,
    meta: {
      noteIndex: 0
    }
  })

  if (params.status === 'Rejected') {
    events.items.push({
      title: 'Application rejected',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Application withdrawn') {
    events.items.push({
      title: 'Application withdrawn',
      user: 'Candidate',
      date: date
    })
  }

  if (params.offer) {
    events.items.push({
      title: 'Offer made',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Offer withdrawn') {
    events.items.push({
      title: 'Offer withdrawn',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Accepted') {
    events.items.push({
      title: 'Offer accepted',
      user: 'Candidate',
      date: date
    })
  } else if (params.status === 'Declined') {
    events.items.push({
      title: 'Offer declined',
      user: 'Candidate',
      date: date
    })
  }

  if (params.status === 'Conditions met') {
    events.items.push({
      title: 'Conditions met',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Conditions not met') {
    events.items.push({
      title: 'Conditions not met',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Deferred') {
    events.items.push({
      title: 'Offer deferred',
      user: faker.name.findName(),
      date: date
    })
  }

  return events
}
