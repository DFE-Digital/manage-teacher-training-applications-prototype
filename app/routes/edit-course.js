const ApplicationHelper = require('../data/helpers/application')
const Utils = require('../data/helpers/utils')

const locations = require('../data/locations')
const courses = require('../data/courses')

const getCourses = (selectedItem) => {
  const items = []

  courses.forEach((course, i) => {
    const item = {}

    item.text = course.name
    item.text += ' (' + course.code + ')'
    item.value = course.code
    item.id = course.code
    item.checked = (selectedItem && selectedItem.includes(course.code)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = Utils.arrayToList(
        array = course.qualifications,
        join = ', ',
        final = ' with '
      )
    item.hint.text += ' - ' + course.accreditedBody.name

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

const getCourse = (courseId) => {
  return courses.find(course => course.code === courseId)
}

const getCourseStudyModes = (courseId, selectedItem) => {
  const items = []
  const course = courses.find(course => course.code === courseId)

  course.studyModes.forEach((studyMode, i) => {
    const item = {}

    item.text = studyMode
    item.value = studyMode
    item.id = studyMode
    item.checked = (selectedItem && selectedItem.includes(studyMode)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

const getCourseLocations = (courseId, selectedItem) => {
  const items = []
  const course = courses.find(course => course.code === courseId)

  course.locations.forEach((location, i) => {
    const item = {}

    item.text = location.name
    item.value = location.id
    item.id = location.id
    item.checked = (selectedItem && selectedItem.includes(location.id)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = Utils.arrayToList(
        array = Object.values(location.address),
        join = ', ',
        final = ', '
      )

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

const getCourseLocation = (locationId) => {
  return locations.find(location => location.id === locationId)
}

module.exports = router => {
  router.get('/applications/:applicationId/course/edit/course', (req, res) => {
    let course
    if (req.session.data['edit-course'] && req.session.data['edit-course'].course) {
      course = req.session.data['edit-course'].course
    }

    res.render('applications/course/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      courses: getCourses(course)
    })
  })

  router.post('/applications/:applicationId/course/edit/course', (req, res) => {
    req.session.data.course = getCourse(req.session.data['edit-course'].course)
    if (req.session.data.course.studyModes.length > 1) {
      res.redirect(`/applications/${req.params.applicationId}/course/edit/study-mode?referrer=course`)
    } else {
      req.session.data['edit-course'].studyMode = req.session.data.course.studyModes[0]
      res.redirect(`/applications/${req.params.applicationId}/course/edit/location?referrer=course`)
    }
  })

  router.get('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const course = req.session.data.course

    let studyMode
    if (req.session.data['edit-course'] && req.session.data['edit-course'].studyMode) {
      studyMode = req.session.data['edit-course'].studyMode
    }

    res.render('applications/course/study-mode', {
      application,
      studyModes: getCourseStudyModes(course.code, studyMode)
    })
  })

  router.post('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/location?referrer=study-mode`)
  })

  router.get('/applications/:applicationId/course/edit/location', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)
    const course = req.session.data.course

    if (course.locations.length <= 1) {

      req.session.data['edit-course'].location = req.session.data.course.locations[0].id
      res.redirect(`/applications/${req.params.applicationId}/course/edit/check`)

    } else {
      const courseCode = req.session.data.course.code

      let location
      if (req.session.data['edit-course'] && req.session.data['edit-course'].location) {
        location = req.session.data['edit-course'].location
      }

      res.render('applications/course/location', {
        application: req.session.data.applications.find(app => app.id === req.params.applicationId),
        locations: getCourseLocations(course.code, location)
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
      course = getCourse(req.session.data['edit-course'].course)
    } else {
      course = application.course
    }

    let studyMode
    if (req.session.data['edit-course'] && req.session.data['edit-course'].studyMode) {
      studyMode = req.session.data['edit-course'].studyMode
    } else {
      studyMode = application.studyMode
    }

    let location
    if (req.session.data['edit-course'] && req.session.data['edit-course'].location) {
      location = getCourseLocation(req.session.data['edit-course'].location)
    } else {
      location = application.location
    }

    res.render('applications/course/check', {
      application,
      course,
      studyMode,
      location
    })
  })

  router.post('/applications/:applicationId/course/edit/check', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/save`)
  })

  router.get('/applications/:applicationId/course/edit/save', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    if (req.session.data['edit-course'].course) {
      const course = getCourse(req.session.data['edit-course'].course)
      application.course = course.name + ' (' + course.code + ')'

      application.accreditedBody = course.accreditedBody.name
      application.fundingType = course.fundingType
    }

    if (req.session.data['edit-course'].studyMode) {
      application.studyMode = req.session.data['edit-course'].studyMode
    }

    if (req.session.data['edit-course'].location) {
      application.location = getCourseLocation(req.session.data['edit-course'].location)
    }

    // log the change of course as an event
    ApplicationHelper.addEvent(application, {
      title: "Course changed",
      user: req.session.data.user.firstName + ' ' + req.session.data.user.lastName,
      date: new Date().toISOString(),
      meta: {
        course: {
          provider: application.provider,
          course: application.course,
          studyMode: application.studyMode,
          location: application.location,
          accreditedBody: application.accreditedBody,
          fundingType: application.fundingType
        }
      }
    })

    delete req.session.data['edit-course']

    req.flash('success', 'New course details sent')
    res.redirect(`/applications/${req.params.applicationId}`)
  })

  router.get('/applications/:applicationId/course/edit/cancel', (req, res) => {
    delete req.session.data['edit-course']
    res.redirect(`/applications/${req.params.applicationId}`)
  })

}
