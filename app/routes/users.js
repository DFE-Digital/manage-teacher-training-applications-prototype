const ApplicationHelper = require('../data/helpers/application')

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

  router.get('/account/users', (req, res) => {
    res.render('account/users/index')
  })

  router.get('/account/users/new', (req, res) => {
    res.render('account/users/new/index')
  })

  router.get('/account/users/:userId', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)

    // mixin org permissions into user object

    user.organisations.forEach(org => {

      if(!org.permissions) return;

      org.permissions.applicableOrgs = {};
      org.permissions.nonApplicableOrgs = {};

      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');
    })

    res.render('account/users/show', { user })
  })

  router.post('/account/users/new', (req, res) => {
    if(req.session.data.user.organisations.length > 1) {
      res.redirect('/account/users/new/organisations')
    } else {
      res.redirect(`/account/users/new/permissions/${req.session.data.user.organisations[0].id}`)
    }
  })

  router.get('/account/users/new/organisations', (req, res) => {

    var organisationItems = req.session.data.user.organisations.map(org => {
      return {
        value: org.id,
        text: org.name
      }
    })

    res.render('account/users/new/organisations', { organisationItems })
  })

  router.post('/account/users/new/organisations', (req, res) => {
    res.redirect(`/account/users/new/permissions/${req.session.data.newuser.organisations[0]}`)
  })

  router.get('/account/users/new/permissions/:orgId', (req, res) => {
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

    res.render('account/users/new/permissions', {
      org
    })
  })

  router.post('/account/users/new/permissions/:orgId', (req, res) => {

    var index = req.session.data.newuser.organisations.indexOf(req.params.orgId)
    if(req.session.data.newuser.organisations[index+1]) {
      res.redirect(`/account/users/new/permissions/${req.session.data.newuser.organisations[index+1]}`)
    } else {
      res.redirect(`/account/users/new/check`)
    }

  })

  router.get('/account/users/new/check', (req, res) => {
    var orgs = req.session.data.newuser.organisations.map(orgId => {
      var returnValue = {
        org: req.session.data.organisations.find(org => org.id == orgId)
      }

      if(req.session.data.newuser.access[orgId] == "Extra permissions") {
        returnValue.permissions = {
            manageOrganisations: req.session.data.newuser.permissions[orgId].indexOf('manageOrganisations') > -1,
            manageUsers: req.session.data.newuser.permissions[orgId].indexOf('manageUsers') > -1,
            makeDecisions: req.session.data.newuser.permissions[orgId].indexOf('makeDecisions') > -1,
            viewSafeguardingInformation: req.session.data.newuser.permissions[orgId].indexOf('viewSafeguardingInformation') > -1,
            viewDiversityInformation: req.session.data.newuser.permissions[orgId].indexOf('viewDiversityInformation') > -1
          }
      }

      return returnValue
    })


    // mixin org permissions
    orgs.forEach(org => {

      if(!org.permissions) return;

      org.permissions.applicableOrgs = {};
      org.permissions.nonApplicableOrgs = {};
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');
    })

    res.render('account/users/new/check', {
      orgs
    })
  })


  router.post('/account/users/new/check', (req, res) => {
    req.flash('success', 'User successfully invited')
    res.redirect('/account/users/')
  })

  // Edit name

  router.get('/account/users/:userId/name/edit', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)
    res.render('account/users/change-name', {
      user
    })
  })

  router.post('/account/users/:userId/name/edit', (req, res) => {
    req.flash('success', 'User’s name successfully updated')
    res.redirect(`/account/users/${req.params.userId}`)
  })

  // Edit email

  router.get('/account/users/:userId/email-address/edit', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)
    res.render('account/users/change-email-address', {
      user
    })
  })

  router.post('/account/users/:userId/email-address/edit', (req, res) => {
    req.flash('success', 'User’s email address successfully updated')
    res.redirect(`/account/users/${req.params.userId}`)
  })

  // Edit organisations

  router.get('/account/users/:userId/organisations/edit', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)

    var items = req.session.data.user.organisations.map(org => {
      return {
        value: org.id,
        text: org.name
      }
    })

    res.render('account/users/change-organisations', {
      user,
      items
    })
  })

  router.post('/account/users/:userId/organisations/edit', (req, res) => {
    req.flash('success', 'User’s organisations updated')
    res.redirect(`/account/users/${req.params.userId}`)
  })

  // Edit permissions

  router.get('/account/users/:userId/permissions/:orgId/edit', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)
    var org = req.session.data.organisations.find(org => req.params.orgId == org.id)

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
    res.render('account/users/change-permissions', {
      user,
      org
    })
  })


  router.post('/account/users/:userId/permissions/:orgId/edit', (req, res) => {
    req.flash('success', 'User’s permissions successfully updated')
    res.redirect(`/account/users/${req.params.userId}`)
  })

  // Delete user

  router.get('/account/users/:userId/delete', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)
    res.render('account/users/delete', { user  })
  })

  router.post('/account/users/:userId/delete', (req, res) => {
    req.flash('success', 'User’s account successfully deleted')
    res.redirect('/account/users')
  })

}
