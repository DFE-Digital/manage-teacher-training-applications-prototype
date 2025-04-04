const PaginationHelper = require('../data/helpers/pagination')
const ApplicationHelper = require('../data/helpers/application')
const CycleHelper = require('../data/helpers/cycles')

const subjects = require('../data/subjects')
const locations = require('../data/locations')
const { default: request } = require('sync-request')

const getApplicationsByGroup = (applications) => {

  const completedApplications = applications.filter(app => {
      return [ 'Recruited', 'Conditions not met', 'Declined', 'Rejected', 'Application withdrawn', 'Offer withdrawn', 'Deferred' ].includes(app.status)
    })
    .sort(function(a, b) {
      return new Date( a.submittedDate ) - new Date( b.submittedDate )
    })

  const liveApplications = applications.filter((app) => {
      return !([ 'Recruited', 'Conditions not met', 'Declined', 'Rejected', 'Application withdrawn', 'Offer withdrawn', 'Deferred' ].includes(app.status))
    })
    .sort(function(a, b) {
      return new Date( a.submittedDate ) - new Date( b.submittedDate )
    })

  return {
    completedApplications,
    liveApplications
  }
}

const flattenGroup = (grouped) => {
  let array = []
  array = array.concat(grouped.liveApplications)
  array = array.concat(grouped.completedApplications)
  return array
}

const addHeadings = (grouped) => {
  let array = []

  if (grouped.liveApplications.length) {
    array.push({
      heading: 'Open applications'
    })
    array = array.concat(grouped.liveApplications)
  }

  if (grouped.completedApplications.length) {
    array.push({
      heading: 'Closed applications'
    })
    array = array.concat(grouped.completedApplications)
  }

  return array
}

