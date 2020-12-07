const { DateTime } = require('luxon')
const faker = require('faker')
faker.locale = 'en_GB'

function getRandomDate(date, min = 1, max = 20) {
  let dt = DateTime.fromJSDate(date)
  const num = faker.random.number({ 'min': min, 'max': max })
  return dt.plus({ days: num }).toJSDate()
}

module.exports = (params) => {
  const events = { items: [] }
  const now = new Date(2020, 8, 12)

  let date = faker.helpers.randomize([
    '2020-08-12T09:22:13.211Z',
    '2020-08-11T18:49:30.132Z',
    faker.date.past(faker.helpers.randomize([1,2]), now),
    faker.date.past(faker.helpers.randomize([1,2]), now),
    faker.date.past(faker.helpers.randomize([1,2]), now),
    faker.date.past(faker.helpers.randomize([1,2]), now),
    faker.date.past(faker.helpers.randomize([1,2]), now)
  ])

  events.items.push({
    title: 'Application submitted',
    user: 'Candidate',
    date: date
  })

  if (params.interviewId) {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Interview set up',
      user: faker.name.findName(),
      date: date,
      meta: {
        interviewId: params.interviewId
      }
    })
  }

  // generate a new date for the next event in the series
  date = getRandomDate(date)

  events.items.push({
    title: 'Note added',
    user: faker.name.findName(),
    date: date,
    meta: {
      noteIndex: 0
    }
  })

  if (params.status === 'Rejected') {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Application rejected',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Application withdrawn') {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Application withdrawn',
      user: 'Candidate',
      date: date
    })
  }

  if (params.offer) {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Offer made',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Offer withdrawn') {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Offer withdrawn',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Accepted') {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Offer accepted',
      user: 'Candidate',
      date: date
    })
  } else if (params.status === 'Declined') {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Offer declined',
      user: 'Candidate',
      date: date
    })
  }

  if (params.status === 'Conditions met') {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Conditions met',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Conditions not met') {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Conditions not met',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Deferred') {
    // generate a new date for the next event in the series
    date = getRandomDate(date)

    events.items.push({
      title: 'Offer deferred',
      user: faker.name.findName(),
      date: date
    })
  }

  return events
}
