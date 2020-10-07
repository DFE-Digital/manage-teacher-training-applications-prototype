const utils = require('../data/application-utils')

function mixinRelatedOrgPermissions(org, relationships, permissionType) {
    relationships.forEach(relationship => {
      // org not in relationship at all
      if(relationship.org1.id != org.org.id && relationship.org2.id != org.org.id ) {
        return;
      }

      var partnerKeyName = relationship.org1.id == org.org.id ? 'org2' : 'org1';
      var orgKeyPermissions = relationship.org1.id == org.org.id ? 'org1Permissions' : 'org2Permissions';

      if(relationship[orgKeyPermissions] && relationship[orgKeyPermissions][permissionType]) {
        if(!org.permissions.applicableOrgs[permissionType]) {
          org.permissions.applicableOrgs[permissionType] = []
        }
        org.permissions.applicableOrgs[permissionType].push(relationship[partnerKeyName])
      } else {
        if(!org.permissions.nonApplicableOrgs[permissionType]) {
          org.permissions.nonApplicableOrgs[permissionType] = []
        }
        org.permissions.nonApplicableOrgs[permissionType].push(relationship[partnerKeyName])
      }

    })
  }

module.exports = router => {
  router.get('/users', (req, res) => {
    const flashMessage = utils.getFlashMessage({
      flash: req.flash('success'),
      overrideValue: req.query.flash,
      map: {
        'user-invited': 'User successfully invited',
        'user-account-deleted': 'User’s account successfully deleted'
      }
    })

    res.render('users/index', {
      flashMessage: flashMessage
    })
  })



  // router.get('/users/:userId', (req, res) => {
  //   const flashMessage = utils.getFlashMessage({
  //     flash: req.flash('success'),
  //     overrideValue: req.query.flash,
  //     map: {
  //       'user-name-updated': 'User’s name successfully updated',
  //       'user-email-address-updated': 'User’s email address successfully updated',
  //       'user-providers-updated': 'User’s access successfully updated',
  //       'user-permissions-updated': 'User’s permissions successfully updated'
  //     }
  //   })

  //   res.render(`users/${req.params.userId}/index`, {
  //     flashMessage: flashMessage
  //   })
  // })

  router.get('/users/new', (req, res) => {
    res.render('users/new/index')
  })

  router.get('/users/:userId', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)

    // mixin org permissions into user object
    user.organisations.forEach(org => {
      org.permissions.applicableOrgs = {};
      org.permissions.nonApplicableOrgs = {};

      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');
    })

    res.render('users/show', { user })
  })

  router.post('/users/new', (req, res) => {
    if(req.session.data.user.organisations.length > 1) {
      res.redirect('/users/new/organisations')
    } else {
      res.redirect(`/users/new/permissions/${req.session.data.user.organisations[0].id}`)
    }
  })

  router.get('/users/new/organisations', (req, res) => {
    var items = req.session.data.user.organisations.map(org => {
      return {
        value: org.id,
        text: org.name
      }
    })

    res.render('users/new/organisations', { items })
  })

  router.post('/users/new/organisations', (req, res) => {
    res.redirect(`/users/new/permissions/${req.session.data.newuser.organisations[0]}`)
  })

  router.get('/users/new/permissions/:orgId', (req, res) => {
    var org = req.session.data.user.organisations.find(org => req.params.orgId == org.id)

    // hurrendous but don't worry peeps
    org = {
      org: org,
      permissions: {
        applicableOrgs: {},
        nonApplicableOrgs: {}
      }
    }

    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');

    res.render('users/new/permissions', {
      org
    })
  })


  router.post('/users/new/check', (req, res) => {
    req.flash('success', 'user-invited')
    res.redirect('/users/')
  })

  router.post('/users/new-check', (req, res) => {
    req.flash('success', 'user-invited')
    res.redirect('/users/')
  })

  router.post('/users/:userId/change-name', (req, res) => {
    req.flash('success', 'user-name-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/:userId/change-email-address', (req, res) => {
    req.flash('success', 'user-email-address-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/change-providers', (req, res) => {
    req.flash('success', 'user-providers-updated')
    res.redirect('/users/show')
  })

  router.post('/users/:userId/change-permissions', (req, res) => {
    req.flash('success', 'user-permissions-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/:userId/change-permissions2', (req, res) => {
    req.flash('success', 'user-permissions-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/:userId/change-organisations/check', (req, res) => {
    req.flash('success', 'user-permissions-updated')
    res.redirect(`/users/${req.params.userId}`)
  })

  router.post('/users/:userId/delete', (req, res) => {
    req.flash('success', 'user-account-deleted')
    res.redirect('/users')
  })

}
