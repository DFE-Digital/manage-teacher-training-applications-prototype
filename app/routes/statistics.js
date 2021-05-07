const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')

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

    res.render('statistics/applications/statuses', {
      totalApplications: applications.length,
      statuses: SystemHelper.statuses,
      statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications)
    })
  })

  router.get('/statistics/applications/subject', (req, res) => {
    let applications = req.session.data.applications

    res.render('statistics/applications/subjects', {
      totalApplications: applications.length,
      subjects: SystemHelper.subjects,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubject(applications)
    })
  })

  router.get('/statistics/applications/provider', (req, res) => {
    let applications = req.session.data.applications

    res.render('statistics/applications/providers', {
      totalApplications: applications.length,
      organisations: SystemHelper.organisations,
      organisationCounts: ApplicationHelper.getApplicationCountsByOrganisation(applications)
    })
  })

  router.get('/statistics/applications/location', (req, res) => {
    let applications = req.session.data.applications

    res.render('statistics/applications/locations', {
      totalApplications: applications.length,
      locations: SystemHelper.trainingLocations,
      locationCounts: ApplicationHelper.getApplicationCountsByTrainingLocation(applications)
    })
  })

  router.get('/statistics/applications/reasons-for-rejection', (req, res) => {
    let applications = req.session.data.applications

    res.render('statistics/applications/reasons-for-rejection', {

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

  // router.get('/statistics/applications', (req, res) => {
  //   const applications = req.session.data.applications.filter(apps => apps.cycle === '2020 to 2021')
  //   res.render('statistics/applications/index', {
  //     totalApplications: applications.length,
  //     statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications)
  //   })
  // })


  // router.get('/statistics/applications', (req, res) => {
  //
  //   let applications = req.session.data.applications
  //
  //   let { cycle, studyMode } = req.query
  //
  //   const cycles = SystemHelper.getCheckboxValues(cycle, req.session.data.cycle)
  //   const studyModes = SystemHelper.getCheckboxValues(studyMode, req.session.data.studyMode)
  //
  //   const hasFilters = !!((cycles && cycles.length > 0) || (studyModes && studyModes.length > 0))
  //
  //   if (hasFilters) {
  //     applications = applications.filter((app) => {
  //       let cycleValid = true
  //       let studyModeValid = true
  //
  //       if (cycles && cycles.length) {
  //         cycleValid = cycles.includes(app.cycle)
  //       }
  //
  //       if (studyModes && studyModes.length) {
  //         studyModeValid = studyModes.includes(app.studyMode)
  //       }
  //
  //       return cycleValid && studyModeValid
  //     })
  //   }
  //
  //   let selectedFilters = null
  //
  //   if (hasFilters) {
  //     selectedFilters = {
  //       categories: []
  //     }
  //
  //     if (cycles && cycles.length) {
  //       selectedFilters.categories.push({
  //         heading: { text: 'Year received' },
  //         items: cycles.map((cycle) => {
  //           return {
  //             text: cycle,
  //             href: `/statistics/remove-cycle-filter/${cycle}`
  //           }
  //         })
  //       })
  //     }
  //
  //     if (studyModes && studyModes.length) {
  //       selectedFilters.categories.push({
  //         heading: { text: 'Full time or part time' },
  //         items: studyModes.map((studyMode) => {
  //           return {
  //             text: studyMode,
  //             href: `/statistics/remove-studyMode-filter/${studyMode}`
  //           }
  //         })
  //       })
  //     }
  //   }
  //
  //   res.render('statistics/applications/index', {
  //     totalApplications: applications.length,
  //     statuses: SystemHelper.statuses,
  //     statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications),
  //     subjects: SystemHelper.subjects,
  //     subjectCounts: ApplicationHelper.getApplicationCountsBySubject(applications),
  //     organisations: SystemHelper.organisations,
  //     organisationCounts: ApplicationHelper.getApplicationCountsByOrganisation(applications),
  //     locations: SystemHelper.trainingLocations,
  //     locationCounts: ApplicationHelper.getApplicationCountsByTrainingLocation(applications),
  //     selectedFilters,
  //     hasFilters,
  //     filterAction: '/statistics/applications/detail'
  //   })
  // })

  // router.get('/statistics/candidates', (req, res) => {
  //   let applications = req.session.data.applications
  //
  //   let { cycle, studyMode } = req.query
  //
  //   const cycles = SystemHelper.getCheckboxValues(cycle, req.session.data.cycle)
  //   const studyModes = SystemHelper.getCheckboxValues(studyMode, req.session.data.studyMode)
  //
  //   const hasFilters = !!((cycles && cycles.length > 0) || (studyModes && studyModes.length > 0))
  //
  //   if (hasFilters) {
  //     applications = applications.filter((app) => {
  //       let cycleValid = true
  //       let studyModeValid = true
  //
  //       if (cycles && cycles.length) {
  //         cycleValid = cycles.includes(app.cycle)
  //       }
  //
  //       if (studyModes && studyModes.length) {
  //         studyModeValid = studyModes.includes(app.studyMode)
  //       }
  //
  //       return cycleValid && studyModeValid
  //     })
  //   }
  //
  //   let selectedFilters = null
  //
  //   if (hasFilters) {
  //     selectedFilters = {
  //       categories: []
  //     }
  //
  //     if (cycles && cycles.length) {
  //       selectedFilters.categories.push({
  //         heading: { text: 'Year received' },
  //         items: cycles.map((cycle) => {
  //           return {
  //             text: cycle,
  //             href: `/statistics/remove-cycle-filter/${cycle}`
  //           }
  //         })
  //       })
  //     }
  //
  //     if (studyModes && studyModes.length) {
  //       selectedFilters.categories.push({
  //         heading: { text: 'Full time or part time' },
  //         items: studyModes.map((studyMode) => {
  //           return {
  //             text: studyMode,
  //             href: `/statistics/remove-studyMode-filter/${studyMode}`
  //           }
  //         })
  //       })
  //     }
  //   }
  //
  //   res.render('statistics/candidates', {
  //     residenceCounts: ApplicationHelper.getApplicationCountsByCandidateResidence(applications),
  //     rightWorkStudyCounts: ApplicationHelper.getApplicationCountsByCandidateRightToWorkStudy(applications),
  //     foreignLanguageCounts: ApplicationHelper.getApplicationCountsByCandidateLanguageAssessment(applications),
  //     selectedFilters,
  //     hasFilters,
  //     filterAction: '/statistics/candidates'
  //   })
  // })

  router.get('/statistics/remove-cycle-filter/:cycle', (req, res) => {
    req.session.data.cycle = req.session.data.cycle.filter(item => item !== req.params.cycle)
    if (req.headers.referer.includes('/candidates')) {
      res.redirect('/statistics/candidates')
    } else {
      res.redirect('/statistics/applications/details')
    }
  })

  router.get('/statistics/remove-studyMode-filter/:studyMode', (req, res) => {
    req.session.data.studyMode = req.session.data.studyMode.filter(item => item !== req.params.studyMode)
    if (req.headers.referer.includes('/candidates')) {
      res.redirect('/statistics/candidates')
    } else {
      res.redirect('/statistics/applications/details')
    }
  })

  router.get('/statistics/remove-all-filters', (req, res) => {
    req.session.data.cycle = null
    req.session.data.studyMode = null
    if (req.headers.referer.includes('/candidates')) {
      res.redirect('/statistics/candidates')
    } else {
      res.redirect('/statistics/applications/details')
    }
  })

}
