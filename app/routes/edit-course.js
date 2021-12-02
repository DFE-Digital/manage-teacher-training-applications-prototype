const ApplicationHelper = require('../data/helpers/application')
const Utils = require('../data/helpers/utils')

const locations = require('../data/locations')

const getLocationItems = (selectedItem) => {
  const items = []

  locations.forEach((location, i) => {
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

const getLocation = (locationId) => {
  return locations.find(location => location.id === locationId)
}

module.exports = router => {
  router.get('/applications/:applicationId/course/edit/course', (req, res) => {
    res.render('applications/course/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/course', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/study-mode?referrer=course`)
  })

  router.get('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    res.render('applications/course/study-mode', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/location?referrer=study-mode`)
  })

  router.get('/applications/:applicationId/course/edit/location', (req, res) => {
    let location
    if (req.session.data['edit-course'] && req.session.data['edit-course'].location) {
      location = req.session.data['edit-course'].location
    }

    res.render('applications/course/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      locations: getLocationItems(location)
    })
  })

  router.post('/applications/:applicationId/course/edit/location', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/funding-type?referrer=location`)
  })

  router.get('/applications/:applicationId/course/edit/funding-type', (req, res) => {
    res.render('applications/course/funding-type', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/funding-type', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/check`)
  })

  router.get('/applications/:applicationId/course/edit/check', (req, res) => {
    const application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    let location
    if (req.session.data['edit-course'] && req.session.data['edit-course'].location) {
      location = getLocation(req.session.data['edit-course'].location)
    } else {
      location = application.location
    }

    res.render('applications/course/check', {
      application,
      location
    })
  })

  router.post('/applications/:applicationId/course/edit/check', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/save`)
  })

  router.get('/applications/:applicationId/course/edit/save', (req, res) => {
    let application = req.session.data.applications.find(app => app.id === req.params.applicationId)

    if (req.session.data['edit-course'].course) {
      application.course = req.session.data['edit-course'].course
    }

    if (req.session.data['edit-course'].studyMode) {
      application.studyMode = req.session.data['edit-course'].studyMode
    }

    if (req.session.data['edit-course'].location) {
      application.location = getLocation(req.session.data['edit-course'].location)
    }

    if (req.session.data['edit-course'].fundingType) {
      application.fundingType = req.session.data['edit-course'].fundingType
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