const getSubjectItems = (selectedItems) => {
  const items = []

  subjects.forEach((subject, i) => {
    const item = {}

    item.text = subject.name
    item.value = subject.name
    item.id = subject.code
    item.checked = (selectedItems && selectedItems.includes(subject.name)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

const getStatusCheckboxItems = (selectedItems) => {
  const items = []

  const statuses = ['New', 'In review', 'Shortlisted', 'Interviewing', 'Offered', 'Conditions pending', 'Recruited', 'Deferred', 'Conditions not met', 'Declined', 'Rejected', 'Application withdrawn', 'Offer withdrawn']

  statuses.forEach((status, i) => {
    const item = {}

    item.text = status
    item.value = status
    item.checked = (selectedItems && selectedItems.includes(status)) ? 'checked' : ''

    items.push(item)
  })
  return items
}

const getImportantCheckboxItems = (selectedItems) => {
  const items = []

  const importantItems = ['5 days or fewer to make decision', 'Feedback needed', 'Deferred offers ready to confirm']

  importantItems.forEach((importantItem, i) => {
    const item = {}

    item.text = importantItem
    item.value = importantItem
    item.checked = (selectedItems && selectedItems.includes(importantItem)) ? 'checked' : ''

    items.push(item)
  })
  return items
}

const getNoteCheckboxItems = (selectedItems) => {
  const items = []

  const noteItems = ['Has note', 'Does not have note']

  noteItems.forEach((noteItem, i) => {
    const item = {}

    item.text = noteItem
    item.value = noteItem
    item.checked = (selectedItems && selectedItems.includes(noteItem)) ? 'checked' : ''

    items.push(item)
  })
  return items
}

const getSelectedSubjectItems = (selectedItems) => {
  const items = []

  selectedItems.forEach((item) => {
    const subject = {}
    subject.text = item.text
    subject.href = `/applications/remove-subject-filter/${item.text}`

    items.push(subject)
  })

  return items
}

const getUserItems = (users, assignedUsers = [], you = {}) => {
  let options = []

  // sort the users alphabetically
  users.sort((a, b) => a.firstName.localeCompare(b.firstName)
                        || a.lastName.localeCompare(b.lastName)
                        || a.emailAddress.localeCompare(b.emailAddress))

  users.forEach((user) => {
    const option = {}
    option.id = user.id
    option.value = user.id

    option.text = user.firstName + ' ' + user.lastName
    if (you && you.id === user.id) {
      option.text += ' (you)'
    }

    const hasDuplicateName = users.filter(u => u.firstName === user.firstName && u.lastName === user.lastName).length > 1 ? true : false

    if(hasDuplicateName) {
      option.hint = {}
      option.hint.text = user.emailAddress
      option.hint.classes = 'app-checkboxes__hint'
    }

    option.checked = false
    if (assignedUsers && assignedUsers.includes(user.id)) {
      option.checked = true
    }

    options.push(option)
  })

  if (you && you.id) {
    // get 'you' out of the options
    const youOption = options.find(option => option.value === you.id)

    // remove 'you' from the options
    options = options.filter(option => option.value !== you.id)

    // put 'you' as the first person in the list of options
    options.splice(0, 0, youOption)
  }

  // Add an 'unassigned' option as the first item in the array of options
  const unassigned = {}
  unassigned.id = 'unassigned'
  unassigned.value = 'unassigned'
  unassigned.text = 'Unassigned'
  unassigned.checked = false
  if (assignedUsers && assignedUsers.includes('unassigned')) {
    unassigned.checked = true
  }
  options.splice(0, 0, unassigned)

  return options
}

const getSelectedUserItems = (selectedItems) => {
  const items = []

  selectedItems.forEach((item) => {
    const user = {}
    user.text = item.text
    user.href = `/applications/remove-assignedUser-filter/${item.value}`

    items.push(user)
  })

  return items
}

const getUserFullName = (users, assignedUserId) => {
  let name = ''

  if (assignedUserId === 'unassigned') {
    name = 'Unassigned'
  } else {
    const assignedUser = users.find(user => user.id === assignedUserId)
    name = assignedUser.firstName + ' ' + assignedUser.lastName
  }

  return name
}

const getTrainingProviderItems = (providers, selectedProviders) => {
  return providers
    .sort((a,b) => {
      return a.name.localeCompare(b.name)
    })
    .map(org => {
      return {
        value: org.name,
        text: org.name,
        checked: selectedProviders && selectedProviders.includes(org.name) ? 'checked' : ''
      }
    })
}

const getAccreditedBodyItems = (accreditedBodies, selectedAccreditedBodies) => {
  return accreditedBodies
    .sort((a,b) => {
      return a.name.localeCompare(b.name)
    })
    .map(org => {
      return {
        value: org.name,
        text: org.name,
        checked: selectedAccreditedBodies && selectedAccreditedBodies.includes(org.name) ? 'checked' : ''
      }
    })
}

const getLocationItems = (selectedItems) => {
  const items = []

  locations.forEach((location, i) => {
    const item = {}

    item.text = location.name
    item.value = location.name
    item.id = location.code
    item.checked = (selectedItems && selectedItems.includes(location.name)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

const sortApplications = (applications, sort) => {
  let newApplications = []

  if(sort == 'Updated most recently') {
    newApplications = applications.sort((a, b) => {
      let aEvents = a.events.items
      let bEvents = b.events.items
      return new Date(bEvents[bEvents.length-1].date) - new Date(aEvents[aEvents.length-1].date)
    })
  } else if(sort == 'Updated least recently') {
    newApplications = applications.sort((a, b) => {
      let aEvents = a.events.items
      let bEvents = b.events.items
      return new Date(aEvents[aEvents.length-1].date) - new Date(bEvents[bEvents.length-1].date)
    })
  } else {
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Received').sort(function(a, b) {
      return a.daysToRespond - b.daysToRespond
    }))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Interviewing').sort(function(a, b) {
      return a.daysToRespond - b.daysToRespond
    }))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Offered').sort((a, b) => {
      return a.daysToDecline - b.daysToDecline
    }))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Conditions pending'))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Recruited'))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Deferred'))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Declined'))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Rejected'))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Application withdrawn'))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Offer withdrawn'))
    newApplications = newApplications.concat(applications.filter((app) => app.status == 'Conditions not met'))
  }
  return newApplications

}

const getCheckboxValues = (name, data) => {

  return name && ((Array.isArray(name) ? name : [name]).filter((name) => {
    return name !== '_unchecked'
  })) || data && (Array.isArray(data) ? data : [data])
}

const removeFilter = (value, data) => {
  // do this check because if coming from overview page for example,
  // the query/param will be a string value, not an array containing a string
  if(Array.isArray(data)) {
    return data.filter(item => item !== value)
  } else {
    return null
  }
}

