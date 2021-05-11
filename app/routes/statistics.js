const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')

const getFilters = (req) => {
  let { cycle, status, provider, accreditedBody, studyMode, fundingType, subjectLevel } = req.query

  let filters = {}
  filters.cycles = SystemHelper.getCheckboxValues(cycle, req.session.data.cycle)
  filters.statuses = SystemHelper.getCheckboxValues(status, req.session.data.status)
  filters.studyModes = SystemHelper.getCheckboxValues(studyMode, req.session.data.studyMode)
  filters.fundingTypes = SystemHelper.getCheckboxValues(fundingType, req.session.data.fundingType)
  filters.subjectLevels = SystemHelper.getCheckboxValues(subjectLevel, req.session.data.subjectLevel)
  filters.providers = SystemHelper.getCheckboxValues(provider, req.session.data.provider)
  filters.accreditedBodies = SystemHelper.getCheckboxValues(accreditedBody, req.session.data.accreditedBody)

  const hasFilters = !!((filters.cycles && filters.cycles.length > 0) || (filters.statuses && filters.statuses.length > 0) || (filters.providers && filters.providers.length > 0) || (filters.accreditedBodies && filters.accreditedBodies.length > 0) || (filters.studyModes && filters.studyModes.length > 0) || (filters.fundingTypes && filters.fundingTypes.length > 0) || (filters.subjectLevels && filters.subjectLevels.length > 0))

  let selectedFilters = null

  if (hasFilters) {

    let slug = req.route.path
    if (req.params) {
      slug = `/statistics/${req.params.section}/${req.params.report}`
    }

    selectedFilters = {
      categories: []
    }

    if (filters.cycles && filters.cycles.length) {
      selectedFilters.categories.push({
        heading: { text: 'Year received' },
        items: filters.cycles.map((cycle) => {
          return {
            text: cycle,
            href: `${slug}/remove-cycle-filter/${cycle}`
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
            href: `${slug}/remove-status-filter/${status}`
          }
        })
      })
    }

    if (filters.providers && filters.providers.length) {
      selectedFilters.categories.push({
        heading: { text: 'Training provider' },
        items: filters.providers.map((provider) => {
          return {
            text: provider,
            href: `${slug}/remove-provider-filter/${provider}`
          }
        })
      })
    }

    if (filters.accreditedBodies && filters.accreditedBodies.length) {
      selectedFilters.categories.push({
        heading: { text: 'Accredited body' },
        items: filters.accreditedBodies.map((accreditedbody) => {
          return {
            text: accreditedbody,
            href: `${slug}/remove-accreditedbody-filter/${accreditedbody}`
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
            href: `${slug}/remove-studymode-filter/${studyMode}`
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
            href: `${slug}/remove-fundingtype-filter/${fundingType}`
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
            href: `${slug}/remove-subjectlevel-filter/${subjectLevel}`
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
    let providerValid = true
    let accreditedBodyValid = true
    let studyModeValid = true
    let fundingTypeValid = true
    let subjectLevelValid = true

    if (filters.cycles && filters.cycles.length) {
      cycleValid = filters.cycles.includes(app.cycle)
    }

    if (filters.statuses && filters.statuses.length) {
      cycleValid = filters.statuses.includes(app.status)
    }

    if (filters.providers && filters.providers.length) {
      providerValid = filters.providers.includes(app.provider)
    }

    if (filters.accreditedBodies && filters.accreditedBodies.length) {
      accreditedBodyValid = filters.accreditedBodies.includes(app.accreditedBody)
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

    return cycleValid && statusValid && providerValid && accreditedBodyValid && studyModeValid && fundingTypeValid && subjectLevelValid
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
    let applications = req.session.data.applications
    applications = applications.filter(application => application.cycle === '2020 to 2021')
    res.render('statistics/index', {
      totalApplications: applications.length,
      statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications)
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
      showFilters: [
        'cycle',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
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
      selectedFilters: filters.selectedFilters,
      showFilters: [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
    })
  })

  router.get('/statistics/applications/subjects-by-status', (req, res) => {
    let applications = req.session.data.applications

    // HACK to fix absence of request params needed for filters
    req.params.section = 'applications'
    req.params.report = 'subjects-by-status'

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/applications/subjects-by-status', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      statuses: SystemHelper.statuses,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applications),
      section: req.params.section,
      report: req.params.report,
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters
    })
  })

  router.get('/statistics/:section/:report/configure', (req, res) => {
    // getReportConfigOptions(req.params.section, req.params.report)
    const filters = getFilters(req)
    res.render('statistics/configure', {
      section: req.params.section,
      report: req.params.report,
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      showFilters: [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
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
      selectedFilters: filters.selectedFilters,
      showFilters: [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
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
      selectedFilters: filters.selectedFilters,
      showFilters: [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
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
      showFilters: [
        'cycle',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
    })
  })

  router.get('/statistics/candidates', (req, res) => {
    res.redirect('/statistics')
  })

  router.get('/statistics/candidates/english-language-qualification', (req, res) => {
    let applications = req.session.data.applications

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/candidates/english-language-qualification', {
      foreignLanguageCounts: ApplicationHelper.getApplicationCountsByCandidateLanguageAssessment(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      showFilters: [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
    })
  })

  router.get('/statistics/candidates/nationality', (req, res) => {
    let applications = req.session.data.applications

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/candidates/nationality', {
      nationalityCounts: ApplicationHelper.getApplicationCountsByCandidateNationality(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      showFilters: [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
    })
  })

  router.get('/statistics/candidates/residence', (req, res) => {
    let applications = req.session.data.applications

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/candidates/residence', {
      residenceCounts: ApplicationHelper.getApplicationCountsByCandidateResidence(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      showFilters: [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
    })
  })

  router.get('/statistics/candidates/right-to-work-study', (req, res) => {
    let applications = req.session.data.applications

    const filters = getFilters(req)

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    res.render('statistics/candidates/right-to-work-study', {
      rightWorkStudyCounts: ApplicationHelper.getApplicationCountsByCandidateRightToWorkStudy(applications),
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      showFilters: [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
    })
  })

  router.get('/statistics/:section/:report/remove-cycle-filter/:cycle', (req, res) => {
    req.session.data.cycle = req.session.data.cycle.filter(item => item !== req.params.cycle)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-status-filter/:status', (req, res) => {
    req.session.data.status = req.session.data.status.filter(item => item !== req.params.status)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-provider-filter/:provider', (req, res) => {
    req.session.data.provider = req.session.data.provider.filter(item => item !== req.params.provider)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-accreditedbody-filter/:accreditedBody', (req, res) => {
    req.session.data.accreditedBody = req.session.data.accreditedBody.filter(item => item !== req.params.accreditedBody)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-studymode-filter/:studyMode', (req, res) => {
    req.session.data.studyMode = req.session.data.studyMode.filter(item => item !== req.params.studyMode)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-fundingtype-filter/:fundingType', (req, res) => {
    req.session.data.fundingType = req.session.data.fundingType.filter(item => item !== req.params.fundingType)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-subjectlevel-filter/:subjectLevel', (req, res) => {
    req.session.data.subjectLevel = req.session.data.subjectLevel.filter(item => item !== req.params.subjectLevel)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/remove-all-filters', (req, res) => {
    req.session.data.cycle = null
    req.session.data.status = null
    req.session.data.provider = null
    req.session.data.accreditedBody = null
    req.session.data.studyMode = null
    req.session.data.fundingType = null
    req.session.data.subjectLevel = null
    res.redirect(getRedirect(req.headers.referer))
  })

  router.get('/statistics/:section/:report/remove-all-filters', (req, res) => {
    req.session.data.cycle = null
    req.session.data.status = null
    req.session.data.provider = null
    req.session.data.accreditedBody = null
    req.session.data.studyMode = null
    req.session.data.fundingType = null
    req.session.data.subjectLevel = null
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

}
