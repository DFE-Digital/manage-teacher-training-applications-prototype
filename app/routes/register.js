const organisations = require('../data/registrations.json').filter(org => !org.isRegistered && org.isAccreditedBody)
const providers = require('../data/registrations.json').filter(org => !org.isAccreditedBody)

function checkHasAnswers (req, res, next) {
  if (req.session.data.registration === undefined) {
    res.redirect('/register')
  } else {
    next()
  }
}

function getTrainingProvidersIds (data) {
  const array = []
  for (let i = 0; i < data.length; i++) {
    array.push(data[i].id)
  }
  return array
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

    // put the training provider ids into an array so we can use them to work out back routing
    req.session.data.registration.trainingProvidersIds = getTrainingProvidersIds(trainingProviders)

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

    // TODO: fix back button for check your answers referrer
    // set the back button default to the start page
    let back = `/register/${req.params.organisationId}/start`
    // if we're no on the first provider, we need to change the back button
    if (req.session.data.registration.trainingProviderPosition > 0) {
      // get the position of the current provider id
      const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)
      // if the current position isn't the first item
      if (position) {
        // get the previous provider id from the array
        const previousProviderId = req.session.data.registration.trainingProvidersIds[position-1]
        // set the back link
        back = `/register/${req.params.organisationId}/providers/${previousProviderId}`
      }
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
    // TODO: fix session data storage

    // combine the provider form details with the associated training provider object
    req.session.data.registration.trainingProviders[req.session.data.registration.trainingProviderPosition] = {...req.session.data.registration.trainingProviders[req.session.data.registration.trainingProviderPosition], ...req.session.data.registration.onboarding}

    // clear out the onboarding form data since we no longer need it
    delete req.session.data.registration.onboarding

    // if we've reached the last provider, move to the next step, else next continue with the providers
    if (req.session.data.registration.trainingProviderPosition == (req.session.data.registration.trainingProviderCount-1)) {
      // set the last provider id for use in the back link
      req.session.data.registration.lastProviderId = req.params.providerId

      // redirect to the data sharing agreement
      res.redirect(`/register/${req.params.organisationId}/agreement`)

    } else {
      // set the previous provider id for use in the back link
      req.session.data.registration.previousProviderId = req.params.providerId

      // increment the trainingProviderPosition to get the next position
      req.session.data.registration.trainingProviderPosition += 1

      // set the next training provider id
      const nextTrainingProviderId = req.session.data.registration.trainingProviders[req.session.data.registration.trainingProviderPosition].id

      res.redirect(`/register/${req.params.organisationId}/providers/${nextTrainingProviderId}`)
    }
  })

  router.get('/register/:organisationId/agreement', checkHasAnswers, (req, res) => {
    const lastProviderId = req.session.data.registration.lastProviderId

    res.render('register/agreement', {
      actions: {
        save: `/register/${req.params.organisationId}/agreement`,
        back: `/register/${req.params.organisationId}/providers/${lastProviderId}`
      },
      accreditingBody: req.session.data.registration.accreditingBody
    })

  })

  router.post('/register/:organisationId/agreement', checkHasAnswers, (req, res) => {
    res.redirect(`/register/${req.params.organisationId}/check-your-answers`)
  })

  router.get('/register/:organisationId/check-your-answers', checkHasAnswers, (req, res) => {
    // set invitation count for use in showing content
    const trainingProviderInviteCount = req.session.data.registration.trainingProviders.filter(org => org.onboard == 'yes').length

    res.render('register/check-your-answers', {
      actions: {
        next: `/register/${req.params.organisationId}/done`,
        back: `/register/${req.params.organisationId}/agreement`
      },
      registration: req.session.data.registration,
      trainingProviderInviteCount
    })
  })

  router.get('/register/:organisationId/done', checkHasAnswers, (req, res) => {
    // set invitation count for use in pluralising content
    const trainingProviderInviteCount = req.session.data.registration.trainingProviders.filter(org => org.onboard == 'yes').length

    res.render('register/done', {
      trainingProviderInviteCount
    })
  })

}
