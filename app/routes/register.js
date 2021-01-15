const organisations = require('../data/registrations.json').filter(org => !org.isRegistered && org.isAccreditedBody)
const providers = require('../data/registrations.json').filter(org => !org.isAccreditedBody)

function checkHasAnswers (req, res, next) {
  if (req.session.data.registration === undefined) {
    res.redirect('/register')
  } else {
    next()
  }
}

module.exports = router => {

  router.get('/register', (req, res) => {

    // delete any previous onboarding data
    delete req.session.data.registration

    res.render('register/index', {
      organisations
    })

  })

  router.get('/register/:organisationId/start', (req, res) => {

    // set up the structure into which we'll put the onboarding data
    req.session.data.registration = {}

    // get the accrediting body (HEI) information
    const accreditingBody = organisations.filter(org => org.id == req.params.organisationId)[0]

    // put the accrediting body into the session for convenience
    req.session.data.registration.accreditingBody = accreditingBody

    // get the training providers for the accrediting body
    const trainingProviders = providers.filter(org => org.accreditingBodies.includes(req.params.organisationId))

    // put the training prviders into the session for convenience
    req.session.data.registration.trainingProviders = trainingProviders

    // get the number of training providers. We'll use this to iterate through the list of providers
    req.session.data.registration.trainingProviderCount = trainingProviders.length

    // set the training provider position. We'll use this to iterate through the list of providers
    req.session.data.registration.trainingProviderPosition = 0

    // set the first training provider id
    const trainingProviderId = req.session.data.registration.trainingProviders[req.session.data.registration.trainingProviderPosition].id

    res.render('register/start', {
      actions: {
        next: `/register/${req.params.organisationId}/providers/${trainingProviderId}`
      },
      accreditingBody,
      trainingProviders
    })

  })


  router.get('/register/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {

    const trainingProvider = req.session.data.registration.trainingProviders.filter(org => org.id === req.params.providerId)[0]

    // TODO: fix back link to go to correct provider page
    let back = `/register/${req.params.organisationId}/start`
    if (req.session.data.registration.trainingProviderPosition > 0) {
      const previousProviderId = 0
      back = `/register/${req.params.organisationId}/providers/${previousProviderId}`
    }

    res.render('register/provider', {
      actions: {
        save: `/register/${req.params.organisationId}/providers/${req.params.providerId}`,
        back: back
      },
      trainingProvider
    })

  })

  router.post('/register/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {

    // combine the provider form details with the associated training provider object
    req.session.data.registration.trainingProviders[req.session.data.registration.trainingProviderPosition] = {...req.session.data.registration.trainingProviders[req.session.data.registration.trainingProviderPosition], ...req.session.data.registration.onboarding}

    // clear out the onboarding form data since we no longer need it
    delete req.session.data.registration.onboarding

    // if we've reached the last provider, move to the next step, else next continue with the providers
    if (req.session.data.registration.trainingProviderPosition == (req.session.data.registration.trainingProviderCount-1)) {

      // redirect to the data sharing agreement
      res.redirect(`/register/${req.params.organisationId}/agreement`)

    } else {

      // increment the trainingProviderPosition to get the next position
      req.session.data.registration.trainingProviderPosition += 1

      // set the next training provider id
      const nextTrainingProviderId = req.session.data.registration.trainingProviders[req.session.data.registration.trainingProviderPosition].id

      res.redirect(`/register/${req.params.organisationId}/providers/${nextTrainingProviderId}`)
    }

  })

  router.get('/register/:organisationId/agreement', checkHasAnswers, (req, res) => {


    res.render('register/agreement', {
      actions: {
        save: ``,
        back: ``
      },
      accreditingBody: req.session.data.registration.accreditingBody
    })

  })

  router.post('/register/:organisationId/agreement', checkHasAnswers, (req, res) => {


    res.redirect(`/register/${req.params.organisationId}/check-your-answers`)

  })

  router.get('/register/:organisationId/check-your-answers', checkHasAnswers, (req, res) => {


    res.render('register/check-your-answers', {
      actions: {
        next: `/register/${req.params.organisationId}/done`,
        back: `/register/${req.params.organisationId}/agreement`
      },
      registration: req.session.data.registration
    })

  })

  router.get('/register/:organisationId/done', checkHasAnswers, (req, res) => {


    res.render('register/done', {

    })

  })

}
