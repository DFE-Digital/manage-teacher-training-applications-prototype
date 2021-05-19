const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')

const getConfigOptions = (req) => {
  // let { cycle, status, provider, accreditedBody, studyMode, fundingType, subjectLevel, location } = req.query

  if (req.session.data.statistics === undefined) {
    req.session.data.statistics = {}
  }

  let options = {}
  options.cycles = req.session.data.statistics.cycle
  options.statuses = req.session.data.statistics.status
  options.studyModes = req.session.data.statistics.studyMode
  options.fundingTypes = req.session.data.statistics.fundingType
  options.subjectLevels = req.session.data.statistics.subjectLevel
  options.providers = req.session.data.statistics.provider
  options.accreditedBodies = req.session.data.statistics.accreditedBody
  options.locations = req.session.data.statistics.location

  // options.cycles = SystemHelper.getCheckboxValues(config.cycle, req.session.data.statistics.cycle)
  // options.statuses = SystemHelper.getCheckboxValues(config.status, req.session.data.statistics.status)
  // options.studyModes = SystemHelper.getCheckboxValues(config.studyMode, req.session.data.statistics.studyMode)
  // options.fundingTypes = SystemHelper.getCheckboxValues(config.fundingType, req.session.data.statistics.fundingType)
  // options.subjectLevels = SystemHelper.getCheckboxValues(config.subjectLevel, req.session.data.statistics.subjectLevel)
  // options.providers = SystemHelper.getCheckboxValues(config.provider, req.session.data.statistics.provider)
  // options.accreditedBodies = SystemHelper.getCheckboxValues(config.accreditedBody, req.session.data.statistics.accreditedBody)
  // options.locations = SystemHelper.getCheckboxValues(config.accreditedBody, req.session.data.statistics.location)

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
    case 'courses-by-cycle':
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
    delete req.session.data.statistics
    res.render('statistics/index', {})
  })

  router.get('/statistics/applications', (req, res) => {
    res.redirect('/statistics')
  })

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

  router.get('/statistics/applications/courses-by-cycle', (req, res) => {
    let applications = req.session.data.applications

    const options = getConfigOptions(req)

    if (options.hasOptions) {
      applications = getApplications(applications, options.options)
    }

    applicationsCurrentCycle = applications.filter(application => application.cycle === '2020 to 2021')
    applicationsPreviousCycle = applications.filter(application => application.cycle === '2019 to 2020')

    res.render('statistics/applications/courses-by-cycle', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      statuses: SystemHelper.statuses,
      subjectCountsCurrentCycle: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applicationsCurrentCycle),
      subjectCountsPreviousCycle: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applicationsPreviousCycle),
      section: 'applications',
      report: 'courses-by-cycle',
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
      trainingProviders: [
        'Wren Academy',
        'The Royal Borough Teaching School Alliance'
      ],
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
    res.render('statistics/configure', {
      section: req.params.section,
      report: req.params.report,
      hasOptions: options.hasOptions,
      selectedOptions: options.selectedOptions,
      configOptions: getReportConfigOptions(req.params.report)
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

  router.get('/statistics/:section/:report/remove-cycle-option/:cycle', (req, res) => {
    req.session.data.statistics.cycle = req.session.data.statistics.cycle.filter(item => item !== req.params.cycle)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-status-option/:status', (req, res) => {
    req.session.data.statistics.status = req.session.data.statistics.status.filter(item => item !== req.params.status)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-provider-option/:provider', (req, res) => {
    req.session.data.statistics.provider = req.session.data.statistics.provider.filter(item => item !== req.params.provider)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-accreditedbody-option/:accreditedBody', (req, res) => {
    req.session.data.statistics.accreditedBody = req.session.data.statistics.accreditedBody.filter(item => item !== req.params.accreditedBody)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-studymode-option/:studyMode', (req, res) => {
    req.session.data.statistics.studyMode = req.session.data.statistics.studyMode.filter(item => item !== req.params.studyMode)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-fundingtype-option/:fundingType', (req, res) => {
    req.session.data.statistics.fundingType = req.session.data.statistics.fundingType.filter(item => item !== req.params.fundingType)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-subjectlevel-option/:subjectLevel', (req, res) => {
    req.session.data.statistics.subjectLevel = req.session.data.statistics.subjectLevel.filter(item => item !== req.params.subjectLevel)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/:section/:report/remove-location-option/:location', (req, res) => {
    req.session.data.statistics.location = req.session.data.statistics.location.filter(item => item !== req.params.location)
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

  router.get('/statistics/remove-all-filters', (req, res) => {
    req.session.data.statistics.cycle = null
    req.session.data.statistics.status = null
    req.session.data.statistics.provider = null
    req.session.data.statistics.accreditedBody = null
    req.session.data.statistics.studyMode = null
    req.session.data.statistics.fundingType = null
    req.session.data.statistics.subjectLevel = null
    req.session.data.statistics.location = null
    res.redirect(getRedirect(req.headers.referer))
  })

  router.get('/statistics/:section/:report/remove-all-options', (req, res) => {
    req.session.data.statistics.cycle = null
    req.session.data.statistics.status = null
    req.session.data.statistics.provider = null
    req.session.data.statistics.accreditedBody = null
    req.session.data.statistics.studyMode = null
    req.session.data.statistics.fundingType = null
    req.session.data.statistics.subjectLevel = null
    req.session.data.statistics.location = null
    res.redirect(`/statistics/${req.params.section}/${req.params.report}`)
  })

}
