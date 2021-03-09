const DateHelper = require('../helpers/dates');
const faker = require('faker')
faker.locale = 'en_GB'
const _ = require('lodash')

module.exports = (params) => {
  const events = { items: [] }
  const now = new Date(2020, 8, 12)

  let date = faker.helpers.randomize([
    new Date(2020, 8, 12, 9, 22),
    new Date(2020, 8, 11, 18, 49),
    DateHelper.getPastDate(now),
    DateHelper.getPastDate(now),
    DateHelper.getPastDate(now),
    DateHelper.getPastDate(now),
    DateHelper.getPastDate(now)
  ])

  events.items.push({
    title: 'Application submitted',
    user: 'Candidate',
    date: date
  })

  // we know there are currently 2 interviews set up



  if (params.interviews && params.interviews.items[0]) {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Interview set up',
      user: faker.name.findName(),
      date: date,
      meta: {
        interview: params.interviews.items[0]
      }
    })
  }

  if (params.interviews && params.interviews.items[1]) {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Interview set up',
      user: faker.name.findName(),
      date: date,
      meta: {
        interview: params.interviews.items[1]
      }
    })

    if (faker.helpers.randomize([true])) {
      date = DateHelper.getFutureDate(date)

      var interview = _.clone(params.interviews.items[1])
      interview.location = 'https://zoom.us/boom/town'

      events.items.push({
        title: 'Interview changed',
        user: faker.name.findName(),
        date: date,
        meta: {
          interview: interview
        }
      })

    }

    if (faker.helpers.randomize([true])) {
      date = DateHelper.getFutureDate(date)

      events.items.push({
        title: 'Interview cancelled',
        user: faker.name.findName(),
        date: date,
        meta: {
          interview: interview,
          cancellationReason: "We cannot interview you this week. We’ll call you to reschedule."
        }
      })
    }
  }

  // generate a new date for the next event in the series
  date = DateHelper.getFutureDate(date)

  // to align dates
  params.notes.items[0].date = date

  events.items.push({
    title: 'Note added',
    user: faker.name.findName(),
    date: date,
    meta: {
      note: params.notes.items[0]
    }
  })

  if (params.status === 'Rejected') {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Application rejected',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Application withdrawn') {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Application withdrawn',
      user: 'Candidate',
      date: date
    })
  }

  if (params.offer) {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer made',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Offer withdrawn') {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer withdrawn',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Awaiting conditions') {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer accepted',
      user: 'Candidate',
      date: date
    })
  } else if (params.status === 'Declined') {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer declined',
      user: 'Candidate',
      date: date
    })
  }

  if (params.status === 'Conditions met') {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Conditions met',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Conditions not met') {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Conditions not met',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Deferred') {
    // generate a new date for the next event in the series
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer deferred',
      user: faker.name.findName(),
      date: date
    })
  }

  return events
}
