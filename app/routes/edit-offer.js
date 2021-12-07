const { v4: uuidv4 } = require('uuid')
const ApplicationHelper = require('../data/helpers/application')
const CourseHelper = require('../data/helpers/courses')

module.exports = router => {
  router.get('/applications/:applicationId/offer/edit/provider', (req, res) => {
    res.render('applications/offer/edit/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/offer/edit/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/course?referrer=provider`)
  })

  router.get('/applications/:applicationId/offer/edit/course', (req, res) => {

    let course
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].course) {
      course = req.session.data['edit-offer'].course
    }

    res.render('applications/offer/edit/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      courses: CourseHelper.getCourses(course)
    })
  })

  router.post('/applications/:applicationId/offer/edit/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/study-mode?referrer=course`)
  })

  router.get('/applications/:applicationId/offer/edit/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['edit-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.offer.courseCode)
    }

    let studyMode
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].studyMode) {
      studyMode = req.session.data['edit-offer'].studyMode
    }

    res.render('applications/offer/edit/study-mode', {
      application,
      studyModes: CourseHelper.getCourseStudyModes(course.code, studyMode)
    })
  })

  router.post('/applications/:applicationId/offer/edit/study-mode', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/location?referrer=study-mode`)
  })

  router.get('/applications/:applicationId/offer/edit/location', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].course) {
      course = CourseHelper.getCourse(req.session.data['edit-offer'].course)
    } else {
      course = CourseHelper.getCourse(application.offer.courseCode)
    }

    let location
    if (req.session.data['edit-offer'] && req.session.data['edit-offer'].location) {
      location = req.session.data['edit-offer'].location
    }

    res.render('applications/offer/edit/location', {
      application,
      locations: CourseHelper.getCourseLocations(course.code, location)
    })
  })

  router.post('/applications/:applicationId/offer/edit/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/conditions?referrer=location`)
  })

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
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit/conditions', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/offer/edit/check`)
  })

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
      conditions
    })
  })

  router.post('/applications/:applicationId/offer/edit/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

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
      title: "Offer changed",
      user: req.session.data.user.firstName + ' ' + req.session.data.user.lastName,
      date: new Date().toISOString(),
      meta: {
        offer: {
          provider: application.offer.provider,
          course: application.offer.course,
          location: application.offer.location,
          accreditedBody: application.offer.accreditedBody,
          studyMode: application.offer.studyMode,
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
  // Cancel links
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
