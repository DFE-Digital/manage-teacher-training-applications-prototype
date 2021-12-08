const { v4: uuidv4 } = require('uuid')
const ApplicationHelper = require('../data/helpers/application')
const CourseHelper = require('../data/helpers/courses')

module.exports = router => {

  router.get('/applications/:applicationId/offer/new', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions

    // cleanse data gah
    if (req.session.data['new-offer']
      && req.session.data['new-offer']['conditions']) {
      req.session.data['new-offer']['conditions'] = req.session.data['new-offer']['conditions'].filter(condition => condition !== '')
    }

    conditions = req.session.data['new-offer']['conditions']

    res.render('applications/offer/new/index', {
      application,
      conditions,
      actions: {
        back: `/applications/${req.params.applicationId}/`,
        cancel: `/applications/${req.params.applicationId}/offer/new/cancel`,
        save: `/applications/${req.params.applicationId}/offer/new`
      }
    })
  })

  router.post('/applications/:applicationId/offer/new', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
  })

  router.get('/applications/:applicationId/offer/new/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let conditions = []

    if (req.session.data['new-offer']
      && req.session.data['new-offer']['standard-conditions']
      && req.session.data['new-offer']['standard-conditions'].length) {
      conditions = conditions.concat(req.session.data['new-offer']['standard-conditions'])
    }

    if (req.session.data['new-offer']['conditions']) {
      req.session.data['new-offer']['conditions']
        .filter(condition => condition !== '')
        .forEach(condition => {
        conditions.push(condition)
      })
    }

    conditions = conditions.map(condition => {
      return {
        description: condition,
        status: "Pending"
      }
    })

    let course
    if (req.session.data['new-offer'] && req.session.data['new-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['new-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    let studyMode
    if (req.session.data['new-offer'] && req.session.data['new-offer'].studyMode) {
      studyMode = req.session.data['new-offer'].studyMode
    } else {
      studyMode = application.studyMode
    }

    let location
    if (req.session.data['new-offer'] && req.session.data['new-offer'].location) {
      location = CourseHelper.getCourseLocation(req.session.data['new-offer'].location)
    } else {
      location = application.location
    }

    res.render('applications/offer/new/check', {
      upcomingInterviews: ApplicationHelper.getUpcomingInterviews(application),
      application,
      course,
      studyMode,
      location,
      conditions,
      actions: {
        back: `/applications/${req.params.applicationId}/offer/new`,
        cancel: `/applications/${req.params.applicationId}/offer/new/cancel`,
        save: `/applications/${req.params.applicationId}/offer/new/check`
      }
    })
  })

  router.post('/applications/:applicationId/offer/new/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    ApplicationHelper.getUpcomingInterviews(application).forEach((interview) => {
      ApplicationHelper.cancelInterview({ application, interview, cancellationReason: "We made you an offer." })
    })

    let course
    if (req.session.data['new-offer'] && req.session.data['new-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['new-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    application.status = 'Offered'

    application.offer = {
      madeDate: new Date().toISOString(),
      provider: req.session.data['new-offer'].provider || course.trainingProvider.name,
      course: course.name + ' (' + course.code + ')',
      courseCode: course.code,
      location: CourseHelper.getCourseLocation(req.session.data['new-offer'].location) || application.location,
      studyMode: req.session.data['new-offer'].studyMode || application.studyMode,
      accreditedBody: course.accreditedBody.name,
      fundingType: course.fundingType
    }

    application.offer.declineByDate = ApplicationHelper.calculateDeclineDate(application)
    application.offer.daysToDecline = ApplicationHelper.calculateDaysToDecline(application)

    // save standard conditions
    if (req.session.data['new-offer']
      && req.session.data['new-offer']['standard-conditions']
      && req.session.data['new-offer']['standard-conditions'].length) {
      application.offer.standardConditions = req.session.data['new-offer']['standard-conditions'].map(condition => {
        return {
          id: uuidv4(),
          description: condition,
          status: "Pending"
        }
      })
    }

    // save further conditions
    if (req.session.data['new-offer']['conditions']) {
      let furtherConditions = req.session.data['new-offer']['conditions']
        .filter(condition => condition != '')
        .map(condition => {
          return {
            id: uuidv4(),
            description: c,
            status: "Pending"
          }
        })

      if (furtherConditions.length) {
        application.offer.conditions = furtherConditions
      }
    }

    ApplicationHelper.addEvent(application, {
      title: 'Offer made',
      user: req.session.data.user.firstName + ' ' + req.session.data.user.lastName,
      date: application.offer.madeDate,
      meta: {
        offer: {
          provider: application.offer.provider,
          course: application.offer.course,
          location: application.offer.location,
          studyMode: application.offer.studyMode,
          accreditedBody: application.offer.accreditedBody,
          fundingType: application.offer.fundingType,
          conditions: ApplicationHelper.getConditions(application.offer)
        }
      }
    })

    delete req.session.data['new-offer']
    delete req.session.data.decision

    req.flash('success', 'Offer sent')
    res.redirect(`/applications/${req.params.applicationId}/offer`)
  })

  // ---------------------------------------------------------------------------
  // Change course flow
  // ---------------------------------------------------------------------------

  router.get('/applications/:applicationId/offer/new/provider', (req, res) => {
    res.render('applications/offer/new/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      actions: {
        back: `/applications/${req.params.applicationId}/offer`,
        cancel: `/applications/${req.params.applicationId}/offer/new/course/cancel`,
        save: `/applications/${req.params.applicationId}/offer/new/provider`
      }
    })
  })

  router.post('/applications/:applicationId/offer/new/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/course?referrer=provider`)
  })

  router.get('/applications/:applicationId/offer/new/course', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['new-offer'] && req.session.data['new-offer'].course) {
      course = req.session.data['new-offer'].course
    }

    res.render('applications/offer/new/course', {
      application,
      courses: CourseHelper.getCourses(course),
      actions: {
        back: `/applications/${req.params.applicationId}/offer`,
        cancel: `/applications/${req.params.applicationId}/offer/new/course/cancel`,
        save: `/applications/${req.params.applicationId}/offer/new/course`
      }
    })
  })

  router.post('/applications/:applicationId/offer/new/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/study-mode?referrer=course`)
  })

  router.get('/applications/:applicationId/offer/new/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['new-offer'] && req.session.data['new-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['new-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    let studyMode
    if (req.session.data['new-offer'] && req.session.data['new-offer'].studyMode) {
      studyMode = req.session.data['new-offer'].studyMode
    }

    res.render('applications/offer/new/study-mode', {
      application,
      studyModes: CourseHelper.getCourseStudyModes(course.code, studyMode),
      actions: {
        back: `/applications/${req.params.applicationId}/offer/course`,
        cancel: `/applications/${req.params.applicationId}/offer/new/course/cancel`,
        save: `/applications/${req.params.applicationId}/offer/new/study-mode`
      }
    })
  })

  router.post('/applications/:applicationId/offer/new/study-mode', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/new/location?referrer=study-mode`)
  })

  router.get('/applications/:applicationId/offer/new/location', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['new-offer'] && req.session.data['new-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['new-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    let location
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].location) {
      location = req.session.data['edit-offer'].location
    }

    res.render('applications/offer/new/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      locations: CourseHelper.getCourseLocations(course.code, location),
      actions: {
        back: `/applications/${req.params.applicationId}/offer/study-mode`,
        cancel: `/applications/${req.params.applicationId}/offer/new/course/cancel`,
        save: `/applications/${req.params.applicationId}/offer/new/location`
      }
    })
  })

  router.post('/applications/:applicationId/offer/new/location', (req, res) => {
    if (!(req.session.data['new-offer']['standard-conditions']
      || req.session.data['new-offer'].conditions)) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
    }
  })

  // ---------------------------------------------------------------------------
  // Cancel links
  // ---------------------------------------------------------------------------

  router.get('/applications/:applicationId/offer/new/course/cancel', (req, res) => {
    // delete data we don't need
    delete req.session.data['new-offer'].provider
    delete req.session.data['new-offer'].course
    delete req.session.data['new-offer'].studyMode
    delete req.session.data['new-offer'].location
    delete req.session.data['new-offer'].accreditedBody
    delete req.session.data['new-offer'].fundingType

    if (!(req.session.data['new-offer']['standard-conditions']
      || req.session.data['new-offer'].conditions)) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
    }
  })

  router.get('/applications/:applicationId/offer/new/cancel', (req, res) => {
    delete req.session.data['new-offer']
    res.redirect(`/applications/${req.params.applicationId}`)
  })

}
