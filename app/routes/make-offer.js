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

    let back = `/applications/${req.params.applicationId}/decision`
    if (req.query.referrer === 'course') {
      back = `/applications/${req.params.applicationId}/offer/new/course`
    } else if (req.query.referrer === 'study-mode') {
      back = `/applications/${req.params.applicationId}/offer/new/study-mode`
    } else if (req.query.referrer === 'location') {
      back = `/applications/${req.params.applicationId}/offer/new/location`
    }

    res.render('applications/offer/new/index', {
      application,
      conditions,
      actions: {
        back: back,
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
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    res.render('applications/offer/new/provider', {
      application,
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

    let selectedCourse
    if (req.session.data['new-offer'] && req.session.data['new-offer'].course) {
      selectedCourse = req.session.data['new-offer'].course
    }

    if (req.query.referrer === 'decision') {
      req.session.data.flow = 'change-offer'
    }

    let back = `/applications/${req.params.applicationId}/decision`
    if (req.query.referrer === 'check') {
      back = `/applications/${req.params.applicationId}/offer/new/check`
    }

    res.render('applications/offer/new/course', {
      application,
      courses: CourseHelper.getCourses(selectedCourse),
      actions: {
        back: back,
        cancel: `/applications/${req.params.applicationId}/offer/new/course/cancel`,
        save: `/applications/${req.params.applicationId}/offer/new/course`
      }
    })
  })

  router.post('/applications/:applicationId/offer/new/course', (req, res) => {
    req.session.data.course = CourseHelper.getCourse(req.session.data['new-offer'].course)
    if (req.session.data.course.studyModes.length > 1) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/study-mode?referrer=course`)
    } else {
      req.session.data['new-offer'].studyMode = req.session.data.course.studyModes[0]
      res.redirect(`/applications/${req.params.applicationId}/offer/new/location?referrer=course`)
    }
  })

  router.get('/applications/:applicationId/offer/new/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['new-offer'] && req.session.data['new-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['new-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    let selectedStudyMode
    if (req.session.data['new-offer'] && req.session.data['new-offer'].studyMode) {
      selectedStudyMode = req.session.data['new-offer'].studyMode
    }

    let back = `/applications/${req.params.applicationId}/offer/course`
    let save = `/applications/${req.params.applicationId}/offer/new/study-mode`

    if (req.query.referrer === 'check') {
      back = `/applications/${req.params.applicationId}/offer/new/check`
      save += `?referrer=${req.query.referrer}`
    }

    res.render('applications/offer/new/study-mode', {
      application,
      studyModes: CourseHelper.getCourseStudyModes(course.code, selectedStudyMode),
      actions: {
        back: back,
        cancel: `/applications/${req.params.applicationId}/offer/new/course/cancel`,
        save: save
      }
    })
  })

  router.post('/applications/:applicationId/offer/new/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    if (req.session.data['new-offer'].course) {
      req.session.data.course = CourseHelper.getCourse(req.session.data['new-offer'].course)
    } else {
      req.session.data.course = CourseHelper.getCourse(application.courseCode)
    }

    if (req.query.referrer === 'check') {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check?referrer=study-mode`)
    } else if (req.session.data.course.locations.length > 1) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/location?referrer=study-mode`)
    } else {
      req.session.data['new-offer'].location = req.session.data.course.locations[0]
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check?referrer=study-mode`)
    }
  })

  router.get('/applications/:applicationId/offer/new/location', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['new-offer'] && req.session.data['new-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['new-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    if (course.locations.length <= 1) {

      req.session.data['new-offer'].location = req.session.data.course.locations[0].id

      if (req.session.data.flow === 'change-offer') {
        res.redirect(`/applications/${req.params.applicationId}/offer/new?referrer=${req.query.referrer}`)
      } else {
        res.redirect(`/applications/${req.params.applicationId}/offer/new/check?referrer=${req.query.referrer}`)
      }

    } else {

      let selectedLocation
      if (req.session.data['new-offer'] && req.session.data['new-offer'].location) {
        selectedLocation = req.session.data['new-offer'].location
      }

      let back = `/applications/${req.params.applicationId}/offer/new/study-mode`
      let save = `/applications/${req.params.applicationId}/offer/new/location`

      if (req.query.referrer === 'check') {
        back = `/applications/${req.params.applicationId}/offer/new/check`
        save += `?referrer=${req.query.referrer}`
      } else if (req.query.referrer === 'course') {
        back = `/applications/${req.params.applicationId}/offer/new/course`
      }

      if (course.studyModes.length <= 1) {
        back = `/applications/${req.params.applicationId}/offer/new/course`
      }

      res.render('applications/offer/new/location', {
        application: req.session.data.applications.find(app => app.id === req.params.applicationId),
        locations: CourseHelper.getCourseLocations(course.code, selectedLocation),
        actions: {
          back: back,
          cancel: `/applications/${req.params.applicationId}/offer/new/course/cancel`,
          save: save
        }
      })
    }
  })

  router.post('/applications/:applicationId/offer/new/location', (req, res) => {
    if (!(req.session.data['new-offer']['standard-conditions']
      || req.session.data['new-offer'].conditions)
      || req.session.data.flow === 'change-offer') {
      res.redirect(`/applications/${req.params.applicationId}/offer/new?referrer=location`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check?referrer=location`)
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

    delete req.session.data.flow

    if (!(req.session.data['new-offer']['standard-conditions']
      || req.session.data['new-offer'].conditions)) {
      res.redirect(`/applications/${req.params.applicationId}/offer/new`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/new/check`)
    }
  })

  router.get('/applications/:applicationId/offer/new/cancel', (req, res) => {
    delete req.session.data['new-offer']
    delete req.session.data.flow
    res.redirect(`/applications/${req.params.applicationId}`)
  })

}
