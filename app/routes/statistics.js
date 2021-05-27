const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')

const getConfigOptions = (req) => {
  if (req.session.data.statisticsOptions === undefined) {
    req.session.data.statisticsOptions = {}
  }

  let options = {}
  options.cycles = req.session.data.statisticsOptions.cycle
  options.statuses = req.session.data.statisticsOptions.status
  options.studyModes = req.session.data.statisticsOptions.studyMode
  options.fundingTypes = req.session.data.statisticsOptions.fundingType
  options.subjectLevels = req.session.data.statisticsOptions.subjectLevel
  options.providers = req.session.data.statisticsOptions.provider
  options.accreditedBodies = req.session.data.statisticsOptions.accreditedBody
  options.locations = req.session.data.statisticsOptions.location

  const hasOptions = !!((options.cycles && options.cycles.length > 0) || (options.statuses && options.statuses.length > 0) || (options.providers && options.providers.length > 0) || (options.accreditedBodies && options.accreditedBodies.length > 0) || (options.studyModes && options.studyModes.length > 0) || (options.fundingTypes && options.fundingTypes.length > 0) || (options.subjectLevels && options.subjectLevels.length > 0) || (options.locations && options.locations.length > 0))

  let selectedOptions = null

  if (hasOptions) {

    let slug = req.route.path
    if (req.params.section && req.params.report) {
      slug = `/statistics/${req.params.section}/${req.params.report}`
    }

    selectedOptions = {
      categories: []
    }

    if (options.cycles && options.cycles.length) {
      selectedOptions.categories.push({
        heading: { text: 'Year received' },
        items: options.cycles.map((cycle) => {
          return {
            text: cycle,
            href: `${slug}/remove-cycle-option/${cycle}`
          }
        })
      })
    }

    if (options.statuses && options.statuses.length) {
      selectedOptions.categories.push({
        heading: { text: 'Status' },
        items: options.statuses.map((status) => {
          return {
            text: status,
            href: `${slug}/remove-status-option/${status}`
          }
        })
      })
    }

    if (options.providers && options.providers.length) {
      selectedOptions.categories.push({
        heading: { text: 'Training provider' },
        items: options.providers.map((provider) => {
          return {
            text: provider,
            href: `${slug}/remove-provider-option/${provider}`
          }
        })
      })
    }

    if (options.locations && options.locations.length) {
      selectedOptions.categories.push({
        heading: { text: 'Location' },
        items: options.locations.map((location) => {
          return {
            text: location,
            href: `${slug}/remove-location-option/${location}`
          }
        })
      })
    }

    if (options.accreditedBodies && options.accreditedBodies.length) {
      selectedOptions.categories.push({
        heading: { text: 'Accredited body' },
        items: options.accreditedBodies.map((accreditedbody) => {
          return {
            text: accreditedbody,
            href: `${slug}/remove-accreditedbody-option/${accreditedbody}`
          }
        })
      })
    }

    if (options.studyModes && options.studyModes.length) {
      selectedOptions.categories.push({
        heading: { text: 'Full time or part time' },
        items: options.studyModes.map((studyMode) => {
          return {
            text: studyMode,
            href: `${slug}/remove-studymode-option/${studyMode}`
          }
        })
      })
    }

    if (options.fundingTypes && options.fundingTypes.length) {
      selectedOptions.categories.push({
        heading: { text: 'Funding type' },
        items: options.fundingTypes.map((fundingType) => {
          return {
            text: fundingType,
            href: `${slug}/remove-fundingtype-option/${fundingType}`
          }
        })
      })
    }

    if (options.subjectLevels && options.subjectLevels.length) {
      selectedOptions.categories.push({
        heading: { text: 'Subject level' },
        items: options.subjectLevels.map((subjectLevel) => {
          return {
            text: subjectLevel,
            href: `${slug}/remove-subjectlevel-option/${subjectLevel}`
          }
        })
      })
    }
  }

  return { hasOptions, selectedOptions, options }
}

