const Utils = require('../data/helpers/utils')

const locations = require('../data/locations')

const getLocationItems = (selectedItem) => {
  const items = []

  locations.forEach((location, i) => {
    const item = {}

    let address = Object.values(location.address)
    // hack to remove empty items from address
    address = address.filter(item => item !== '')

    item.text = location.name
    item.value = location.id
    item.id = location.id
    item.checked = (selectedItem && selectedItem.includes(location.id)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = Utils.arrayToList(array = address, join = ', ', final = ', ')

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
    res.redirect(`/applications/${req.params.applicationId}/course/edit/study-mode`)
  })

  router.get('/applications/:applicationId/course/edit/study-mode', (req, res) => {

    res.render('applications/course/study-mode', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/location`)
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
    res.redirect(`/applications/${req.params.applicationId}/course/edit/funding-type`)
  })

  router.get('/applications/:applicationId/course/edit/funding-type', (req, res) => {
    res.render('applications/course/funding-type', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/funding-type', (req, res) => {
    res.redirect(`/applications/${req.params.applicationId}/course/edit/save`)
  })

  router.get('/applications/:applicationId/course/edit/save', (req, res) => {
    console.log(req.session.data['edit-course'])
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

    delete req.session.data['edit-course']

    res.redirect(`/applications/${req.params.applicationId}`)
  })

}
