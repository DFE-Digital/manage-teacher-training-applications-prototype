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

  router.get('/account/personal-details', (req, res) => {
    var user = req.session.data.users[0]

    res.render('account/personal-details', { user })
  })

  router.get('/account/permissions', (req, res) => {
    var user = req.session.data.users[0]

    // mixin org permissions into user object
    user.organisations.forEach(org => {

      if(!org.permissions) return;

      org.permissions.applicableOrgs = {};
      org.permissions.nonApplicableOrgs = {};

      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'setupInterviews');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');
    })

    res.render('account/permissions', { user })
  })

  router.get('/organisation-settings/users', (req, res) => {
    res.render('organisation-settings/users/index')
  })

  router.get('/organisation-settings/users/new', (req, res) => {
    res.render('organisation-settings/users/new/index')
  })

  router.get('/organisation-settings/users/:userId', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)

    // mixin org permissions into user object

    user.organisations.forEach(org => {

      if(!org.permissions) return;

      org.permissions.applicableOrgs = {};
      org.permissions.nonApplicableOrgs = {};

      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'setupInterviews');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');
    })

    res.render('organisation-settings/users/show', { user })
  })

  router.post('/organisation-settings/users/new', (req, res) => {
    if(req.session.data.user.organisations.length > 1) {
      res.redirect('/organisation-settings/users/new/organisations')
    } else {
      res.redirect(`/organisation-settings/users/new/permissions/${req.session.data.user.organisations[0].id}`)
    }
  })

  router.get('/organisation-settings/users/new/organisations', (req, res) => {

    var organisationItems = req.session.data.user.organisations.map(org => {
      return {
        value: org.id,
        text: org.name
      }
    })

    res.render('organisation-settings/users/new/organisations', { organisationItems })
  })

  router.post('/organisation-settings/users/new/organisations', (req, res) => {
    res.redirect(`/organisation-settings/users/new/permissions/${req.session.data.newuser.organisations[0]}`)
  })

  router.get('/organisation-settings/users/new/permissions/:orgId', (req, res) => {
    var org = req.session.data.user.organisations.find(org => req.params.orgId == org.id)
    // hurrendous but don't worry peeps
    org = {
      org: org,
      permissions: {
        applicableOrgs: {},
        nonApplicableOrgs: {}
      }
    }

    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'setupInterviews');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');

    res.render('organisation-settings/users/new/permissions', {
      org
    })
  })

  router.post('/organisation-settings/users/new/permissions/:orgId', (req, res) => {
    let orgId = req.params.orgId
    if(req.session.data.newuser.access[orgId] == "Additional permissions") {
      res.redirect(`/organisation-settings/users/new/additional-permissions/${req.params.orgId}`)
    } else {
      // if the user belongs to one org, they won't be shown the orgs checkboxes
      // which means they'll be no data for it. So be defensive.
      let organisations = req.session.data.newuser.organisations
      let index = 0
      if(organisations && organisations.length > 1) {
        index = organisations.indexOf(req.params.orgId)
      }

      if(organisations && organisations[index+1]) {
        res.redirect(`/organisation-settings/users/new/permissions/${req.session.data.newuser.organisations[index+1]}`)
      } else {
        res.redirect(`/organisation-settings/users/new/check`)
      }
    }

  })

  router.get('/organisation-settings/users/new/additional-permissions/:orgId', (req, res) => {
    var org = req.session.data.user.organisations.find(org => req.params.orgId == org.id)

    // hurrendous but don't worry peeps
    org = {
      org: org,
      permissions: {
        applicableOrgs: {},
        nonApplicableOrgs: {}
      }
    }

    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'setupInterviews');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');

    res.render('organisation-settings/users/new/additional-permissions', {
      org
    })
  })

  router.post('/organisation-settings/users/new/additional-permissions/:orgId', (req, res) => {
    // if the user belongs to one org, they won't be shown the orgs checkboxes
    // which means they'll be no data for it. So be defensive.
    let organisations = req.session.data.newuser.organisations
    let index = 0
    if(organisations && organisations.length > 1) {
      index = organisations.indexOf(req.params.orgId)
    }

    if(organisations && organisations[index+1]) {
      res.redirect(`/organisation-settings/users/new/permissions/${req.session.data.newuser.organisations[index+1]}`)
    } else {
      res.redirect(`/organisation-settings/users/new/check`)
    }

  })

  router.get('/organisation-settings/users/new/check', (req, res) => {
    let organisations = req.session.data.newuser.organisations || [req.session.data.user.organisations[0].id]

    let orgs = organisations.map(orgId => {
      var returnValue = {
        org: req.session.data.organisations.find(org => org.id == orgId)
      }

      if(req.session.data.newuser.access[orgId] == "Additional permissions") {
        returnValue.permissions = {
            manageOrganisations: req.session.data.newuser.permissions[orgId].indexOf('manageOrganisations') > -1,
            manageUsers: req.session.data.newuser.permissions[orgId].indexOf('manageUsers') > -1,
            setupInterviews: req.session.data.newuser.permissions[orgId].indexOf('setupInterviews') > -1,
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
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'setupInterviews');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
      mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');
    })

    res.render('organisation-settings/users/new/check', {
      orgs
    })
  })

  router.post('/organisation-settings/users/new/check', (req, res) => {
    req.flash('success', 'User invited')
    res.redirect('/organisation-settings/users/')
  })

  // Edit name

  router.get('/organisation-settings/users/:userId/name/edit', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)
    res.render('organisation-settings/users/change-name', {
      user
    })
  })

  router.post('/organisation-settings/users/:userId/name/edit', (req, res) => {
    req.flash('success', 'Name updated')
    res.redirect(`/organisation-settings/users/${req.params.userId}`)
  })

  // Edit email

  router.get('/organisation-settings/users/:userId/email-address/edit', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)
    res.render('organisation-settings/users/change-email-address', {
      user
    })
  })

  router.post('/organisation-settings/users/:userId/email-address/edit', (req, res) => {
    req.flash('success', 'Email address updated')
    res.redirect(`/organisation-settings/users/${req.params.userId}`)
  })

  // Edit organisations

  router.get('/organisation-settings/users/:userId/organisations/edit', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)

    var items = req.session.data.user.organisations.map(org => {
      return {
        value: org.id,
        text: org.name
      }
    })

    res.render('organisation-settings/users/change-organisations', {
      user,
      items
    })
  })

  router.post('/organisation-settings/users/:userId/organisations/edit', (req, res) => {
    req.flash('success', 'Access updated')
    res.redirect(`/organisation-settings/users/${req.params.userId}`)
  })

  // Edit permissions

  router.get('/organisation-settings/users/:userId/permissions/:orgId/edit', (req, res) => {
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

    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'setupInterviews');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'makeDecisions');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewSafeguardingInformation');
    mixinRelatedOrgPermissions(org, req.session.data.relationships, 'viewDiversityInformation');
    res.render('organisation-settings/users/change-permissions', {
      user,
      org
    })
  })


  router.post('/organisation-settings/users/:userId/permissions/:orgId/edit', (req, res) => {
    req.flash('success', 'Permissions updated')
    res.redirect(`/organisation-settings/users/${req.params.userId}`)
  })

  // Delete user

  router.get('/organisation-settings/users/:userId/delete', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)
    res.render('organisation-settings/users/delete', { user  })
  })

  router.post('/organisation-settings/users/:userId/delete', (req, res) => {
    req.flash('success', 'Account deleted')
    res.redirect('/organisation-settings/users')
  })

}