const getFilters = (req) => {
  if (req.session.data.statisticsFilters === undefined) {
    req.session.data.statisticsFilters = {}
  }

  let filters = {}
  filters.cycles = req.session.data.statisticsFilters.cycle
  filters.statuses = req.session.data.statisticsFilters.status
  filters.studyModes = req.session.data.statisticsFilters.studyMode
  filters.fundingTypes = req.session.data.statisticsFilters.fundingType
  filters.subjectLevels = req.session.data.statisticsFilters.subjectLevel
  filters.providers = req.session.data.statisticsFilters.provider
  filters.accreditedBodies = req.session.data.statisticsFilters.accreditedBody
  filters.locations = req.session.data.statisticsFilters.location

  const hasFilters = !!((filters.cycles && filters.cycles.length > 0) || (filters.statuses && filters.statuses.length > 0) || (filters.providers && filters.providers.length > 0) || (filters.accreditedBodies && filters.accreditedBodies.length > 0) || (filters.studyModes && filters.studyModes.length > 0) || (filters.fundingTypes && filters.fundingTypes.length > 0) || (filters.subjectLevels && filters.subjectLevels.length > 0) || (filters.locations && filters.locations.length > 0))

  let selectedFilters = null

  if (hasFilters) {

    let slug = req.route.path
    if (req.params.section && req.params.report) {
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

    if (filters.locations && filters.locations.length) {
      selectedFilters.categories.push({
        heading: { text: 'Location' },
        items: filters.locations.map((location) => {
          return {
            text: location,
            href: `${slug}/remove-location-filter/${location}`
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

const getApplications = (applications, options) => {
  return applications = applications.filter((app) => {
    let cycleValid = true
    let statusValid = true
    let providerValid = true
    let accreditedBodyValid = true
    let studyModeValid = true
    let fundingTypeValid = true
    let subjectLevelValid = true
    let locationValid = true

    if (options.cycles && options.cycles.length) {
      cycleValid = options.cycles.includes(app.cycle)
    }

    if (options.statuses && options.statuses.length) {
      cycleValid = options.statuses.includes(app.status)
    }

    if (options.providers && options.providers.length) {
      providerValid = options.providers.includes(app.provider)
    }

    if (options.accreditedBodies && options.accreditedBodies.length) {
      accreditedBodyValid = options.accreditedBodies.includes(app.accreditedBody)
    }

    if (options.studyModes && options.studyModes.length) {
      studyModeValid = options.studyModes.includes(app.studyMode)
    }

    if (options.fundingTypes && options.fundingTypes.length) {
      fundingTypeValid = options.fundingTypes.includes(app.fundingType)
    }

    if (options.subjectLevels && options.subjectLevels.length) {
      subjectLevelValid = options.subjectLevels.includes(app.subjectLevel)
    }

    if (options.locations && options.locations.length) {
      locationValid = options.locations.includes(app.location)
    }

    return cycleValid && statusValid && providerValid && accreditedBodyValid && studyModeValid && fundingTypeValid && subjectLevelValid && locationValid
  })
}

const getReportConfigOptions = (report) => {
  if (!report.length) {
    return null
  }

  let options = []

  switch (report) {
    case 'courses-by-year':
      options = [
        'status',
        'trainingProvider',
        'accreditedBody',
        'subjectLevel'
      ]
      break
    case 'courses-by-status':
      options = [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'subjectLevel'
      ]
      break
    case 'courses-by-training-provider':
      options = [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'subjectLevel'
      ]
      break
    case 'courses-by-location':
      options = [
        'cycle',
        'status',
        'location',
        'subject',
        'subjectLevel'
      ]
      break
    case 'courses-by-reasons-for-rejection':
      options = [
        'cycle',
        'subject',
        'subjectLevel'
      ]
      break
    case 'course-performance':
      options = [
        'cycle',
        'location',
        'subject',
        'subjectLevel'
      ]
      break
    case 'course-diversity-ethnicity':
    case 'course-diversity-nationality':
    case 'course-diversity-sex':
      options = [
        'cycle',
        'subjectLevel'
      ]
      break
  }

  return options
}

const getReportName = (report) => {
  if (!report.length) {
    return null
  }

  let name = ''

  switch (report) {
    case 'courses-by-year':
      name = 'Courses by year'
      break
    case 'courses-by-status':
      name = 'Courses by status'
      break
    case 'courses-by-training-provider':
      name = 'Courses by training provider'
      break
    case 'courses-by-location':
      name = 'Courses by location'
      break
    case 'courses-by-reasons-for-rejection':
      name = 'Courses by reasons for rejection'
      break
    case 'course-performance':
      name = 'Course performance'
      break
    case 'course-diversity-ethnicity':
      name = 'Course diversity - ethnicity'
      break
    case 'course-diversity-nationality':
      name = 'Course diversity - nationality'
      break
    case 'course-diversity-sex':
      name = 'Course diversity - sex'
      break
    default:
      name = report
      break
  }

  return name
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
  // } else if (referer.includes('/applications/status')) {
  //   redirect = '/statistics/applications/status'
  // } else if (referer.includes('/applications/subject')) {
  //   redirect = '/statistics/applications/subject'
  // } else if (referer.includes('/applications/provider')) {
  //   redirect = '/statistics/applications/provider'
  // } else if (referer.includes('/applications/location')) {
  //   redirect = '/statistics/applications/location'
  // } else if (referer.includes('/applications/reasons-for-rejection')) {
  //   redirect = '/statistics/applications/reasons-for-rejection'
  }
  return redirect
}

module.exports = router => {

  router.get('/statistics', (req, res) => {
    delete req.session.data.statisticsOptions
    delete req.session.data.statisticsFilters

    let applications = req.session.data.applications
    let current = applications.filter(application => application.cycle === '2020 to 2021')

    let previous = applications.filter(application => application.cycle === '2019 to 2020')

    res.render('statistics/index', {
      counts: {
        current: {
          total: current.length,
          interviewing: current.filter(c => c.status === 'Awaiting decision').length,
          offered: current.filter(c => c.status === 'Offered').length,
          awaitingConditions: current.filter(c => c.status === 'Awaiting conditions').length,
          readyToEnroll: current.filter(c => c.status === 'Ready to enroll').length
        },
        previous: {
          total: previous.length,
          interviewing: 22,
          offered: 16,
          awaitingConditions: 7,
          readyToEnroll: 10
        }
      }
    })
  })

  router.get('/statistics/applications', (req, res) => {
    res.redirect('/statistics')
  })

  // ===========================================================================
  // Version 3
  // ===========================================================================

  router.get('/statistics/applications/courses', (req, res) => {
    let applications = req.session.data.applications
    const options = req.session.data.statisticsOptions
    const filters = getFilters(req)

    // if the user hasn't configured the report to include cycle data,
    // we just want the current cycle's data
    if (!options || !((options.dimension2 === 'cycle') || (options.dimension3 === 'cycle'))) {
      applications = applications.filter(application => application.cycle === '2020 to 2021')
    }

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    const showFilters = []
    if (options) {
      // parse the dimensions so we know what filters to show
      for (const [key, value] of Object.entries(options)) {
        showFilters.push(value)
      }
    }

    let counts = ApplicationHelper.getApplicationCountsBySubject(applications)
    const dimension1 = ApplicationHelper.getDimensionData('subject').data
    let dimension2 = []
    let dimension3 = []

    if (options) {
      counts = ApplicationHelper.getApplicationCounts(applications, options)
      dimension2 = ApplicationHelper.getDimensionData(options.dimension2).data
      dimension3 = ApplicationHelper.getDimensionData(options.dimension3).data
    }

    // Dimension 2 and 4 are optional

    // | =============== | Dimension 3               | Dimension 3               |
    // | =============== | Dimension 4 | Dimension 4 | Dimension 4 | Dimension 4 |
    // | Dimension 1     | =========== | =========== | =========== | =========== |
    // |  -- Dimension 2 | =========== | =========== | =========== | =========== |
    // |  -- Dimension 2 | =========== | =========== | =========== | =========== |
    // |  -- Dimension 2 | =========== | =========== | =========== | =========== |
    // | Dimension 1     | =========== | =========== | =========== | =========== |
    // |  -- Dimension 2 | =========== | =========== | =========== | =========== |
    // |  -- Dimension 2 | =========== | =========== | =========== | =========== |
    // |  -- Dimension 2 | =========== | =========== | =========== | =========== |

    res.render('statistics/applications/courses', {
      section: 'applications',
      report: 'courses',
      totalApplications: applications.length,
      options,
      dimension1,
      dimension2,
      dimension3,
      counts,
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      showFilters
    })
  })

  // router.get('/statistics/:section/:report/settings', (req, res) => {
  //   res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  // })

  router.get('/statistics/:section/:report/settings/rows', (req, res) => {
    res.render('statistics/settings/rows', {
      section: req.params.section,
      report: req.params.report,
      reportName: getReportName(req.params.report)
    })
  })

  router.get('/statistics/:section/:report/settings/columns', (req, res) => {
    res.render('statistics/settings/columns', {
      section: req.params.section,
      report: req.params.report,
      reportName: getReportName(req.params.report)
    })
  })

  // ===========================================================================
  // Version 3.1
  // ===========================================================================

  router.get('/statistics/applications/courses2', (req, res) => {
    let applications = req.session.data.applications
    const options = req.session.data.statisticsOptions
    // const options = { dimension1: 'subject', dimension2: 'location', dimension3: 'cycle', dimension4: 'status' } //
    const filters = getFilters(req)

    // if the user hasn't configured the report to include cycle data,
    // we just want the current cycle's data
    if (!options || !((options.dimension2 === 'cycle') || (options.dimension3 === 'cycle') || (options.dimension4 === 'cycle'))) {
      applications = applications.filter(application => application.cycle === '2020 to 2021')
    }

    if (filters.hasFilters) {
      applications = getApplications(applications, filters.filters)
    }

    const showFilters = []
    if (options) {
      // parse the dimensions so we know what filters to show
      for (const [key, value] of Object.entries(options)) {
        showFilters.push(value)
      }
    }

    // get the default counts for the report
    let counts = ApplicationHelper.getApplicationCountsBySubject(applications)

    // get the counts based on the dimenstions chosen by the user
    if (options) {
      counts = ApplicationHelper.getApplicationCountsV2(applications, options)
    }

    // default dimension 1 to the subject (a proxy for course)
    const dimension1 = ApplicationHelper.getDimensionData('subject').data

    let dimension2 = []
    if (options && options.dimension2) {
      dimension2 = ApplicationHelper.getDimensionData(options.dimension2).data
    }

    let dimension3 = []
    if (options && options.dimension3) {
      dimension3 = ApplicationHelper.getDimensionData(options.dimension3).data
    }

    let dimension4 = []
    if (options && options.dimension4) {
      dimension4 = ApplicationHelper.getDimensionData(options.dimension4).data
    }

    // Dimension 3 and 4 are optional

    // | =============== | Dimension 2               | Dimension 2               |
    // | =============== | Dimension 3 | Dimension 3 | Dimension 3 | Dimension 3 |
    // | Dimension 1     | =========== | =========== | =========== | =========== |
    // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
    // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
    // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
    // | Dimension 1     | =========== | =========== | =========== | =========== |
    // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
    // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
    // |  -- Dimension 4 | =========== | =========== | =========== | =========== |

    res.render('statistics/applications/courses2', {
      section: 'applications',
      report: 'courses2',
      totalApplications: applications.length,
      options,
      dimension1,
      dimension2,
      dimension3,
      dimension4,
      counts,
      hasFilters: filters.hasFilters,
      selectedFilters: filters.selectedFilters,
      showFilters
    })
  })

  router.get('/statistics/:section/:report/settings', (req, res) => {
    if (!req.session.data.statisticsOptions) {
      req.session.data.statisticsOptions = { dimension1: 'subject' }
    }

    const options = req.session.data.statisticsOptions

    const chosenOptions = []
    if (options) {
      // parse the dimensions so we know what filters to show
      for (const [key, value] of Object.entries(options)) {
        chosenOptions.push(value)
      }
    }

    let counter = 1
    if (options) {
      counter = chosenOptions.length + 1
    }

    res.render('statistics/settings/settings', {
      section: req.params.section,
      report: req.params.report,
      reportName: getReportName(req.params.report),
      counter,
      chosenOptions
    })
  })

  router.post('/statistics/:section/:report/settings', (req, res) => {
    if (req.session.data.button.submit === 'continue') {
      res.redirect(`/statistics/${req.params.section}/${req.params.report}/settings`)
    } else {
      res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
    }
  })

  // ===========================================================================
  // Version 1 – Applications
  // ===========================================================================

  router.get('/statistics/applications/status', (req, res) => {
    let applications = req.session.data.applications

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/statuses', {
      totalApplications: applications.length,
      statuses: SystemHelper.statuses,
      statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
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

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/subjects', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubject(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
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

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/providers', {
      totalApplications: applications.length,
      organisations: SystemHelper.organisations,
      organisationCounts: ApplicationHelper.getApplicationCountsByOrganisation(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
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

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/locations', {
      totalApplications: applications.length,
      locations: SystemHelper.trainingLocations,
      locationCounts: ApplicationHelper.getApplicationCountsByTrainingLocation(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
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

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/reasons-for-rejection', {
      totalApplications: applications.length,
      reasons: SystemHelper.reasonsForRejection,
      reasonCounts: ApplicationHelper.getApplicationCountsByReasonsForRejection(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
        'cycle',
        'trainingProvider',
        'accreditedBody',
        'studyMode',
        'fundingType',
        'subjectLevel'
      ]
    })
  })

  // ===========================================================================
  // Version 2 – Applications
  // ===========================================================================

  router.get('/statistics/applications/courses-by-status', (req, res) => {
    let applications = req.session.data.applications

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/courses-by-status', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      statuses: SystemHelper.statuses,
      cycles: SystemHelper.cycles,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applications),
      section: 'applications',
      report: 'courses-by-status',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/applications/courses-by-year', (req, res) => {
    let applications = req.session.data.applications

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    applicationsCurrentCycle = applications.filter(application => application.cycle === '2020 to 2021')
    applicationsPreviousCycle = applications.filter(application => application.cycle === '2019 to 2020')

    res.render('statistics/applications/courses-by-year', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      statuses: SystemHelper.statuses,
      subjectCountsCurrentCycle: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applicationsCurrentCycle),
      subjectCountsPreviousCycle: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applicationsPreviousCycle),
      section: 'applications',
      report: 'courses-by-year',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/applications/courses-by-training-provider', (req, res) => {
    let applications = req.session.data.applications

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/courses-by-training-provider', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      trainingProviders: SystemHelper.trainingProviders,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndTrainingProvider(applications),
      section: 'applications',
      report: 'courses-by-training-provider',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/applications/courses-by-location', (req, res) => {
    let applications = req.session.data.applications

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/courses-by-location', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      locations: SystemHelper.trainingLocations,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndLocation(applications),
      section: 'applications',
      report: 'courses-by-location',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/applications/courses-by-reasons-for-rejection', (req, res) => {
    let applications = req.session.data.applications
    applications = applications.filter(application => application.cycle === '2020 to 2021')

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/courses-by-reasons-for-rejection', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      reasons: SystemHelper.reasonsForRejection,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndReasonsForRejection(applications),
      section: 'applications',
      report: 'courses-by-reasons-for-rejection',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/applications/course-performance', (req, res) => {
    let applications = req.session.data.applications
    applications = applications.filter(application => application.cycle === '2020 to 2021')

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/course-performance', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      subjectCounts: ApplicationHelper.getSubjectPerformance(applications),
      section: 'applications',
      report: 'course-performance',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/applications/course-diversity-sex', (req, res) => {
    let applications = req.session.data.applications
    applications = applications.filter(application => application.cycle === '2020 to 2021')

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/courses-diversity-sex', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      sexes: SystemHelper.sex,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndSex(applications),
      section: 'applications',
      report: 'course-diversity-sex',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/applications/course-diversity-ethnicity', (req, res) => {
    let applications = req.session.data.applications
    applications = applications.filter(application => application.cycle === '2020 to 2021')

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/courses-diversity-ethnicity', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      ethnicities: SystemHelper.ethnicity,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndEthnicity(applications),
      section: 'applications',
      report: 'course-diversity-ethnicity',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/applications/course-diversity-nationality', (req, res) => {
    let applications = req.session.data.applications
    applications = applications.filter(application => application.cycle === '2020 to 2021')

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/applications/courses-diversity-nationality', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      nationalities: SystemHelper.nationality,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndNationality(applications),
      section: 'applications',
      report: 'course-diversity-nationality',
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions
    })
  })

  router.get('/statistics/:section/:report/configure', (req, res) => {
    const options = getConfigOptions(req)
    res.render('statistics/config-options', {
      section: req.params.section,
      report: req.params.report,
      reportName: getReportName(req.params.report),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      configOptions: getReportConfigOptions(req.params.report)
    })
  })

  // ===========================================================================
  // Version 1 – Candidates
  // ===========================================================================

  router.get('/statistics/candidates', (req, res) => {
    res.redirect('/statistics')
  })

  router.get('/statistics/candidates/english-language-qualification', (req, res) => {
    let applications = req.session.data.applications

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/candidates/english-language-qualification', {
      foreignLanguageCounts: ApplicationHelper.getApplicationCountsByCandidateLanguageAssessment(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
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

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/candidates/nationality', {
      nationalityCounts: ApplicationHelper.getApplicationCountsByCandidateNationality(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
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

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/candidates/residence', {
      residenceCounts: ApplicationHelper.getApplicationCountsByCandidateResidence(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
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

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    res.render('statistics/candidates/right-to-work-study', {
      rightWorkStudyCounts: ApplicationHelper.getApplicationCountsByCandidateRightToWorkStudy(applications),
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      showOptions: [
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

  // ===========================================================================
  // Miscellaneous
  // ===========================================================================

  router.get('/statistics/:section/:report/remove-cycle-option/:cycle', (req, res) => {
    req.session.data.statisticsOptions.cycle = req.session.data.statisticsOptions.cycle.filter(item => item !== req.params.cycle)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-status-option/:status', (req, res) => {
    req.session.data.statisticsOptions.status = req.session.data.statisticsOptions.status.filter(item => item !== req.params.status)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-provider-option/:provider', (req, res) => {
    req.session.data.statisticsOptions.provider = req.session.data.statisticsOptions.provider.filter(item => item !== req.params.provider)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-accreditedbody-option/:accreditedBody', (req, res) => {
    req.session.data.statisticsOptions.accreditedBody = req.session.data.statisticsOptions.accreditedBody.filter(item => item !== req.params.accreditedBody)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-studymode-option/:studyMode', (req, res) => {
    req.session.data.statisticsOptions.studyMode = req.session.data.statisticsOptions.studyMode.filter(item => item !== req.params.studyMode)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-fundingtype-option/:fundingType', (req, res) => {
    req.session.data.statisticsOptions.fundingType = req.session.data.statisticsOptions.fundingType.filter(item => item !== req.params.fundingType)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-subjectlevel-option/:subjectLevel', (req, res) => {
    req.session.data.statisticsOptions.subjectLevel = req.session.data.statisticsOptions.subjectLevel.filter(item => item !== req.params.subjectLevel)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-location-option/:location', (req, res) => {
    req.session.data.statisticsOptions.location = req.session.data.statisticsOptions.location.filter(item => item !== req.params.location)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/remove-all-filters', (req, res) => {
    req.session.data.statisticsOptions.cycle = null
    req.session.data.statisticsOptions.status = null
    req.session.data.statisticsOptions.provider = null
    req.session.data.statisticsOptions.accreditedBody = null
    req.session.data.statisticsOptions.studyMode = null
    req.session.data.statisticsOptions.fundingType = null
    req.session.data.statisticsOptions.subjectLevel = null
    req.session.data.statisticsOptions.location = null
    res.redirect(getRedirect(req.headers.referer))
  })

  router.get('/statistics/:section/:report/remove-all-options', (req, res) => {
    req.session.data.statisticsOptions.cycle = null
    req.session.data.statisticsOptions.status = null
    req.session.data.statisticsOptions.provider = null
    req.session.data.statisticsOptions.accreditedBody = null
    req.session.data.statisticsOptions.studyMode = null
    req.session.data.statisticsOptions.fundingType = null
    req.session.data.statisticsOptions.subjectLevel = null
    req.session.data.statisticsOptions.location = null
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })


  // ===========================================================================
  // Filters
  // ===========================================================================

  router.get('/statistics/:section/:report/remove-cycle-filter/:cycle', (req, res) => {
    req.session.data.statisticsFilters.cycle = req.session.data.statisticsFilters.cycle.filter(item => item !== req.params.cycle)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-status-filter/:status', (req, res) => {
    req.session.data.statisticsFilters.status = req.session.data.statisticsFilters.status.filter(item => item !== req.params.status)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-provider-filter/:provider', (req, res) => {
    req.session.data.statisticsFilters.provider = req.session.data.statisticsFilters.provider.filter(item => item !== req.params.provider)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-accreditedbody-filter/:accreditedBody', (req, res) => {
    req.session.data.statisticsFilters.accreditedBody = req.session.data.statisticsFilters.accreditedBody.filter(item => item !== req.params.accreditedBody)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-studymode-filter/:studyMode', (req, res) => {
    req.session.data.statisticsFilters.studyMode = req.session.data.statisticsFilters.studyMode.filter(item => item !== req.params.studyMode)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-fundingtype-filter/:fundingType', (req, res) => {
    req.session.data.statisticsFilters.fundingType = req.session.data.statisticsFilters.fundingType.filter(item => item !== req.params.fundingType)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-subjectlevel-filter/:subjectLevel', (req, res) => {
    req.session.data.statisticsFilters.subjectLevel = req.session.data.statisticsFilters.subjectLevel.filter(item => item !== req.params.subjectLevel)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-location-filter/:location', (req, res) => {
    req.session.data.statisticsFilters.location = req.session.data.statisticsFilters.location.filter(item => item !== req.params.location)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-all-filters', (req, res) => {
    req.session.data.statisticsFilters.cycle = null
    req.session.data.statisticsFilters.status = null
    req.session.data.statisticsFilters.provider = null
    req.session.data.statisticsFilters.accreditedBody = null
    req.session.data.statisticsFilters.studyMode = null
    req.session.data.statisticsFilters.fundingType = null
    req.session.data.statisticsFilters.subjectLevel = null
    req.session.data.statisticsFilters.location = null
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  // ===========================================================================
  // Report settings
  // ===========================================================================

  router.get('/statistics/:section/:report/remove-all-settings', (req, res) => {
    delete req.session.data.statisticsOptions
    delete req.session.data.statisticsFilters
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

}
