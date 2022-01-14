const ApplicationHelper = require('../data/helpers/application')
const content = require('../data/content')
const { v4: uuidv4 } = require('uuid')

function getOrganisationPermission(org, relationships) {
  var permissions = {
    applicableOrgs: {
      setupInterviews: [],
      makeDecisions: [],
      viewSafeguardingInformation: [],
      viewDiversityInformation: []
    },
    nonApplicableOrgs: {
      setupInterviews: [],
      makeDecisions: [],
      viewSafeguardingInformation: [],
      viewDiversityInformation: []
    }
  }
  relationships.filter(relationship => {
    return relationship.org1.id === org.id || relationship.org2.id === org.id
  }).forEach(relationship => {
    var orgKey = relationship.org1.id == org.id ? 'org2' : 'org1';
    let permissionsKey = relationship.org1.id == org.id ? 'org1Permissions' : 'org2Permissions';

    if(relationship[permissionsKey].setupInterviews) {
      permissions.applicableOrgs.setupInterviews.push(relationship[orgKey])
    } else {
      permissions.nonApplicableOrgs.setupInterviews.push(relationship[orgKey])
    }

    if(relationship[permissionsKey].makeDecisions) {
      permissions.applicableOrgs.makeDecisions.push(relationship[orgKey])
    } else {
      permissions.nonApplicableOrgs.makeDecisions.push(relationship[orgKey])
    }

    if(relationship[permissionsKey].viewSafeguardingInformation) {
      permissions.applicableOrgs.viewSafeguardingInformation.push(relationship[orgKey])
    } else {
      permissions.nonApplicableOrgs.viewSafeguardingInformation.push(relationship[orgKey])
    }

    if(relationship[permissionsKey].viewDiversityInformation) {
      permissions.applicableOrgs.viewDiversityInformation.push(relationship[orgKey])
    } else {
      permissions.nonApplicableOrgs.viewDiversityInformation.push(relationship[orgKey])
    }

  })
  return permissions
}

