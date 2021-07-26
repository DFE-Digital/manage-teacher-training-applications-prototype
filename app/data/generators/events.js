const DateHelper = require('../helpers/dates');
const ApplicationHelper = require('../helpers/application');
const faker = require('faker')
faker.locale = 'en_GB'
const _ = require('lodash')
const { DateTime } = require('luxon')

module.exports = (params) => {
  const events = { items: [] }

  let date = DateTime.fromISO(params.submittedDate).toJSDate()

  events.items.push({
    title: 'Application submitted',
    user: 'Candidate',
    date: date
  })

  // if the application is not received, assign a user from the
  // accredited body and training provider
  if (params.status.toLowerCase() !== 'received') {
    if (params.assignedUsers.length) {

      date = DateHelper.getFutureDate(date)

      let assignedUsers = params.assignedUsers.filter(user => user.organisation.id === params.organisation.id)

      assignedUsers = assignedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName)
          || a.lastName.localeCompare(b.lastName)
          || a.emailAddress.localeCompare(b.emailAddress))

      const eventTitle = (assignedUsers.length > 1) ? 'Users assigned' : 'User assigned'

      events.items.push({
        title: eventTitle,
        user: faker.name.findName(),
        date: date,
        assignedUsers: assignedUsers
      })
    }
  }

  // we know there are currently 2 interviews set up

  if (params.interviews && params.interviews.items[0]) {
    date = DateHelper.getFutureDate(date)

    events.items.push({
      title: 'Interview set up',
      user: faker.name.findName(),
      date: date,
      meta: {
        interview: params.interviews.items[0],
        interviewId: params.interviews.items[0].id
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
        interview: params.interviews.items[1],
        interviewId: params.interviews.items[0].id
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
          interview: interview,
          interviewId: interview.id
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
          interviewId: interview.id,
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
