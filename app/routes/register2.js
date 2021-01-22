const organisations = require('../data/registrations.json').filter(org => !org.isRegistered && org.isAccreditedBody)
const providers = require('../data/registrations.json').filter(org => !org.isAccreditedBody)

function checkHasAnswers (req, res, next) {
  console.log(req.session.data.registration)
  if (req.session.data.registration === undefined) {
    res.redirect('/register2')
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

  router.get('/register2', (req, res) => {
    // delete any previous onboarding data
    delete req.session.data.registration

    res.render('register/v2/index', {
      organisations
    })
  })

  router.get('/register2/:organisationId/start', (req, res) => {
    // set up the structure into which we'll put the onboarding data
    if (req.session.data.registration === undefined || req.session.data.registration.accreditingBody.id !== req.params.organisationId) {
      req.session.data.registration = {}

      // get the accrediting body (HEI) information
      const accreditingBody = organisations.filter(org => org.id == req.params.organisationId)[0]

      // put the accrediting body into the session for convenience
      req.session.data.registration.accreditingBody = accreditingBody

      // get the training providers for the accrediting body
      const trainingProviders = providers
                                  .filter(org => org.accreditingBodies.includes(req.params.organisationId))
                                  .sort((a, b) => a.name.localeCompare(b.name))

      // put the training prviders into the session for convenience
      req.session.data.registration.trainingProviders = trainingProviders

      // put the training provider ids into an array so we can use them to work out back routing
      req.session.data.registration.trainingProvidersIds = getTrainingProvidersIds(trainingProviders)

      // set the number of sections in the flow
      // training provider count + 1 for the data sharing agreement
      req.session.data.registration.sectionsCount = trainingProviders.length + 1

      // set the sections completed count
      req.session.data.registration.sectionsCompletedCount = 0
    }

    res.render('register/v2/start', {
      actions: {
        next: `/register2/${req.params.organisationId}/providers`
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      trainingProviders: req.session.data.registration.trainingProviders
    })
  })

  router.get('/register2/:organisationId/providers', (req, res) => {
    res.render('register/v2/providers', {
      actions: {
        courses: `/register2/${req.params.organisationId}/providers/`,
        users: `/register2/${req.params.organisationId}/providers/`,
        agreement: `/register2/${req.params.organisationId}/agreement`,
        back: `/register2/${req.params.organisationId}/start`
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      trainingProviders: req.session.data.registration.trainingProviders,
      sectionsCount: req.session.data.registration.sectionsCount,
      sectionsCompletedCount: req.session.data.registration.sectionsCompletedCount
    })
  })


  router.get('/register2/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {
    const trainingProvider = req.session.data.registration.trainingProviders.filter(org => org.id === req.params.providerId)[0]

    // get the position of the current provider id
    const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

    // set the save route for new or change flow
    let save = `/register2/${req.params.organisationId}/providers/${req.params.providerId}`
    if (req.headers.referer.includes('check-your-answers')) {
      save = save + '?referer=check-your-answers'
    }

    // set the back button default to the start page
    let back = `/register/${req.params.organisationId}/start`

    // set the back button to the check your answers page if that's where the user came from
    if (req.query.referer == 'check-your-answers') {
      back = `/register2/${req.params.organisationId}/check-your-answers`
    } else {
      // if we're no on the first provider, we need to change the back button
      if (position > 0) {
        // get the previous provider id from the array
        const previousTrainingProviderId = req.session.data.registration.trainingProvidersIds[position - 1]
        // set the back link
        back = `/register2/${req.params.organisationId}/providers/${previousTrainingProviderId}`
      }
    }

    res.render('register/v2/provider', {
      actions: {
        save: save,
        back: back
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      trainingProvider
    })
  })

  router.post('/register2/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {
    // get the position of the current provider id
    const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

    // add the onboard answer to the associated training provider object
    req.session.data.registration.trainingProviders[position].onboard = req.session.data.registration.onboard

    if (req.session.data.registration.onboard == 'yes') {

      res.redirect(`/register2/${req.params.organisationId}/providers/${req.params.providerId}/users`)

    } else {

      // increment the sections completed count
      req.session.data.registration.sectionsCompletedCount += 1

      if (req.query.referer == 'check-your-answers') {

        res.redirect(`/register2/${req.params.organisationId}/check-your-answers`)

      } else {

        // if we've reached the last provider, move to the next step, else next continue with the providers
        if (position == (req.session.data.registration.trainingProviders.length - 1)) {
          // set the last provider id for use in the back link
          req.session.data.registration.previousTrainingProviderId = req.params.providerId

          // redirect to the data sharing agreement
          res.redirect(`/register2/${req.params.organisationId}/agreement`)

        } else {
          // set the next training provider id
          const nextTrainingProviderId = req.session.data.registration.trainingProvidersIds[position + 1]

          res.redirect(`/register2/${req.params.organisationId}/providers/${nextTrainingProviderId}`)
        }

      }

    }

  })

  router.get('/register2/:organisationId/providers/:providerId/users', checkHasAnswers, (req, res) => {
    const trainingProvider = req.session.data.registration.trainingProviders.filter(org => org.id === req.params.providerId)[0]

    // set the save route for new or change flow
    let save = `/register2/${req.params.organisationId}/providers/${req.params.providerId}/users`
    if (req.headers.referer.includes('check-your-answers')) {
      save = save + '?referer=check-your-answers'
    }

    // set the back button to the check your answers page if that's where the user came from
    let back = `/register2/${req.params.organisationId}/providers/${req.params.providerId}`
    if (req.query.referer == 'check-your-answers') {
      back = `/register2/${req.params.organisationId}/check-your-answers`
    }

    res.render('register/v2/users', {
      actions: {
        save: save,
        back: back
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      trainingProvider
    })

  })

  router.post('/register2/:organisationId/providers/:providerId/users', checkHasAnswers, (req, res) => {
    const trainingProvider = req.session.data.registration.trainingProviders.filter(org => org.id === req.params.providerId)[0]

    // increment the sections completed count
    req.session.data.registration.sectionsCompletedCount += 1

    // get the training provider user and populate the contact object
    if (req.session.data.registration.contact.choice != 'other') {
      const choice = req.session.data.registration.contact.choice
      const contact = trainingProvider.users[choice]
      contact.choice = choice

      req.session.data.registration.onboarding.contact = contact
    } else {
      req.session.data.registration.onboarding.contact.choice = 'other'
    }

    // get the position of the current provider id
    const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

    // combine the provider form details with the associated training provider object
    req.session.data.registration.trainingProviders[position] = {...req.session.data.registration.trainingProviders[position], ...req.session.data.registration.onboarding}

    // clear out the form data since we no longer need it, ready for the next provider
    delete req.session.data.registration.onboarding
    delete req.session.data.registration.contact

    // if we've reached the last provider, move to the next step, else next continue with the providers
    if (position == (req.session.data.registration.trainingProviders.length - 1)) {
      // set the last provider id for use in the back link
      req.session.data.registration.previousTrainingProviderId = req.params.providerId

      // redirect to the data sharing agreement
      res.redirect(`/register2/${req.params.organisationId}/agreement`)

    } else {
      // set the next training provider id
      const nextTrainingProviderId = req.session.data.registration.trainingProvidersIds[position + 1]

      res.redirect(`/register2/${req.params.organisationId}/providers/${nextTrainingProviderId}`)
    }

  })

  router.get('/register2/:organisationId/agreement', checkHasAnswers, (req, res) => {
    const previousTrainingProviderId = req.session.data.registration.previousTrainingProviderI

    res.render('register/v2/agreement', {
      actions: {
        save: `/register2/${req.params.organisationId}/agreement`,
        back: `/register2/${req.params.organisationId}/providers/${previousTrainingProviderId}`
      },
      accreditingBody: req.session.data.registration.accreditingBody
    })
  })

  router.post('/register2/:organisationId/agreement', checkHasAnswers, (req, res) => {
    const errors = []

    if (req.session.data.registration.acceptAgreement === undefined) {
      const error = {}
      error.fieldName = 'acceptAgreement'
      error.href = '#acceptAgreement'
      error.text = 'You must agree to these terms to use this service'
      errors.push(error)
    }

    if (errors.length) {

      res.render('register/v2/agreement', {
        actions: {
          save: `/register2/${req.params.organisationId}/agreement`,
          back: `/register2/${req.params.organisationId}/providers`
        },
        accreditingBody: req.session.data.registration.accreditingBody,
        errors: errors
      })
    } else {

      // increment the sections completed count
      req.session.data.registration.sectionsCompletedCount += 1

      res.redirect(`/register2/${req.params.organisationId}/check-your-answers`)
    }
  })

  router.get('/register2/:organisationId/check-your-answers', checkHasAnswers, (req, res) => {
    res.render('register/v2/check-your-answers', {
      actions: {
        next: `/register2/${req.params.organisationId}/done`,
        back: `/register2/${req.params.organisationId}/agreement`
      },
      registration: req.session.data.registration
    })
  })

  router.get('/register2/:organisationId/done', checkHasAnswers, (req, res) => {
    // set invitation count for use in pluralising content
    const trainingProviderInviteCount = req.session.data.registration.trainingProviders.filter(org => org.onboard == 'yes').length

    res.render('register/v2/done', {
      trainingProviderInviteCount
    })
  })

}
