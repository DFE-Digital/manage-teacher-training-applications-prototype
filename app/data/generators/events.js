const DateHelper = require('../helpers/dates');
const ApplicationHelper = require('../helpers/application');
const SystemHelper = require('../helpers/system');
const faker = require('faker')
faker.locale = 'en_GB'
const _ = require('lodash')

module.exports = (params) => {
  const events = { items: [] }
  const now = SystemHelper.now().toISO()

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

  date = DateHelper.getFutureDate(date)

  // to align dates
  params.notes.items[0].date = date

  events.items.push({
    title: 'Note added',
    user: params.notes.items[0].sender,
    date: date,
    meta: {
      note: params.notes.items[0]
    }
  })

  if (params.status === 'Rejected') {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Application rejected',
      user: faker.name.findName(),
      date: date
    })
  }

  if (params.status === 'Application withdrawn') {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Application withdrawn',
      user: 'Candidate',
      date: date
    })
  }

  const conditions = ApplicationHelper.getConditions(params.offer)

  if (params.offer) {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer made',
      user: faker.name.findName(),
      date: date,
      meta: {
        offer: {
          provider: params.provider,
          course: params.course,
          location: params.location,
          studyMode: params.studyMode,
          accreditedBody: params.accreditedBody,
          conditions
        }
      }
    })
  }

  if (params.status === 'Offer withdrawn') {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer withdrawn',
      user: faker.name.findName(),
      date: date,
      meta: {
        offer: {
          provider: params.provider,
          course: params.course,
          location: params.location,
          studyMode: params.studyMode,
          accreditedBody: params.accreditedBody,
          conditions
        }
      }
    })
  }

  if (params.status === 'Awaiting conditions') {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer accepted',
      user: 'Candidate',
      date: date,
      meta: {
        offer: {
          provider: params.provider,
          course: params.course,
          location: params.location,
          studyMode: params.studyMode,
          accreditedBody: params.accreditedBody,
          conditions
        }
      }
    })
  } else if (params.status === 'Declined') {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer declined',
      user: 'Candidate',
      date: date,
      meta: {
        offer: {
          provider: params.provider,
          course: params.course,
          location: params.location,
          studyMode: params.studyMode,
          accreditedBody: params.accreditedBody,
          conditions
        }
      }
    })
  }

  if (params.status === 'Ready to enroll') {
    if(conditions.length) {
      date = DateHelper.getFutureDate(date)
      events.items.push({
        title: 'Offer accepted',
        user: faker.name.findName(),
        date: date,
        meta: {
          offer: {
            provider: params.provider,
            course: params.course,
            location: params.location,
            studyMode: params.studyMode,
            accreditedBody: params.accreditedBody,
            conditions
          }
        }
      })
      date = DateHelper.getFutureDate(date)
      events.items.push({
        title: 'Conditions marked as met',
        user: faker.name.findName(),
        date: date,
        meta: {
          offer: {
            provider: params.provider,
            course: params.course,
            location: params.location,
            studyMode: params.studyMode,
            accreditedBody: params.accreditedBody,
            conditions
          }
        }
      })
    } else {
      date = DateHelper.getFutureDate(date)
      events.items.push({
        title: 'Offer accepted',
        user: faker.name.findName(),
        date: date,
        meta: {
          offer: {
            provider: params.provider,
            course: params.course,
            location: params.location,
            studyMode: params.studyMode,
            accreditedBody: params.accreditedBody
          }
        }
      })
    }


  }

  if (params.status === 'Conditions not met' && conditions.length) {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Conditions marked as not met',
      user: faker.name.findName(),
      date: date,
      meta: {
        offer: {
          provider: params.provider,
          course: params.course,
          location: params.location,
          studyMode: params.studyMode,
          accreditedBody: params.accreditedBody,
          conditions
        }
      }
    })
  }

  if (params.status === 'Deferred') {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Offer deferred',
      user: faker.name.findName(),
      date: date,
      meta: {
        offer: {
          provider: params.provider,
          course: params.course,
          location: params.location,
          studyMode: params.studyMode,
          accreditedBody: params.accreditedBody,
          conditions
        }
      }
    })
  }

  return events
}