module.exports = router => {

  router.get('/organisation-settings/:orgId/users', (req, res) => {
    let org = req.session.data.organisations.find(org => org.id == req.params.orgId)
    let users = req.session.data.users.filter(user => {
      return user.organisation.id == req.params.orgId
    })

    users.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))

    res.render('organisation-settings/users/index', {
      org,
      users
    })
  })

  router.get('/organisation-settings/:orgId/users/new', (req, res) => {
    let org = req.session.data.user.organisations.find(org => req.params.orgId == org.id)
    res.render('organisation-settings/users/new/index', {
      org
    })
  })

  router.post('/organisation-settings/:orgId/users/new', (req, res) => {
    res.redirect(`/organisation-settings/${req.params.orgId}/users/new/permissions/`)
  })

  router.get('/organisation-settings/:orgId/users/new/permissions', (req, res) => {
    let org = req.session.data.user.organisations.find(org => req.params.orgId == org.id)
    let orgPermissions = getOrganisationPermission(org, req.session.data.relationships)

    res.render('organisation-settings/users/new/permissions', {
      org,
      orgPermissions
    })
  })

  router.post('/organisation-settings/:orgId/users/new/permissions', (req, res) => {
    res.redirect(`/organisation-settings/${req.params.orgId}/users/new/check`)
  })

  router.get('/organisation-settings/:orgId/users/new/check', (req, res) => {
    let org = req.session.data.user.organisations.find(org => req.params.orgId == org.id)
    res.render('organisation-settings/users/new/check', {
      org
    })
  })

  router.post('/organisation-settings/:orgId/users/new/check', (req, res) => {

    let data = req.session.data.newuser

    let user = {}
    user.id = uuidv4()
    user.firstName = data['first-name']
    user.lastName = data['last-name']
    user.emailAddress = data['email-address']
    user.organisation = req.session.data.organisations.find(org => org.id == req.params.orgId)

    user.permissions = {}

    if(data.permissions) {
      user.permissions.manageOrganisation = data.permissions.indexOf('manageOrganisation') > -1
      user.permissions.manageUsers = data.permissions.indexOf('manageUsers') > -1
      user.permissions.setupInterviews = data.permissions.indexOf('setupInterviews') > -1
      user.permissions.makeDecisions = data.permissions.indexOf('makeDecisions') > -1
      user.permissions.viewSafeguardingInformation = data.permissions.indexOf('viewSafeguardingInformation') > -1
      user.permissions.viewDiversityInformation= data.permissions.indexOf('viewDiversityInformation') > -1
    }

    req.session.data.users.push(user)

    delete req.session.data.newuser

    req.flash('success', content.createUser.successMessage)
    res.redirect(`/organisation-settings/${req.params.orgId}/users/`)
  })

  // Details

  router.get('/organisation-settings/:orgId/users/:userId', (req, res) => {
    let user = req.session.data.users.find(user => user.id == req.params.userId)
    let org = req.session.data.organisations.find(org => org.id == req.params.orgId)
    res.render('organisation-settings/users/show', { user, org, permissions: getOrganisationPermission(org, req.session.data.relationships) })
  })

  // Edit permissions

  router.get('/organisation-settings/:orgId/users/:userId/permissions/edit/permissions', (req, res) => {
    let user = req.session.data.users.find(user => user.id == req.params.userId)
    let org = req.session.data.organisations.find(org => req.params.orgId == org.id)
    let orgPermissions = getOrganisationPermission(org, req.session.data.relationships)

    let data = req.session.data.editpermissions

    if(!data || !data.permissions) {
      // get from user object
      res.locals.data.editpermissions = { permissions: [] }

      if(user.permissions && user.permissions.manageOrganisation) {
        res.locals.data.editpermissions.permissions.push('manageOrganisation')
      }
      if(user.permissions && user.permissions.manageUsers) {
        res.locals.data.editpermissions.permissions.push('manageUsers')
      }
      if(user.permissions && user.permissions.setupInterviews) {
        res.locals.data.editpermissions.permissions.push('setupInterviews')
      }
      if(user.permissions && user.permissions.makeDecisions) {
        res.locals.data.editpermissions.permissions.push('makeDecisions')
      }
      if(user.permissions && user.permissions.viewSafeguardingInformation) {
        res.locals.data.editpermissions.permissions.push('viewSafeguardingInformation')
      }
      if(user.permissions && user.permissions.viewDiversityInformation) {
        res.locals.data.editpermissions.permissions.push('viewDiversityInformation')
      }
    }

    res.render('organisation-settings/users/edit-permissions/permissions', {
      user,
      org,
      orgPermissions
    })
  })

  router.post('/organisation-settings/:orgId/users/:userId/permissions/edit/permissions', (req, res) => {
    res.redirect(`/organisation-settings/${req.params.orgId}/users/${req.params.userId}/permissions/edit/check`)
  })

  router.get('/organisation-settings/:orgId/users/:userId/permissions/edit/check', (req, res) => {
    let user = req.session.data.users.find(user => user.id == req.params.userId)
    let org = req.session.data.organisations.find(org => req.params.orgId == org.id)
    res.render('organisation-settings/users/edit-permissions/check', {
      user,
      org
    })
  })

  router.post('/organisation-settings/:orgId/users/:userId/permissions/edit/check', (req, res) => {
    var user = req.session.data.users.find(user => user.id == req.params.userId)

    var data = req.session.data.editpermissions

    if(!user.permissions) {
      user.permissions = {}
    }

    if(data.permissions) {
      user.permissions.manageOrganisation = data.permissions.indexOf('manageOrganisation') > -1
      user.permissions.manageUsers = data.permissions.indexOf('manageUsers') > -1
      user.permissions.setupInterviews = data.permissions.indexOf('setupInterviews') > -1
      user.permissions.makeDecisions = data.permissions.indexOf('makeDecisions') > -1
      user.permissions.viewSafeguardingInformation = data.permissions.indexOf('viewSafeguardingInformation') > -1
      user.permissions.viewDiversityInformation= data.permissions.indexOf('viewDiversityInformation') > -1
    } else {
      user.permissions = {}
    }

    data = null

    req.flash('success', 'User permissions updated')
    res.redirect(`/organisation-settings/${req.params.orgId}/users/${req.params.userId}`)
  })

  // Delete user

  router.get('/organisation-settings/:orgId/users/:userId/delete', (req, res) => {
    const user = req.session.data.users.find(user => user.id === req.params.userId)
    const org = req.session.data.organisations.find(org => org.id === req.params.orgId)

    const assignedApplicationCount = ApplicationHelper.getAssignedApplicationCount(
      req.session.data.applications,
      req.params.userId,
      req.params.orgId,
      ['Received','Interviewing','Offered','Conditions pending'],
      true
    )

    res.render('organisation-settings/users/delete', { user, org, assignedApplicationCount })
  })

  router.post('/organisation-settings/:orgId/users/:userId/delete', (req, res) => {

    // delete
    req.session.data.users = req.session.data.users.filter(user => user.id !== req.params.userId)

    // delete all assignments
    req.session.data.applications = ApplicationHelper.deleteAssignedUser(req.session.data.applications, req.params.userId, req.session.data.user)

    // remove user from selected assignedUser filter
    if (req.session.data.assignedUser) {
      req.session.data.assignedUser = req.session.data.assignedUser.filter(item => item !== req.params.userId)
    }

    req.flash('success', content.removeUser.successMessage)
    res.redirect(`/organisation-settings/${req.params.orgId}/users`)
  })

  router.get('/account/personal-details', (req, res) => {
    var user = req.session.data.users[0]

    res.render('account/personal-details', { user })
  })

  router.get('/account/permissions', (req, res) => {
    let user = req.session.data.user

    let orgs = user.organisations.map(org => {
      // add permissions in for each org

      return {
        org: org,
        permissions: getOrganisationPermission(org, req.session.data.relationships)
      }

    })

    res.render('account/permissions', { user, orgs })
  })

}
