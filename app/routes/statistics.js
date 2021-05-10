const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')

const getFilters = (req) => {
  let { cycle, status, studyMode, fundingType, subjectLevel } = req.query

  let filters = {}
  filters.cycles = SystemHelper.getCheckboxValues(cycle, req.session.data.cycle)
  filters.statuses = SystemHelper.getCheckboxValues(status, req.session.data.status)
  filters.studyModes = SystemHelper.getCheckboxValues(studyMode, req.session.data.studyMode)
  filters.fundingTypes = SystemHelper.getCheckboxValues(fundingType, req.session.data.fundingType)
  filters.subjectLevels = SystemHelper.getCheckboxValues(subjectLevel, req.session.data.subjectLevel)

  const hasFilters = !!((filters.cycles && filters.cycles.length > 0) || (filters.statuses && filters.statuses.length > 0) || (filters.studyModes && filters.studyModes.length > 0) || (filters.fundingTypes && filters.fundingTypes.length > 0) || (filters.subjectLevels && filters.subjectLevels.length > 0))

  let selectedFilters = null

  if (hasFilters) {
    selectedFilters = {
      categories: []
    }

    if (filters.cycles && filters.cycles.length) {
      selectedFilters.categories.push({
        heading: { text: 'Year received' },
        items: filters.cycles.map((cycle) => {
          return {
            text: cycle,
            href: `/statistics/remove-cycle-filter/${cycle}`
          }
        })
      })
    }

    if (filters.statuses && filters.statuses.length) {
      selectedFilters.categories.push({
        heading: { text: 'Status' },
        items: filters.statuses.map((status) => {
          return {
            text: status,
            href: `/statistics/remove-status-filter/${status}`
          }
        })
      })
    }

    if (filters.studyModes && filters.studyModes.length) {
      selectedFilters.categories.push({
        heading: { text: 'Full time or part time' },
        items: filters.studyModes.map((studyMode) => {
          return {
            text: studyMode,
            href: `/statistics/remove-studymode-filter/${studyMode}`
          }
        })
      })
    }

    if (filters.fundingTypes && filters.fundingTypes.length) {
      selectedFilters.categories.push({
        heading: { text: 'Funding type' },
        items: filters.fundingTypes.map((fundingType) => {
          return {
            text: fundingType,
            href: `/statistics/remove-fundingtype-filter/${fundingType}`
          }
        })
      })
    }

    if (filters.subjectLevels && filters.subjectLevels.length) {
      selectedFilters.categories.push({
        heading: { text: 'Subject level' },
        items: filters.subjectLevels.map((subjectLevel) => {
          return {
            text: subjectLevel,
            href: `/statistics/remove-subjectlevel-filter/${subjectLevel}`
          }
        })
      })
    }
  }

  return { hasFilters, selectedFilters, filters }
}

const getApplications = (applications, filters) => {
  return applications = applications.filter((app) => {
    let cycleValid = true
    let statusValid = true
    let studyModeValid = true
    let fundingTypeValid = true
    let subjectLevelValid = true

    if (filters.cycles && filters.cycles.length) {
      cycleValid = filters.cycles.includes(app.cycle)
    }

    if (filters.statuses && filters.statuses.length) {
      cycleValid = filters.statuses.includes(app.status)
    }

    if (filters.studyModes && filters.studyModes.length) {
      studyModeValid = filters.studyModes.includes(app.studyMode)
    }

    if (filters.fundingTypes && filters.fundingTypes.length) {
      fundingTypeValid = filters.fundingTypes.includes(app.fundingType)
    }

    if (filters.subjectLevels && filters.subjectLevels.length) {
      subjectLevelValid = filters.subjectLevels.includes(app.subjectLevel)
    }

    return cycleValid && statusValid && studyModeValid && fundingTypeValid && subjectLevelValid
  })
}

const getRedirect = (referer) => {
  let redirect = '/statistics'
  if (referer.includes('/candidates/nationality')) {
    redirect = '/statistics/candidates/nationality'
  } else if (referer.includes('/candidates/residence')) {
    redirect = '/statistics/candidates/residence'
  } else if (referer.includes('/candidates/right-to-work-study')) {
    redirect = '/statistics/candidates/right-to-work-study'
  } else if (referer.includes('/candidates/english-language-qualification')) {
    redirect = '/statistics/candidates/english-language-qualification'
  } else if (referer.includes('/applications/status')) {
    redirect = '/statistics/applications/status'
  } else if (referer.includes('/applications/subject')) {
    redirect = '/statistics/applications/subject'
  } else if (referer.includes('/applications/provider')) {
    redirect = '/statistics/applications/provider'
  } else if (referer.includes('/applications/location')) {
    redirect = '/statistics/applications/location'
  } else if (referer.includes('/applications/reasons-for-rejection')) {
    redirect = '/statistics/applications/reasons-for-rejection'
  }
  return redirect
}