module.exports = router => {

  router.all('/applications', (req, res) => {

    var sort = req.session.data.sort = req.query.sort || req.session.data.sort
    var statusTab = req.session.data.statusTab || 'action'
    var statuses

    if ( ( req.query.status && req.query.status != '_unchecked' ) || ( req.query.keywords || req.session.data.keywords ) ) {
      statusTab = 'all'
    }

    if ( statusTab == 'action' || statusTab == 'Received' ) {
      statuses = [ 'New', 'In review', 'Shortlisted' ]
    } else if ( statusTab == 'In progress' ) {
      statuses = [ 'Interviewing', 'Offered', 'Conditions pending' ]
    } else if ( statusTab == 'Complete' ) {
      statuses = [ 'Recruited', 'Conditions not met', 'Declined', 'Rejected', 'Application withdrawn', 'Offer withdrawn', 'Deferred' ]
    } else if ( statusTab == 'Unsuccessful' ) {
      statuses = [ 'Conditions not met', 'Declined', 'Rejected', 'Application withdrawn', 'Offer withdrawn' ]
    } else if ( statusTab == 'all' ) {
      statuses = null
    } else {
      statuses = [ statusTab ]
    }


    var filters = [
      'cycle',
      'status',
      'provider',
      'accreditedBody',
      'keywords',
      'location',
      'studyMode',
      'subject',
      'assignedUser',
      'importantItem',
      'note'
    ]

    if(req.query.referrer === 'overview') {
      filters.forEach(filter => {
        if(req.query[filter]) {
          req.session.data[filter] = req.query[filter]
        } else {
          req.session.data[filter] = null
        }
        req.query[filter] = null
      })
    }

    let apps = req.session.data.applications.map(app => app)

    let appsNewCount
    let appsReviewCount
    let appsShortlistedCount
    let appsInterviewingCount
    let appsOfferedCount
    let appsConditionsCount
    let appsRecruitedCount
    let appsUnsuccessfulCount
    let appsDeferredCount

    // for use in the filters
    const users = req.session.data.users.filter(user => {
      return user.organisation.id == req.session.data.user.organisation.id
    })

    let { cycle, status, provider, accreditedBody, keywords, location, studyMode, subject, assignedUser, importantItem, noteItem } = req.query

    keywords = keywords || req.session.data.keywords

    const cycles = getCheckboxValues(cycle, req.session.data.cycle)

     if (!statusTab || statusTab == 'all' ) {
      statuses = getCheckboxValues(status, req.session.data.status)
     } else {
      req.session.data.status = null
     }

    const providers = getCheckboxValues(provider, req.session.data.provider)
    const locations = getCheckboxValues(location, req.session.data.location)
    const accreditedBodies = getCheckboxValues(accreditedBody, req.session.data.accreditedBody)
    const studyModes = getCheckboxValues(studyMode, req.session.data.studyMode)
    const subjects = getCheckboxValues(subject, req.session.data.subject)
    const assignedUsers = getCheckboxValues(assignedUser, req.session.data.assignedUser)
    const importantItems = getCheckboxValues(importantItem, req.session.data.importantItem)
    const noteItems = getCheckboxValues(noteItem, req.session.data.noteItem)

    const hasSearch = !!((keywords))

    const hasFilters = !!((cycles && cycles.length > 0) || (statuses && statuses.length > 0) || (locations && locations.length > 0) || (providers && providers.length > 0) || (accreditedBodies && accreditedBodies.length > 0) || (studyModes && studyModes.length > 0) || (subjects && subjects.length > 0) || (assignedUsers && assignedUsers.length > 0) || (importantItems && importantItems.length > 0) || (noteItems && noteItems.length > 0))

    if (hasSearch) {
      apps = apps.filter((app) => {

        let candidateNameValid = true
        let applicationReferenceValid = true
        let matchesNoteValid = true

        const candidateName = `${app.personalDetails.givenName} ${app.personalDetails.familyName}`
        const applicationReference = '' + app.id

        if (keywords) {
          candidateNameValid = candidateName.toLowerCase().includes(keywords.toLowerCase())
          applicationReferenceValid = applicationReference.includes(keywords.toLowerCase())
          matchesNoteValid = app.notes.items.length && app.notes.items[0].message.toLowerCase().includes(keywords.toLowerCase())
        }

        return candidateNameValid || applicationReferenceValid || matchesNoteValid
      })
    }

    if (hasFilters) {
      apps = apps.filter((app) => {
        let cycleValid = true
        let providerValid = true
        let locationValid = true
        let accreditedBodyValid = true
        let studyModeValid = true
        let subjectValid = true
        let assignedUserValid = true
        let unassignedUserValid = true
        let importantItemValid = true
        let noteItemValid = true
        let ageValid = true

        const appAge =  Math.round( ( new Date().getTime() - new Date( app.submittedDate ).getTime() ) / (24 * 60 * 60 * 1000) );

        if ( statusTab == 'action' ) {
          const appAge =  Math.round( ( new Date().getTime() - new Date( app.submittedDate ).getTime() ) / (24 * 60 * 60 * 1000) );
          ageValid = appAge >= 30
        }

        if (cycles && cycles.length) {
          cycleValid = cycles.includes(app.cycle)
        }

        if (locations && locations.length) {
          locationValid = locations.includes(app.location.name)
        }

        if (providers && providers.length) {
          providerValid = providers.includes(app.provider)
        }

        if (accreditedBodies && accreditedBodies.length) {
          accreditedBodyValid = accreditedBodies.includes(app.accreditedBody)
        }

        if (assignedUsers && assignedUsers.length) {
          const appAssignedUserIds = app.assignedUsers.map((user) => {
            return user.id
          })

          // [1] the user selected unassigned from the filter and the application
          // has no assigned users
          if (assignedUsers.includes('unassigned') && appAssignedUserIds.length == 0) {
            unassignedUserValid = (appAssignedUserIds.length == 0)
          }
          // [2] the user selected some assigned users from the filter and the
          // application has that person in their assigned list
          else {
            for (let i = 0; i < assignedUsers.length; i++) {
              assignedUserValid = appAssignedUserIds.includes(assignedUsers[i])
              if (assignedUserValid) {
                break
              }
            }
          }
        }

        if (subjects && subjects.length) {
          const appSubjects = app.subject.map(subject => { return subject.name })

          for (let i = 0; i < subjects.length; i++) {
            subjectValid = appSubjects.includes(subjects[i])
            if (subjectValid) {
              break
            }
          }
        }

        if (studyModes && studyModes.length) {
          studyModeValid = studyModes.includes(app.studyMode)
        }

        if (importantItems && importantItems.length) {
          importantItemValid = false

          if(importantItems.includes('5 days or fewer to make decision')) {
            if((app.status == 'Received' || app.status == 'New' || app.status == 'In review' || app.status == 'Shortlisted' || app.status == 'Interviewing') && app.daysToRespond < 5) {
              importantItemValid = true
            }
          }

          if(importantItems.includes('Feedback needed')) {
            if(app.status == 'Rejected' && !app.rejectedReasons) {
              importantItemValid = true
            }
          }

          if(importantItems.includes('Deferred offers ready to confirm')) {
            if(app.status == 'Deferred' && req.session.data.settings == 'new-cycle') {
              importantItemValid = true
            }
          }
        }

        if (noteItems && noteItems.length) {
          noteItemValid = false

          if(noteItems.includes('Has note') && app.notes.items.length) {
            noteItemValid = true
          }

          if(noteItems.includes('Does not have note') && app.notes.items.length == 0) {
            noteItemValid = true
          }
        }

        return cycleValid
          && locationValid
          && providerValid
          && accreditedBodyValid
          && studyModeValid
          && subjectValid
          && assignedUserValid
          && unassignedUserValid
          && importantItemValid
          && noteItemValid
          && ageValid
      })

      if ( statusTab == 'New' || statusTab == 'In review' || statusTab == 'Shortlisted' || statusTab == 'Received' ) {
        let appsNew = apps.filter((app) => {
          return app.status == 'New'
        })
        appsNewCount = appsNew.length

        let appsReview = apps.filter((app) => {
          return app.status == 'In review'
        })
        appsReviewCount = appsReview.length

        let appsShortlisted = apps.filter((app) => {
          return app.status == 'Shortlisted'
        })
        appsShortlistedCount = appsShortlisted.length

      }

      if ( statusTab == 'In progress' || statusTab == 'Interviewing' || statusTab == 'Offered' || statusTab == 'Conditions pending' ) {
        let appsInterviewing = apps.filter((app) => {
          return app.status == 'Interviewing'
        })
        appsInterviewingCount = appsInterviewing.length

        let appsOffered = apps.filter((app) => {
          return app.status == 'Offered'
        })
        appsOfferedCount = appsOffered.length

        let appsConditions = apps.filter((app) => {
          return app.status == 'Conditions pending'
        })
        appsConditionsCount = appsConditions.length

      }


      if ( statusTab == 'Complete' || statusTab == 'Recruited' || statusTab == 'Unsuccessful' || statusTab == 'Deferred' ) {
        let appsRecruited = apps.filter((app) => {
          return app.status == 'Recruited'
        })
        appsRecruitedCount = appsRecruited.length

        let appsUnsuccessful = apps.filter((app) => {
          return [ 'Conditions not met', 'Declined', 'Rejected', 'Application withdrawn', 'Offer withdrawn' ].includes(app.status)
        })
        appsUnsuccessfulCount = appsUnsuccessful.length

        let appsDeferred = apps.filter((app) => {
          return app.status == 'Deferred'
        })
        appsDeferredCount = appsDeferred.length

      }

      apps = apps.filter((app) => {
        let statusValid = true
        if (statuses && statuses.length) {
          statusValid = statuses.includes(app.status)
        }
        return statusValid
      })

    }

    let selectedFilters = null
    if (hasFilters) {
      selectedFilters = {
        categories: []
      }

      if (cycles && cycles.length) {
        selectedFilters.categories.push({
          heading: { text: 'Recruitment cycle' },
          items: cycles.map((cycle) => {
            return {
              text: CycleHelper.getCycleLabel(cycle),
              href: `/applications/remove-cycle-filter/${cycle}`
            }
          })
        })
      }

      if (importantItems && importantItems.length) {
        selectedFilters.categories.push({
          heading: { text: 'Important' },
          items: importantItems.map((importantItem) => {
            return {
              text: importantItem,
              href: `/applications/remove-importantItem-filter/${importantItem}`
            }
          })
        })
      }

      if (statuses && statuses.length && ( !statusTab || statusTab == 'all' ) ) {
        selectedFilters.categories.push({
          heading: { text: 'Statuses' },
          items: statuses.map((status) => {
            return {
              text: status,
              href: `/applications/remove-status-filter/${status}`
            }
          })
        })
      }

      if (locations && locations.length) {
        selectedFilters.categories.push({
          // TODO: check this works for multi-organisation user relationships
          heading: { text: 'Training locations for ' + req.session.data.trainingProviders[0].name },
          items: locations.map((location) => {
            return {
              text: location,
              href: `/applications/remove-location-filter/${location}`
            }
          })
        })
      }

      if (providers && providers.length) {
        selectedFilters.categories.push({
          heading: { text: 'Training provider' },
          items: providers.map((provider) => {
            return {
              text: provider,
              href: `/applications/remove-provider-filter/${provider}`
            }
          })
        })
      }

      if (accreditedBodies && accreditedBodies.length) {
        selectedFilters.categories.push({
          heading: { text: 'Accredited body' },
          items: accreditedBodies.map((accreditedBody) => {
            return {
              text: accreditedBody,
              href: `/applications/remove-accreditedBody-filter/${accreditedBody}`
            }
          })
        })
      }

      if (assignedUsers && assignedUsers.length) {
        selectedFilters.categories.push({
          heading: { text: 'Assigned user' },
          items: assignedUsers.map((assignedUser) => {
            return {
              text: getUserFullName(users, assignedUser),
              href: `/applications/remove-assignedUser-filter/${assignedUser}`
            }
          })
        })
      }

      if (subjects && subjects.length) {
        selectedFilters.categories.push({
          heading: { text: 'Subjects' },
          items: subjects.map((subject) => {
            return {
              text: subject,
              href: `/applications/remove-subject-filter/${subject}`
            }
          })
        })
      }

      if (studyModes && studyModes.length) {
        selectedFilters.categories.push({
          heading: { text: 'Full time or part time' },
          items: studyModes.map((studyMode) => {
            return {
              text: studyMode,
              href: `/applications/remove-studyMode-filter/${studyMode}`
            }
          })
        })
      }

      if (noteItems && noteItems.length) {
        selectedFilters.categories.push({
          heading: { text: 'Notes' },
          items: noteItems.map((noteItem) => {
            return {
              text: noteItem,
              href: `/applications/remove-noteItem-filter/${noteItem}`
            }
          })
        })
      }

    } else if ( statusTab != 'all' ) {
      delete req.session.data.statusTab
    }

    // TODO: clean up
    let applications = apps;

    let allApplications = applications;

    // Whack all the grouped items into an array without headings
    let grouped = getApplicationsByGroup(applications)

    // Put groups into ordered array
    applications = flattenGroup(grouped)

    // Get the pagination data
    let pagination = PaginationHelper.getPagination(applications, req.query.page)

    // Get a slice of the data to display
    applications = PaginationHelper.getDataByPage(applications, pagination.pageNumber)

    const cycleItems = CycleHelper.getCycleOptions(req.session.data.cycle)

    const subjectItems = getSubjectItems(req.session.data.subject)
    const selectedSubjects = getSelectedSubjectItems(subjectItems.filter(subject => subject.checked === 'checked'))

    const userItems = getUserItems(users, req.session.data.assignedUser, req.session.data.user)
    const selectedUsers = getSelectedUserItems(userItems.filter(user => user.checked === true))

    // now mixin the headings

    if ( statusTab == 'all' ) {
      applications = addHeadings(grouped)
    }

    const trainingProviderItems = getTrainingProviderItems(req.session.data.trainingProviders, req.session.data.provider)
    const accreditedBodyItems = getAccreditedBodyItems(req.session.data.accreditedBodies, req.session.data.accreditedBody)
    const locationItems = getLocationItems(req.session.data.location)
    const statusCheckboxItems = getStatusCheckboxItems(req.session.data.status)
    const importantCheckboxItems = getImportantCheckboxItems(req.session.data.importantItem)
    const noteCheckboxItems = getNoteCheckboxItems(req.session.data.noteItem)

    res.render('applications/index', {
      allApplications,
      applications,
      pagination,
      selectedFilters,
      hasFilters,
      hasSearch,
      subjectItems,
      trainingProviderItems,
      accreditedBodyItems,
      locationItems,
      subjectItemsDisplayLimit: 15,
      selectedSubjects,
      userItems,
      userItemsDisplayLimit: 15,
      selectedUsers,
      cycleItems,
      statusCheckboxItems,
      importantCheckboxItems,
      noteCheckboxItems,
      appsNewCount,
      appsReviewCount,
      appsShortlistedCount,
      appsInterviewingCount,
      appsOfferedCount,
      appsConditionsCount,
      appsShortlistedCount,
      appsRecruitedCount,
      appsUnsuccessfulCount,
      appsDeferredCount,
      statusTab
    })
  })

  router.get('/applications/remove-keywords-search', (req, res) => {
    req.session.data.keywords = ''
    res.redirect('/applications')
  })

  router.get('/applications/remove-cycle-filter/:cycle', (req, res) => {
    req.session.data.cycle = removeFilter(req.params.cycle, req.session.data.cycle)
    res.redirect('/applications')
  })

  router.get('/applications/remove-status-filter/:status', (req, res) => {
    req.session.data.status = removeFilter(req.params.status, req.session.data.status)
    res.redirect('/applications')
  })

  router.get('/applications/remove-provider-filter/:provider', (req, res) => {
    req.session.data.provider = removeFilter(req.params.provider, req.session.data.provider)
    res.redirect('/applications')
  })

  router.get('/applications/remove-location-filter/:location', (req, res) => {
    req.session.data.location = removeFilter(req.params.location, req.session.data.location)
    res.redirect('/applications')
  })

  router.get('/applications/remove-accreditedBody-filter/:accreditedBody', (req, res) => {
    req.session.data.accreditedBody = removeFilter(req.params.accreditedBody, req.session.data.accreditedBody)
    res.redirect('/applications')
  })

  router.get('/applications/remove-subject-filter/:subject', (req, res) => {
    req.session.data.subject = removeFilter(req.params.subject, req.session.data.subject)
    res.redirect('/applications')
  })

  router.get('/applications/remove-studyMode-filter/:studyMode', (req, res) => {
    req.session.data.studyMode = removeFilter(req.params.studyMode, req.session.data.studyMode)
    res.redirect('/applications')
  })

  router.get('/applications/remove-assignedUser-filter/:assignedUser', (req, res) => {
    req.session.data.assignedUser = removeFilter(req.params.assignedUser, req.session.data.assignedUser)
    res.redirect('/applications')
  })

  router.get('/applications/remove-importantItem-filter/:importantItem', (req, res) => {
    req.session.data.importantItem = removeFilter(req.params.importantItem, req.session.data.importantItem)
    res.redirect('/applications')
  })

  router.get('/applications/remove-noteItem-filter/:noteItem', (req, res) => {
    req.session.data.noteItem = removeFilter(req.params.noteItem, req.session.data.noteItem)
    res.redirect('/applications')
  })

  router.get('/applications/remove-all-filters', (req, res) => {
    req.session.data.cycle = null
    req.session.data.importantItem = null
    req.session.data.noteItem = null
    req.session.data.status = null
    req.session.data.provider = null
    req.session.data.accreditedBody = null
    req.session.data.location = null
    req.session.data.subject = null
    req.session.data.studyMode = null
    req.session.data.assignedUser = null
    res.redirect('/applications')
  })

}
