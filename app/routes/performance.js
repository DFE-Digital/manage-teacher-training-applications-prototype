const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')

module.exports = router => {

  router.get('/performance', (req, res) => {
    res.render('performance/index', {

    })
  })

  router.get('/performance/applications', (req, res) => {
    const applications = req.session.data.applications.filter(apps => apps.cycle === '2020 to 2021')
    res.render('performance/applications/index', {
      totalApplications: applications.length,
      statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications)
    })
  })


  router.get('/performance/applications/detail', (req, res) => {

    let applications = req.session.data.applications

    let { cycle, studyMode } = req.query

    const cycles = SystemHelper.getCheckboxValues(cycle, req.session.data.cycle)
    const studyModes = SystemHelper.getCheckboxValues(studyMode, req.session.data.studyMode)

    const hasFilters = !!((cycles && cycles.length > 0) || (studyModes && studyModes.length > 0))

    if (hasFilters) {
      applications = applications.filter((app) => {
        let cycleValid = true
        let studyModeValid = true

        if (cycles && cycles.length) {
          cycleValid = cycles.includes(app.cycle)
        }

        if (studyModes && studyModes.length) {
          studyModeValid = studyModes.includes(app.studyMode)
        }

        return cycleValid && studyModeValid
      })
    }

    let selectedFilters = null

    if (hasFilters) {
      selectedFilters = {
        categories: []
      }

      if (cycles && cycles.length) {
        selectedFilters.categories.push({
          heading: { text: 'Year received' },
          items: cycles.map((cycle) => {
            return {
              text: cycle,
              href: `/performance/remove-cycle-filter/${cycle}`
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
              href: `/performance/remove-studyMode-filter/${studyMode}`
            }
          })
        })
      }
    }

    res.render('performance/applications/detail', {
      totalApplications: applications.length,
      statuses: SystemHelper.statuses,
      statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications),
      subjects: SystemHelper.subjects,
      subjectCounts: ApplicationHelper.getApplicationCountsBySubject(applications),
      organisations: SystemHelper.organisations,
      organisationCounts: ApplicationHelper.getApplicationCountsByOrganisation(applications),
      locations: SystemHelper.trainingLocations,
      locationCounts: ApplicationHelper.getApplicationCountsByTrainingLocation(applications),
      selectedFilters,
      hasFilters,
      filterAction: '/performance/applications/detail'
    })
  })

  router.get('/performance/candidates', (req, res) => {
    let applications = req.session.data.applications

    let { cycle, studyMode } = req.query

    const cycles = SystemHelper.getCheckboxValues(cycle, req.session.data.cycle)
    const studyModes = SystemHelper.getCheckboxValues(studyMode, req.session.data.studyMode)

    const hasFilters = !!((cycles && cycles.length > 0) || (studyModes && studyModes.length > 0))

    if (hasFilters) {
      applications = applications.filter((app) => {
        let cycleValid = true
        let studyModeValid = true

        if (cycles && cycles.length) {
          cycleValid = cycles.includes(app.cycle)
        }

        if (studyModes && studyModes.length) {
          studyModeValid = studyModes.includes(app.studyMode)
        }

        return cycleValid && studyModeValid
      })
    }

    let selectedFilters = null

    if (hasFilters) {
      selectedFilters = {
        categories: []
      }

      if (cycles && cycles.length) {
        selectedFilters.categories.push({
          heading: { text: 'Year received' },
          items: cycles.map((cycle) => {
            return {
              text: cycle,
              href: `/performance/remove-cycle-filter/${cycle}`
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
              href: `/performance/remove-studyMode-filter/${studyMode}`
            }
          })
        })
      }
    }

    res.render('performance/candidates', {
      residenceCounts: ApplicationHelper.getApplicationCountsByCandidateResidence(applications),
      rightWorkStudyCounts: ApplicationHelper.getApplicationCountsByCandidateRightToWorkStudy(applications),
      foreignLanguageCounts: ApplicationHelper.getApplicationCountsByCandidateLanguageAssessment(applications),
      selectedFilters,
      hasFilters,
      filterAction: '/performance/candidates'
    })
  })

  router.get('/performance/remove-cycle-filter/:cycle', (req, res) => {
    req.session.data.cycle = req.session.data.cycle.filter(item => item !== req.params.cycle)
    if (req.headers.referer.includes('/candidates')) {
      res.redirect('/performance/candidates')
    } else {
      res.redirect('/performance/applications/details')
    }
  })

  router.get('/performance/remove-studyMode-filter/:studyMode', (req, res) => {
    req.session.data.studyMode = req.session.data.studyMode.filter(item => item !== req.params.studyMode)
    if (req.headers.referer.includes('/candidates')) {
      res.redirect('/performance/candidates')
    } else {
      res.redirect('/performance/applications/details')
    }
  })

  router.get('/performance/remove-all-filters', (req, res) => {
    req.session.data.cycle = null
    req.session.data.studyMode = null
    if (req.headers.referer.includes('/candidates')) {
      res.redirect('/performance/candidates')
    } else {
      res.redirect('/performance/applications/details')
    }
  })

}
