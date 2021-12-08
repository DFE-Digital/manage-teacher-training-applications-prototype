const { v4: uuidv4 } = require('uuid')
const ApplicationHelper = require('../data/helpers/application')
const CourseHelper = require('../data/helpers/courses')

module.exports = router => {

  // ---------------------------------------------------------------------------
  // Change course flow
  // ---------------------------------------------------------------------------

  router.get('/applications/:applicationId/offer/edit/provider', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    res.render('applications/offer/edit/provider', {
      application,
      actions: {
        back: `/applications/${req.params.applicationId}/offer`,
        cancel: `/applications/${req.params.applicationId}/offer/edit/course/cancel`,
        save: `/applications/${req.params.applicationId}/offer/edit/provider`
      }
    })
  })

  router.post('/applications/:applicationId/offer/edit/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/course?referrer=provider`)
  })

  router.get('/applications/:applicationId/offer/edit/course', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let selectedCourse
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].course) {
      selectedCourse = req.session.data['edit-offer'].course
    }

    let back = `/applications/${req.params.applicationId}/offer`
    if (req.query.referrer === 'check') {
      back += '/edit/check'
    }

    res.render('applications/offer/edit/course', {
      application,
      courses: CourseHelper.getCourses(selectedCourse),
      actions: {
        back: back,
        cancel: `/applications/${req.params.applicationId}/offer/edit/course/cancel`,
        save: `/applications/${req.params.applicationId}/offer/edit/course`
      }
    })
  })

  router.post('/applications/:applicationId/offer/edit/course', (req, res) => {
    req.session.data.course = CourseHelper.getCourse(req.session.data['edit-offer'].course)
    if (req.session.data.course.studyModes.length > 1) {
      res.redirect(`/applications/${req.params.applicationId}/offer/edit/study-mode?referrer=course`)
    } else {
      req.session.data['edit-offer'].studyMode = req.session.data.course.studyModes[0]
      res.redirect(`/applications/${req.params.applicationId}/offer/edit/location?referrer=course`)
    }
  })

  router.get('/applications/:applicationId/offer/edit/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['edit-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.offer.courseCode)
    }

    let selectedStudyMode
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].studyMode) {
      selectedStudyMode = req.session.data['edit-offer'].studyMode
    }

    let back = `/applications/${req.params.applicationId}/offer`
    let save = `/applications/${req.params.applicationId}/offer/edit/study-mode`

    if (req.query.referrer === 'check') {
      back += '/edit/check'
      save += `?referrer=${req.query.referrer}`
    } else if (req.query.referrer === 'course') {
      back += '/edit/course'
    }

    res.render('applications/offer/edit/study-mode', {
      application,
      studyModes: CourseHelper.getCourseStudyModes(course.code, selectedStudyMode),
      actions: {
        back: back,
        cancel: `/applications/${req.params.applicationId}/offer/edit/course/cancel`,
        save: save
      }
    })
  })

  router.post('/applications/:applicationId/offer/edit/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    if (req.session.data['edit-offer'].course) {
      req.session.data.course = CourseHelper.getCourse(req.session.data['edit-offer'].course)
    } else {
      req.session.data.course = CourseHelper.getCourse(application.offer.courseCode)
    }

    if (req.query.referrer === 'check') {
      res.redirect(`/applications/${req.params.applicationId}/offer/edit/check?referrer=study-mode`)
    } else if (req.session.data.course.locations.length > 1) {
      res.redirect(`/applications/${req.params.applicationId}/offer/edit/location?referrer=study-mode`)
    } else {
      req.session.data['edit-offer'].location = req.session.data.course.locations[0]
      res.redirect(`/applications/${req.params.applicationId}/offer/edit/check?referrer=study-mode`)
    }
  })

  router.get('/applications/:applicationId/offer/edit/location', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['edit-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.offer.courseCode)
    }

    if (course.locations.length <= 1) {

      req.session.data['edit-offer'].location = req.session.data.course.locations[0].id
      res.redirect(`/applications/${req.params.applicationId}/offer/edit/check?referrer=${req.query.referrer}`)

    } else {

      let selectedLocation
      if (req.session.data['edit-offer'] && req.session.data['edit-offer'].location) {
        selectedLocation = req.session.data['edit-offer'].location
      }

      let back = `/applications/${req.params.applicationId}/offer`
      let save = `/applications/${req.params.applicationId}/offer/edit/location`

      if (req.query.referrer === 'check') {
        back += '/edit/check'
        save += `?referrer=${req.query.referrer}`
      } else if (req.query.referrer === 'course') {
        back += '/edit/course'
      } else if (req.query.referrer === 'study-mode') {
        back += '/edit/study-mode'
      }

      res.render('applications/offer/edit/location', {
        application,
        locations: CourseHelper.getCourseLocations(course.code, selectedLocation),
        actions: {
          back: back,
          cancel: `/applications/${req.params.applicationId}/offer/edit/course/cancel`,
          save: save
        }
      })
    }
  })

  router.post('/applications/:applicationId/offer/edit/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/check?referrer=location`)
  })

  // ---------------------------------------------------------------------------
  // Change conditions flow
  // ---------------------------------------------------------------------------

  router.get('/applications/:applicationId/offer/edit/conditions', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    let standardConditions
    let conditions

    if (!(req.session.data['edit-offer']
      && req.session.data['edit-offer']['standard-conditions'])) {

      if (application.offer.standardConditions) {
        standardConditions = application.offer.standardConditions.map(condition => {
          return condition.description
        })
      }
    }

    // cleanse data gah
    if (req.session.data['edit-offer']
      && req.session.data['edit-offer']['conditions']) {
      req.session.data['edit-offer']['conditions'] = req.session.data['edit-offer']['conditions'].filter(condition => condition !== '')
    }

    // if the form has been used in some way
    if (req.session.data['edit-offer']
      && req.session.data['edit-offer']['submitted-conditions-page'] === 'true') {
      conditions = req.session.data['edit-offer']['conditions']
    } else {
      if (application.offer.conditions) {
        conditions = application.offer.conditions.map(condition => {
          return condition.description
        })
      }
    }

    res.render('applications/offer/edit/conditions', {
      application,
      standardConditions,
      conditions,
      actions: {
        back: `/applications/${req.params.applicationId}/offer`,
        cancel: `/applications/${req.params.applicationId}/offer/edit/course/cancel`,
        save: `/applications/${req.params.applicationId}/offer/edit/conditions`
      }
    })
  })

  router.post('/applications/:applicationId/offer/edit/conditions', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/check`)
  })

  // ---------------------------------------------------------------------------
  // Check answers
  // ---------------------------------------------------------------------------

  router.get('/applications/:applicationId/offer/edit/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let conditions = []

    // if it's been submitted then build conditions from data
    if (req.session.data['edit-offer']
      && req.session.data['edit-offer']['submitted-conditions-page'] == 'true') {

      // standard conditions
      if (req.session.data['edit-offer']['standard-conditions']
        && req.session.data['edit-offer']['standard-conditions'].length) {
        conditions = conditions.concat(req.session.data['edit-offer']['standard-conditions'])
      }

      if (req.session.data['edit-offer']['conditions']
        && req.session.data['edit-offer']['conditions'].length) {
        req.session.data['edit-offer']['conditions']
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

    // not submitted, build from application.offer object
    } else {
      conditions = ApplicationHelper.getConditions(application.offer)
    }

    let course
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['edit-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.offer.courseCode)
    }

    let studyMode
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].studyMode) {
      studyMode = req.session.data['edit-offer'].studyMode
    } else {
      studyMode = application.offer.studyMode
    }

    let location
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].location) {
      location = CourseHelper.getCourseLocation(req.session.data['edit-offer'].location)
    } else {
      location = application.offer.location
    }

    res.render('applications/offer/edit/check', {
      application,
      course,
      studyMode,
      location,
      conditions,
      actions: {
        back: `/applications/${req.params.applicationId}/offer/edit/conditions`,
        cancel: `/applications/${req.params.applicationId}/offer/edit/cancel`,
        save: `/applications/${req.params.applicationId}/offer/edit/check`
      }
    })
  })

  router.post('/applications/:applicationId/offer/edit/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    application.offer.madeDate = new Date().toISOString()

    if (req.session.data['edit-offer'].course) {
      const course = CourseHelper.getCourse(req.session.data['edit-offer'].course)
      application.offer.course = course.name + ' (' + course.code + ')'
      application.offer.courseCode = course.code
      application.offer.provider = course.trainingProvider.name
      application.offer.accreditedBody = course.accreditedBody.name
      application.offer.fundingType = course.fundingType
    }

    application.offer.studyMode = req.session.data['edit-offer'].studyMode || application.offer.studyMode
    application.offer.location = CourseHelper.getCourseLocation(req.session.data['edit-offer'].location) || application.offer.location

    // if it's been submitted then save conditions from data
    if (req.session.data['edit-offer'] && req.session.data['edit-offer']['submitted-conditions-page'] === 'true') {
      // save standard conditions
      application.offer.standardConditions = []

      if (req.session.data['edit-offer']['standard-conditions']
        && req.session.data['edit-offer']['standard-conditions'].length) {
        req.session.data['edit-offer']['standard-conditions']
          .forEach(condition => {
            application.offer.standardConditions.push({
              id: uuidv4(),
              description: condition,
              status: "Pending"
            })
          })
      }

      // save further conditions
      application.offer.conditions = []

      req.session.data['edit-offer']['conditions']
        .filter(condition => condition != '')
        .forEach(condition => {
          application.offer.conditions.push({
            id: uuidv4(),
            description: condition,
            status: "Pending"
          })
        })
    }

    ApplicationHelper.addEvent(application, {
      title: 'Offer changed',
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

    delete req.session.data['edit-offer']

    req.flash('success', 'New offer sent')
    res.redirect(`/applications/${req.params.applicationId}/offer`)
  })

  // ---------------------------------------------------------------------------
  // Cancel changes
  // ---------------------------------------------------------------------------

  router.get('/applications/:applicationId/offer/edit/course/cancel', (req, res) => {
    // delete data we don't need
    if (req.session.data['edit-offer']) {
      delete req.session.data['edit-offer']
    }

    if (req.session.data.referrer === 'offer') {
      res.redirect(`/applications/${req.params.applicationId}/offer`)
    } else {
      res.redirect(`/applications/${req.params.applicationId}/offer/edit/check`)
    }
  })

  router.get('/applications/:applicationId/offer/edit/cancel', (req, res) => {
    delete req.session.data['edit-offer']
    res.redirect(`/applications/${req.params.applicationId}/offer`)
  })

}
