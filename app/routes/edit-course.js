const Utils = require('../data/helpers/utils')

const locations = require('../data/locations')

const getLocationItems = (selectedItems) => {
  const items = []

  locations.forEach((location, i) => {
    const item = {}

    let address = Object.values(location.address)
    // hack to remove empty items from address
    address = address.filter(item => item !== '')
    address = Utils.arrayToList(array = address, join = ', ', final = ', ')

    const value = location.name + ', ' + address

    item.text = location.name
    item.value = value
    item.id = location.code
    item.checked = (selectedItems && selectedItems.includes(value)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = address

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

module.exports = router => {

  // router.get('/applications/:applicationId/course/edit/provider', (req, res) => {
  //   res.render('applications/course/provider', {
  //     application: req.session.data.applications.find(app => app.id === req.params.applicationId)
  //   })
  // })
  //
  // router.post('/applications/:applicationId/course/edit/provider', (req, res) => {
  //   res.redirect(`/applications/${req.params.applicationId}/course/edit/course`)
  // })

  router.get('/applications/:applicationId/course/edit/course', (req, res) => {
    res.render('applications/course/course', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/course', (req, res) => {
    console.log(req.session.data['edit-course'])
    res.redirect(`/applications/${req.params.applicationId}/course/edit/study-mode`)
  })

  router.get('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    res.render('applications/course/study-mode', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/study-mode', (req, res) => {
    console.log(req.session.data['edit-course'])
    res.redirect(`/applications/${req.params.applicationId}/course/edit/location`)
  })

  router.get('/applications/:applicationId/course/edit/location', (req, res) => {
    let location
    if (req.session.data['edit-course'].location) {
      location = req.session.data['edit-course'].location
    }

    res.render('applications/course/location', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId),
      locations: getLocationItems(location)
    })
  })

  router.post('/applications/:applicationId/course/edit/location', (req, res) => {
    console.log(req.session.data['edit-course'])
    res.redirect(`/applications/${req.params.applicationId}/course/edit/funding-type`)
  })

  router.get('/applications/:applicationId/course/edit/funding-type', (req, res) => {
    res.render('applications/course/funding-type', {
      application: req.session.data.applications.find(app => app.id === req.params.applicationId)
    })
  })

  router.post('/applications/:applicationId/course/edit/funding-type', (req, res) => {
    console.log(req.session.data['edit-course'])
    res.redirect(`/applications/${req.params.applicationId}/course/edit/save`)
  })

  router.get('/applications/:applicationId/course/edit/save', (req, res) => {

    console.log(req.session.data['edit-course'])


    res.redirect(`/applications/${req.params.applicationId}`)
  })

}
