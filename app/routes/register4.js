const organisations = require('../data/registrations.json')
                        .filter(org => !org.isRegistered && org.isAccreditedBody)
                        .sort((a, b) => a.name.localeCompare(b.name))
const providers = require('../data/registrations.json').filter(org => !org.isAccreditedBody)

function checkHasAnswers (req, res, next) {
  // console.log(req.session.data.registration)
  if (req.session.data.registration === undefined) {
    res.redirect('/register4')
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

  router.get('/register4', (req, res) => {
    // delete any previous onboarding data
    delete req.session.data.registration

    res.render('register/v4/index', {
      organisations
    })
  })

  router.get('/register4/sign-in', (req, res) => {
    res.render('register/v4/sign-in/sign-in', {
      actions: {
        save: `/register4/sign-in`,
        create: `/register4/register`,
        terms: `/register4/terms`,
        forgotten: `/register4/forgotten-password`
      }
    })
  })

  router.post('/register4/sign-in', (req, res) => {

    res.redirect('')
  })

  router.get('/register4/register', (req, res) => {
    res.render('register/v4/sign-in/register', {
      actions: {
        save: `/register4/register`,
        back: `/register4/sign-in`,
        signin: `/register4/sign-in`,
        terms: `/register4/terms`
      }
    })
  })

  router.post('/register4/register', (req, res) => {

    req.flash('success', {
      title: 'Verification email sent',
      description: 'A verification email has been sent to ' + req.session.data.email
    })

    res.redirect('/register4/confirm-email')
  })

  router.get('/register4/confirm-email', (req, res) => {
    res.render('register/v4/sign-in/confirm-email', {
      actions: {
        save: `/register4/confirm-email`,
        back: `/register4/register`,
        resend: `/register4/resend`
      }
    })
  })

  router.post('/register4/confirm-email', (req, res) => {

    res.redirect('')
  })

  router.get('/register4/resend', (req, res) => {
    res.render('register/v4/sign-in/resend-code', {
      actions: {
        save: `/register4/resend`,
        back: `/register4/confirm-email`
      }
    })
  })

  router.post('/register4/resend', (req, res) => {

    // TODO: next step
    res.redirect('/register4/')
  })

  router.get('/register4/forgotten-password', (req, res) => {
    res.render('register/v4/sign-in/forgotten-password', {
      actions: {
        save: `/register4/forgotten-password`,
        back: `/register4/sign-in`
      }
    })
  })

  router.post('/register4/forgotten-password', (req, res) => {

    req.flash('success', {
      title: 'Verification email sent',
      description: 'A verification email has been sent to ' + req.session.data.email
    })

    res.redirect('/register4/verification-code')
  })

  router.get('/register4/verification-code', (req, res) => {
    res.render('register/v4/sign-in/verification-code', {
      actions: {
        save: `/register4/verification-code`,
        back: `/register4/sign-in`
      }
    })
  })

  router.post('/register4/verification-code', (req, res) => {

    res.redirect('/register4/create-password')
  })

  router.get('/register4/create-password', (req, res) => {
    res.render('register/v4/sign-in/create-password', {
      actions: {
        save: `/register4/create-password`,
        back: `/register4/sign-in`
      }
    })
  })

  router.post('/register4/create-password', (req, res) => {

    res.redirect('/register4/password-reset')
  })

  router.get('/register4/password-reset', (req, res) => {
    res.render('register/v4/sign-in/password-reset', {
      actions: {
        next: `/register4/sign-in`
      }
    })
  })

  router.get('/register4/terms', (req, res) => {
    res.render('register/v4/sign-in/terms', {
      actions: {
        back: req.headers.referer
      }
    })
  })

  router.get('/register4/:organisationId/start', (req, res) => {
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

      // put the training providers into the session for convenience
      req.session.data.registration.trainingProviders = trainingProviders

      // get the training providers already onboarded
      const trainingProvidersOnboarded = trainingProviders.filter(org => org.isRegistered === true)

      // put the training providers into the session for convenience
      req.session.data.registration.trainingProvidersOnboarded = trainingProvidersOnboarded

      // get the training providers not already onboarded
      const trainingProvidersNotOnboarded = trainingProviders.filter(org => org.isRegistered === false)

      // put the training providers into the session for convenience
      req.session.data.registration.trainingProvidersNotOnboarded = trainingProvidersNotOnboarded

      // put the training provider ids into an array so we can use them to work out back routing
      req.session.data.registration.trainingProvidersIds = getTrainingProvidersIds(trainingProvidersNotOnboarded)
    }

    // set the first training provider id
    const firstTrainingProviderId = req.session.data.registration.trainingProvidersIds[0]

    res.render('register/v4/start', {
      actions: {
        next: `/register4/${req.params.organisationId}/providers/${firstTrainingProviderId}`
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      trainingProvidersOnboarded: req.session.data.registration.trainingProvidersOnboarded,
      trainingProvidersNotOnboarded: req.session.data.registration.trainingProvidersNotOnboarded
    })
  })


  router.get('/register4/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {
    const trainingProvider = req.session.data.registration.trainingProvidersNotOnboarded.filter(org => org.id === req.params.providerId)[0]

    // get the position of the current provider id
    const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

    // set the save route for new or change flow
    let save = `/register4/${req.params.organisationId}/providers/${req.params.providerId}`
    if (req.headers.referer.includes('check-your-answers')) {
      save = save + '?referer=check-your-answers'
    }

    // set the back button default to the start page
    let back = `/register4/${req.params.organisationId}/start`

    // set the back button to the check your answers page if that's where the user came from
    if (req.query.referer == 'check-your-answers') {
      back = `/register4/${req.params.organisationId}/check-your-answers`
    } else {
      // if we're no on the first provider, we need to change the back button
      if (position > 0) {
        // get the previous provider id from the array
        const previousProviderId = req.session.data.registration.trainingProvidersIds[position - 1]
        // set the back link
        back = `/register4/${req.params.organisationId}/providers/${previousProviderId}`
      }
    }

    res.render('register/v4/provider', {
      actions: {
        save: save,
        back: back
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      trainingProvider
    })
  })

  router.post('/register4/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {
    const trainingProvider = req.session.data.registration.trainingProviders.filter(org => org.id === req.params.providerId)[0]

    // get the training provider user and populate the contact object
    if (req.session.data.registration.contact.choice !== undefined && req.session.data.registration.contact.choice != 'other') {
      const choice = req.session.data.registration.contact.choice
      const contact = trainingProvider.users[choice]
      contact.choice = choice
      req.session.data.registration.contact = contact
    }

    // get the position of the current provider id
    const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

    // combine the provider form details with the associated training provider object
    req.session.data.registration.trainingProvidersNotOnboarded[position].contact = req.session.data.registration.contact

    // clear out the form data since we no longer need it, ready for the next provider
    delete req.session.data.registration.contact

    if (req.query.referer == 'check-your-answers') {
      // redirect to the data sharing agreement
      res.redirect(`/register4/${req.params.organisationId}/check-your-answers`)
    } else {
      // if we've reached the last provider, move to the next step, else next continue with the providers
      if (position == (req.session.data.registration.trainingProvidersNotOnboarded.length - 1)) {
        // set the last provider id for use in the back link
        req.session.data.registration.lastTrainingProviderId = req.params.providerId

        // redirect to the data sharing agreement
        res.redirect(`/register4/${req.params.organisationId}/agreement`)

      } else {
        // set the next training provider id
        const nextTrainingProviderId = req.session.data.registration.trainingProvidersIds[position + 1]

        res.redirect(`/register4/${req.params.organisationId}/providers/${nextTrainingProviderId}`)
      }
    }
  })

  router.get('/register4/:organisationId/agreement', checkHasAnswers, (req, res) => {
    const lastTrainingProviderId = req.session.data.registration.lastTrainingProviderId

    res.render('register/v4/agreement', {
      actions: {
        save: `/register4/${req.params.organisationId}/agreement`,
        back: `/register4/${req.params.organisationId}/providers/${lastTrainingProviderId}`
      },
      accreditingBody: req.session.data.registration.accreditingBody
    })
  })

  router.post('/register4/:organisationId/agreement', checkHasAnswers, (req, res) => {
    const errors = []

    if (req.session.data.registration.acceptAgreement === undefined) {
      const error = {}
      error.fieldName = 'acceptAgreement'
      error.href = '#acceptAgreement'
      error.text = 'You must agree to these terms to use this service'
      errors.push(error)
    }

    if (errors.length) {
      const lastTrainingProviderId = req.session.data.registration.lastTrainingProviderId

      res.render('register/v4/agreement', {
        actions: {
          save: `/register4/${req.params.organisationId}/agreement`,
          back: `/register4/${req.params.organisationId}/providers/${lastTrainingProviderId}`
        },
        accreditingBody: req.session.data.registration.accreditingBody,
        errors: errors
      })
    } else {
      res.redirect(`/register4/${req.params.organisationId}/check-your-answers`)
    }
  })

  router.get('/register4/:organisationId/check-your-answers', checkHasAnswers, (req, res) => {
    res.render('register/v4/check-your-answers', {
      actions: {
        next: `/register4/${req.params.organisationId}/done`,
        back: `/register4/${req.params.organisationId}/agreement`
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      trainingProviders: req.session.data.registration.trainingProvidersNotOnboarded,
      acceptAgreement: req.session.data.registration.acceptAgreement
    })
  })

  router.get('/register4/:organisationId/done', checkHasAnswers, (req, res) => {
    // set invitation count for use in pluralising content
    // const trainingProviderInviteCount = req.session.data.registration.trainingProviders.filter(org => org.onboard == 'yes').length

    res.render('register/v4/done', {
      // trainingProviderInviteCount
    })
  })

}