module.exports = router => {

  router.get('/statistics', (req, res) => {
    res.render('statistics/index', {

    })
  })

  router.get('/statistics/applications', (req, res) => {
    res.redirect('/statistics')
  })

  router.get('/statistics/applications/status', (req, res) => {
    let applications = req.session.data.applications

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/applications/statuses', {
      totalApplications: applications.length,
      statuses: SystemHelper.statuses,
      statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      hideStatusFilter: true
    })
  })

  router.get('/statistics/applications/subject', (req, res) => {
    let applications = req.session.data.applications

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/applications/subjects', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubject(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters
    })
  })

  router.get('/statistics/applications/provider', (req, res) => {
    let applications = req.session.data.applications

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/applications/providers', {
      totalApplications: applications.length,
      organisations: SystemHelper.organisations,
      organisationCounts: ApplicationHelper.getApplicationCountsByOrganisation(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters
    })
  })

  router.get('/statistics/applications/location', (req, res) => {
    let applications = req.session.data.applications

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/applications/locations', {
      totalApplications: applications.length,
      locations: SystemHelper.trainingLocations,
      locationCounts: ApplicationHelper.getApplicationCountsByTrainingLocation(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters
    })
  })

  router.get('/statistics/applications/reasons-for-rejection', (req, res) => {
    let applications = req.session.data.applications
    applications = applications.filter(application => application.status === 'Rejected')

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/applications/reasons-for-rejection', {
      totalApplications: applications.length,
      reasons: SystemHelper.reasonsForRejection,
      reasonCounts: ApplicationHelper.getApplicationCountsByReasonsForRejection(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      hideStatusFilter: true
    })
  })

  router.get('/statistics/candidates', (req, res) => {
    res.redirect('/statistics')
  })

  router.get('/statistics/candidates/english-language-qualification', (req, res) => {
    let applications = req.session.data.applications

    res.render('statistics/candidates/english-language-qualification', {
      foreignLanguageCounts: ApplicationHelper.getApplicationCountsByCandidateLanguageAssessment(applications)
    })
  })

  router.get('/statistics/candidates/nationality', (req, res) => {
    let applications = req.session.data.applications

    res.render('statistics/candidates/nationality', {

    })
  })

  router.get('/statistics/candidates/residence', (req, res) => {
    let applications = req.session.data.applications

    res.render('statistics/candidates/residence', {
      residenceCounts: ApplicationHelper.getApplicationCountsByCandidateResidence(applications)
    })
  })

  router.get('/statistics/candidates/right-to-work-study', (req, res) => {
    let applications = req.session.data.applications

    res.render('statistics/candidates/right-to-work-study', {
      rightWorkStudyCounts: ApplicationHelper.getApplicationCountsByCandidateRightToWorkStudy(applications)
    })
  })

  router.get('/statistics/remove-cycle-filter/:cycle', (req, res) => {
    req.session.data.cycle = req.session.data.cycle.filter(item => item !== req.params.cycle)
    res.redirect(getRedirect(req.headers.referer))
  })

  router.get('/statistics/remove-status-filter/:status', (req, res) => {
    req.session.data.status = req.session.data.status.filter(item => item !== req.params.status)
    res.redirect(getRedirect(req.headers.referer))
  })

  router.get('/statistics/remove-studymode-filter/:studyMode', (req, res) => {
    req.session.data.studyMode = req.session.data.studyMode.filter(item => item !== req.params.studyMode)
    res.redirect(getRedirect(req.headers.referer))
  })

  router.get('/statistics/remove-fundingtype-filter/:fundingType', (req, res) => {
    req.session.data.fundingType = req.session.data.fundingType.filter(item => item !== req.params.fundingType)
    res.redirect(getRedirect(req.headers.referer))
  })

  router.get('/statistics/remove-subjectlevel-filter/:subjectLevel', (req, res) => {
    req.session.data.subjectLevel = req.session.data.subjectLevel.filter(item => item !== req.params.subjectLevel)
    res.redirect(getRedirect(req.headers.referer))
  })

  router.get('/statistics/remove-all-filters', (req, res) => {
    req.session.data.cycle = null
    req.session.data.status = null
    req.session.data.studyMode = null
    req.session.data.fundingType = null
    req.session.data.subjectLevel = null
    res.redirect(getRedirect(req.headers.referer))
  })

}
