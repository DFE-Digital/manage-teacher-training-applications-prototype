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
    delete req.session.data.isAuthenticated

    res.redirect(`/register/start`)
  })

  router.get('/register/start', (req, res) => {
    // if signed in, next is the agreement, else sign-in
    let next = `/register/sign-in`
    if (req.session.data.isAuthenticated === true) {
      next = `/register/agreement`
    }

    res.render('register/v4/start', {
      actions: {
        next: next
      },
      accreditingBody:  {
        name: 'Wren Academy'
      }
    })
  })

  router.get('/register/agreement', (req, res) => {

    res.render('register/v5/agreement', {
      actions: {
        save: `/register/agreement`,
        back: `/register/start`
      },
      accreditingBody: {
        name: 'Wren Academy'
      }
    })
  })

  router.post('/register/agreement', checkHasAnswers, (req, res) => {
    const errors = []

    if (req.session.data.registration.acceptAgreement === undefined) {
      const error = {}
      error.fieldName = 'acceptAgreement'
      error.href = '#acceptAgreement'
      error.text = 'You must agree to these terms to use this service'
      errors.push(error)
    }

    if (errors.length) {
      res.render('register/v5/agreement', {
        actions: {
          save: `/register/agreement`,
          back: `/register/start`
        },
        accreditingBody:  {
          name: 'Wren Academy'
        },
        errors: errors
      })
    } else {
      res.redirect(`/register/done`)
    }
  })

  router.get('/register/done', checkHasAnswers, (req, res) => {
    res.render('register/v5/done', {})
  })

  // ===========================================================================
  // Sign in / register
  // ===========================================================================

  router.get('/register/sign-in', (req, res) => {
    res.render('register/v5/sign-in/sign-in', {
      actions: {
        save: `/register/sign-in`,
        create: `/register/register`,
        terms: `/register/terms`,
        forgotten: `/register/forgotten-password`
      }
    })
  })

  router.post('/register/sign-in', (req, res) => {
    const errors = []

    req.session.data.routes = {
      signout: `/register/sign-out`,
      account: `/register/account`
    }
    req.session.data.isAuthenticated = true
    res.redirect(`/register/agreement`)
  })

  router.get('/register/register', (req, res) => {
    res.render('register/v5/sign-in/register', {
      actions: {
        save: `/register/register`,
        back: `/register/sign-in`,
        signin: `/register/sign-in`,
        terms: `/register/terms`
      }
    })
  })

  router.post('/register/register', (req, res) => {
    const errors = []

    req.flash('success', {
      title: 'Verification email sent',
      description: 'A verification email has been sent to ' + req.session.data.email
    })

    res.redirect(`/register/confirm-email`)
  })

  router.get('/register/confirm-email', (req, res) => {
    res.render('register/v5/sign-in/confirm-email', {
      actions: {
        save: `/register/confirm-email`,
        back: `/register/register`,
        resend: `/register/resend-code`
      }
    })
  })

  router.post('/register/confirm-email', (req, res) => {
    const errors = []

    if (!req.session.data.code.length) {
      const error = {}
      error.fieldName = 'code'
      error.href = '#code'
      error.text = 'Enter your verification code'
      errors.push(error)
    }

    if (errors.length) {
      res.render('register/v5/sign-in/confirm-email', {
        actions: {
          save: `/register/confirm-email`,
          back: `/register/register`,
          resend: `/register/resend-code`
        },
        errors
      })
    } else {
      res.redirect(`/register/sign-in`)
    }
  })

  router.get('/register/resend-code', (req, res) => {
    res.render('register/v5/sign-in/resend-code', {
      actions: {
        save: `/register/resend-code`,
        back: `/register/confirm-email`
      }
    })
  })

  router.post('/register/resend-code', (req, res) => {
    const errors = []

    res.redirect(`/register/confirm-email`)
  })

  router.get('/register/forgotten-password', (req, res) => {
    res.render('register/v5/sign-in/forgotten-password', {
      actions: {
        save: `/register/forgotten-password`,
        back: `/register/sign-in`
      }
    })
  })

  router.post('/register/forgotten-password', (req, res) => {
    const errors = []

    req.flash('success', {
      title: 'Verification email sent',
      description: 'A verification email has been sent to ' + req.session.data.email
    })

    res.redirect(`/register/verification-code`)
  })

  router.get('/register/verification-code', (req, res) => {
    res.render('register/v5/sign-in/verification-code', {
      actions: {
        save: `/register/verification-code`,
        back: `/register/sign-in`
      }
    })
  })

  router.post('/register/verification-code', (req, res) => {
    const errors = []

    if (!req.session.data.code.length) {
      const error = {}
      error.fieldName = 'code'
      error.href = '#code'
      error.text = 'Enter your verification code'
      errors.push(error)
    }

    if (errors.length) {
      res.render('register/v5/sign-in/verification-code', {
        actions: {
          save: `/register/verification-code`,
          back: `/register/sign-in`
        },
        errors
      })
    } else {
      res.redirect(`/register/create-password`)
    }
  })

  router.get('/register/create-password', (req, res) => {
    res.render('register/v5/sign-in/create-password', {
      actions: {
        save: `/register/create-password`,
        back: `/register/sign-in`
      }
    })
  })

  router.post('/register/create-password', (req, res) => {
    const errors = []

    res.redirect(`/register/password-reset`)
  })

  router.get('/register/password-reset', (req, res) => {
    res.render('register/v5/sign-in/password-reset', {
      actions: {
        next: `/register/sign-in`
      }
    })
  })

  router.get('/register/terms', (req, res) => {
    res.render('register/v5/sign-in/terms', {
      actions: {
        back: req.headers.referer
      }
    })
  })

  router.get('/register/sign-out', (req, res) => {
    delete req.session.data.isAuthenticated
    delete req.session.data.routes
    req.flash('success','You have successfully signed out')
    res.redirect(`/register/start`)
  })

}
