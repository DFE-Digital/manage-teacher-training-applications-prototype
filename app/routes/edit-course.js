const ApplicationHelper = require('../data/helpers/application')
const OrgHelper = require('../data/helpers/organisation')
const CourseHelper = require('../data/helpers/courses')
const content = require('../data/content')

module.exports = router => {

  router.get('/applications/:applicationId/course/edit/provider', (req, res) => {
    let selectedProvider
    if (req.session.data['edit-course'] && req.session.data['edit-course'].provider) {
      selectedProvider = req.session.data['edit-course'].provider
    }

    let back = `/applications/${req.params.applicationId}`

    if (req.query.referrer === 'check') {
      back += '/course/edit/check'
    }

    res.render('applications/course/provider', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      providers: CourseHelper.getProviderRadioOptions(selectedProvider),
      actions: {
        back: back,
        cancel: `/applications/${req.params.applicationId}/course/edit/cancel`,
        save: `/applications/${req.params.applicationId}/course/edit/provider`
      }
    })
  })

  router.post('/applications/:applicationId/course/edit/provider', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/course?referrer=provider`)
  })

  router.get('/applications/:applicationId/course/edit/course', (req, res) => {
    let selectedCourse
    if (req.session.data['edit-course'] && req.session.data['edit-course'].course) {
      selectedCourse = req.session.data['edit-course'].course
    }

    let back = `/applications/${req.params.applicationId}`

    if (req.query.referrer === 'check') {
      back += '/course/edit/check'
    } else if(req.query.referrer === 'provider') {
      back += '/course/edit/provider'
    }

    let providerId;
    if(req.session.data['edit-course'] && req.session.data['edit-course'].provider) {
      providerId = req.session.data['edit-course'].provider
    }

    let courses = CourseHelper.getCourseRadioOptions(selectedCourse, providerId)

    res.render('applications/course/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      courses,
      actions: {
        back: back,
        cancel: `/applications/${req.params.applicationId}/course/edit/cancel`,
        save: `/applications/${req.params.applicationId}/course/edit/course`
      }
    })
  })

  router.post('/applications/:applicationId/course/edit/course', (req, res) => {
    req.session.data.course = CourseHelper.getCourse(req.session.data['edit-course'].course)
    if (req.session.data.course.studyModes.length > 1) {
      res.redirect(`/applications/${req.params.applicationId}/course/edit/study-mode?referrer=course`)
    } else {
      req.session.data['edit-course'].studyMode = req.session.data.course.studyModes[0]
      res.redirect(`/applications/${req.params.applicationId}/course/edit/location?referrer=course`)
    }
  })

  router.get('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data.course) {
      course = req.session.data.course
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    let selectedStudyMode
    if (req.session.data['edit-course'] && req.session.data['edit-course'].studyMode) {
      selectedStudyMode = req.session.data['edit-course'].studyMode
    }

    let back = `/applications/${req.params.applicationId}`
    let save = `/applications/${req.params.applicationId}/course/edit/study-mode`

    if (req.query.referrer === 'check' || req.query.referrer === 'details') {
      back += '/course/edit/check'
      save += `?referrer=${req.query.referrer}`
    } else if (req.query.referrer === 'course') {
      back += '/course/edit/course'
    }

    res.render('applications/course/study-mode', {
      application,
      studyModes: CourseHelper.getCourseStudyModeRadioOptions(course.code, selectedStudyMode),
      actions: {
        back: back,
        cancel: `/applications/${req.params.applicationId}/course/edit/cancel`,
        save: save
      }
    })
  })

  router.post('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    if (req.session.data['edit-course'].course) {
      req.session.data.course = CourseHelper.getCourse(req.session.data['edit-course'].course)
    } else {
      req.session.data.course = CourseHelper.getCourse(application.courseCode)
    }

    if (req.query.referrer === 'check' || req.query.referrer === 'details') {
      res.redirect(`/applications/${req.params.applicationId}/course/edit/check?referrer=study-mode`)
    } else if (req.session.data.course.locations.length > 1) {
      res.redirect(`/applications/${req.params.applicationId}/course/edit/location?referrer=study-mode`)
    } else {
      req.session.data['edit-course'].location = req.session.data.course.locations[0].id
      res.redirect(`/applications/${req.params.applicationId}/course/edit/check?referrer=study-mode`)
    }
  })

  router.get('/applications/:applicationId/course/edit/location', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data.course) {
      course = req.session.data.course
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    if (course.locations.length <= 1) {

      req.session.data['edit-course'].location = req.session.data.course.locations[0].id
      res.redirect(`/applications/${req.params.applicationId}/course/edit/check?referrer=${req.query.referrer}`)

    } else {
      let selectedLocation
      if (req.session.data['edit-course'] && req.session.data['edit-course'].location) {
        selectedLocation = req.session.data['edit-course'].location
      }

      let back = `/applications/${req.params.applicationId}`

      if (req.query.referrer === 'check') {
        back += '/course/edit/check'
      } else if (req.query.referrer === 'course') {
        back += '/course/edit/course'
      } else if (req.query.referrer === 'study-mode') {
        back += '/course/edit/study-mode'
      }

      res.render('applications/course/location', {
        application,
        locations: CourseHelper.getCourseLocationRadioOptions(course.code, selectedLocation),
        actions: {
          back: back,
          cancel: `/applications/${req.params.applicationId}/course/edit/cancel`,
          save: `/applications/${req.params.applicationId}/course/edit/location?referrer=${req.query.referrer}`
        }
      })
    }
  })

  router.post('/applications/:applicationId/course/edit/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/check?referrer=location`)
  })

  router.get('/applications/:applicationId/course/edit/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let course
    if (req.session.data['edit-course'] && req.session.data['edit-course'].course) {
      course = CourseHelper.getCourse(req.session.data['edit-course'].course)
    } else {
      course = CourseHelper.getCourse(application.courseCode)
    }

    let studyMode
    if (req.session.data['edit-course'] && req.session.data['edit-course'].studyMode) {
      studyMode = req.session.data['edit-course'].studyMode
    } else {
      studyMode = application.studyMode
    }

    let location
    if (req.session.data['edit-course'] && req.session.data['edit-course'].location) {
      location = CourseHelper.getCourseLocation(req.session.data['edit-course'].location)
    } else {
      location = application.location
    }

    let back = `/applications/${req.params.applicationId}`

    if (req.query.referrer === 'course') {
      back += '/course/edit/course'
    } else if (req.query.referrer === 'study-mode') {
      back += '/course/edit/study-mode'
    } else if (req.query.referrer === 'location') {
      back += '/course/edit/location'
    }

    const upcomingInterviews = ApplicationHelper.getUpcomingInterviews(application)

    let provider = application.provider

    if(req.session.data['edit-course'].provider) {
      provider = OrgHelper.findOrgById(req.session.data['edit-course'].provider).name
    }

    res.render('applications/course/check', {
      application,
      provider,
      course,
      studyMode,
      location,
      upcomingInterviews,
      actions: {
        back: back,
        cancel: `/applications/${req.params.applicationId}/course/edit/cancel`,
        save: `/applications/${req.params.applicationId}/course/edit/check`
      }
    })
  })

  router.post('/applications/:applicationId/course/edit/check', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    if (req.session.data['edit-course'].course) {
      const course = CourseHelper.getCourse(req.session.data['edit-course'].course)
      application.course = course.name + ' (' + course.code + ')'
      application.courseCode = course.code
      application.accreditedBody = course.accreditedBody.name
      application.fundingType = course.fundingType,
      application.qualifications = course.qualifications
    }

    if (req.session.data['edit-course'].studyMode) {
      application.studyMode = req.session.data['edit-course'].studyMode
    }

    if (req.session.data['edit-course'].location) {
      application.location = CourseHelper.getCourseLocation(req.session.data['edit-course'].location)
    }

    // log the change of course as an event
    ApplicationHelper.addEvent(application, {
      title: content.updateCourse.event.title,
      user: req.session.data.user.firstName + ' ' + req.session.data.user.lastName,
      date: new Date().toISOString(),
      meta: {
        course: {
          provider: application.provider,
          course: application.course,
          studyMode: application.studyMode,
          location: application.location,
          accreditedBody: application.accreditedBody,
          fundingType: application.fundingType,
          qualifications: application.qualifications
        }
      }
    })

    delete req.session.data['edit-course']
    delete req.session.data.course
    delete req.session.data.referrer

    req.flash('success', content.updateCourse.successMessage)
    res.redirect(`/applications/${req.params.applicationId}`)
  })

  router.get('/applications/:applicationId/course/edit/cancel', (req, res) => {
    delete req.session.data['edit-course']
    delete req.session.data.course
    delete req.session.data.referrer
    res.redirect(`/applications/${req.params.applicationId}`)
  })

}
