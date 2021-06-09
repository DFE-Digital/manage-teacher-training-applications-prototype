const ApplicationHelper = require('../data/helpers/application')
const SystemHelper = require('../data/helpers/system')

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

module.exports = router => {

  router.get('/statistics', (req, res) => {
    delete req.session.data.statisticsOptions
    delete req.session.data.statisticsFilters
    delete req.session.data.showPercentage

    console.log(req.session.data.showPercentage);

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

  router.get('/statistics/courses', (req, res) => {
    let applications = req.session.data.applications
    const options = req.session.data.statisticsOptions
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
      counts = ApplicationHelper.getApplicationCounts(applications, options)
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

    res.render('statistics/courses', {
      section: 'applications',
      report: 'courses',
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

  // function getOrganisationPermission(org, relationships) {
  //   var permissions = {
  //     applicableOrgs: {
  //       setupInterviews: [],
  //       makeDecisions: [],
  //       viewSafeguardingInformation: [],
  //       viewDiversityInformation: []
  //     },
  //     nonApplicableOrgs: {
  //       setupInterviews: [],
  //       makeDecisions: [],
  //       viewSafeguardingInformation: [],
  //       viewDiversityInformation: []
  //     }
  //   }
  //   relationships.filter(relationship => {
  //     return relationship.org1.id === org.id || relationship.org2.id === org.id
  //   }).forEach(relationship => {
  //     var orgKey = relationship.org1.id == org.id ? 'org2' : 'org1';
  //     let permissionsKey = relationship.org1.id == org.id ? 'org1Permissions' : 'org2Permissions';
  //
  //     if(relationship[permissionsKey].setupInterviews) {
  //       permissions.applicableOrgs.setupInterviews.push(relationship[orgKey])
  //     } else {
  //       permissions.nonApplicableOrgs.setupInterviews.push(relationship[orgKey])
  //     }
  //
  //     if(relationship[permissionsKey].makeDecisions) {
  //       permissions.applicableOrgs.makeDecisions.push(relationship[orgKey])
  //     } else {
  //       permissions.nonApplicableOrgs.makeDecisions.push(relationship[orgKey])
  //     }
  //
  //     if(relationship[permissionsKey].viewSafeguardingInformation) {
  //       permissions.applicableOrgs.viewSafeguardingInformation.push(relationship[orgKey])
  //     } else {
  //       permissions.nonApplicableOrgs.viewSafeguardingInformation.push(relationship[orgKey])
  //     }
  //
  //     if(relationship[permissionsKey].viewDiversityInformation) {
  //       permissions.applicableOrgs.viewDiversityInformation.push(relationship[orgKey])
  //     } else {
  //       permissions.nonApplicableOrgs.viewDiversityInformation.push(relationship[orgKey])
  //     }
  //
  //   })
  //   return permissions
  // }

  router.get('/statistics/courses-by-status', (req, res) => {
    let applications = req.session.data.applications
    applications = applications.filter(application => application.cycle === '2020 to 2021')

    // let showPercentage = 'no'
    // if (req.query.showPercentage && req.query.showPercentage === 'yes') {
    //   showPercentage = 'yes'
    // }

    // console.log(req.session.data.user.organisations[0]);

    // let user = req.session.data.user
    //
    // let orgs = user.organisations.map(org => {
    //   // add permissions in for each org
    //
    //   return {
    //     org: org,
    //     permissions: getOrganisationPermission(org, req.session.data.relationships)
    //   }
    //
    // })

    console.log(req.session.data.relationships);


    const trainingProviders = req.session.data.organisations.filter(data => data.isAccreditedBody === false).map((organisation) => {
      return organisation.name
    })

    const accreditedBodies = req.session.data.organisations.filter(data => data.isAccreditedBody === true).map((organisation) => {
      return organisation.name
    })

    // console.log(accreditedBodies);

    // console.log(req.session.data.organisations);

    const showPercentage = 'no'

    const options = { dimension1: 'subject', dimension2: 'status' }

    const counts = {
  "Art and design": {
    "Received": 74,
    "Interviewing": 31,
    "Offered": 9,
    "Awaiting conditions": 20,
    "Ready to enroll": 6,
    "Total": 140
  },
  "Biology": {
    "Received": 35,
    "Interviewing": 23,
    "Offered": 20,
    "Awaiting conditions": 11,
    "Ready to enroll": 4,
    "Total": 93
  },
  "Chemistry": {
    "Received": 26,
    "Interviewing": 31,
    "Offered": 2,
    "Awaiting conditions": 14,
    "Ready to enroll": 8,
    "Total": 81
  },
  "Computer science": {
    "Received": 34,
    "Interviewing": 9,
    "Offered": 2,
    "Awaiting conditions": 4,
    "Ready to enroll": 2,
    "Total": 51
  },
  "Design and technology": {
    "Received": 63,
    "Interviewing": 11,
    "Offered": 16,
    "Awaiting conditions": 7,
    "Ready to enroll": 8,
    "Total": 105
  },
  "Drama": {
    "Received": 59,
    "Interviewing": 25,
    "Offered": 2,
    "Awaiting conditions": 11,
    "Ready to enroll": 1,
    "Total": 98
  },
  "English": {
    "Received": 50,
    "Interviewing": 23,
    "Offered": 3,
    "Awaiting conditions": 3,
    "Ready to enroll": 3,
    "Total": 82
  },
  "Primary": {
    "Received": 65,
    "Interviewing": 21,
    "Offered": 1,
    "Awaiting conditions": 2,
    "Ready to enroll": 2,
    "Total": 91
  },
  "Geography": {
    "Received": 69,
    "Interviewing": 13,
    "Offered": 3,
    "Awaiting conditions": 12,
    "Ready to enroll": 4,
    "Total": 101
  },
  "History": {
    "Received": 38,
    "Interviewing": 4,
    "Offered": 16,
    "Awaiting conditions": 3,
    "Ready to enroll": 1,
    "Total": 62
  },
  "Social sciences": {
    "Received": 67,
    "Interviewing": 11,
    "Offered": 19,
    "Awaiting conditions": 18,
    "Ready to enroll": 5,
    "Total": 120
  },
  "Mathematics": {
    "Received": 57,
    "Interviewing": 11,
    "Offered": 5,
    "Awaiting conditions": 6,
    "Ready to enroll": 5,
    "Total": 84
  },
  "Music": {
    "Received": 73,
    "Interviewing": 8,
    "Offered": 20,
    "Awaiting conditions": 14,
    "Ready to enroll": 8,
    "Total": 123
  },
  "Physical education": {
    "Received": 61,
    "Interviewing": 33,
    "Offered": 10,
    "Awaiting conditions": 7,
    "Ready to enroll": 7,
    "Total": 118
  },
  "Physics": {
    "Received": 33,
    "Interviewing": 3,
    "Offered": 5,
    "Awaiting conditions": 16,
    "Ready to enroll": 8,
    "Total": 65
  },
  "Primary with English": {
    "Received": 27,
    "Interviewing": 28,
    "Offered": 7,
    "Awaiting conditions": 3,
    "Ready to enroll": 2,
    "Total": 67
  },
  "Primary with science": {
    "Received": 70,
    "Interviewing": 25,
    "Offered": 6,
    "Awaiting conditions": 16,
    "Ready to enroll": 3,
    "Total": 120
  },
  "Primary with physical education": {
    "Received": 70,
    "Interviewing": 29,
    "Offered": 11,
    "Awaiting conditions": 18,
    "Ready to enroll": 1,
    "Total": 129
  },
  "Primary with mathematics": {
    "Received": 75,
    "Interviewing": 25,
    "Offered": 3,
    "Awaiting conditions": 11,
    "Ready to enroll": 8,
    "Total": 122
  },
  "Religious education": {
    "Received": 43,
    "Interviewing": 10,
    "Offered": 14,
    "Awaiting conditions": 2,
    "Ready to enroll": 5,
    "Total": 74
  },
  "All courses": {
    "Received": 1089,
    "Interviewing": 374,
    "Offered": 174,
    "Awaiting conditions": 198,
    "Ready to enroll": 91,
    "Total": 1926
  }
}

    // {
    //   "Art and design": {
    //     "Received": 7,
    //     "Interviewing": 1,
    //     "Offered": 5,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 1,
    //     "Total": 14
    //   },
    //   "Biology": {
    //     "Received": 0,
    //     "Interviewing": 0,
    //     "Offered": 5,
    //     "Awaiting conditions": 5,
    //     "Ready to enroll": 1,
    //     "Total": 11
    //   },
    //   "Chemistry": {
    //     "Received": 1,
    //     "Interviewing": 4,
    //     "Offered": 3,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 0,
    //     "Total": 8
    //   },
    //   "Computer science": {
    //     "Received": 11,
    //     "Interviewing": 1,
    //     "Offered": 7,
    //     "Awaiting conditions": 1,
    //     "Ready to enroll": 1,
    //     "Total": 21
    //   },
    //   "Design and technology": {
    //     "Received": 0,
    //     "Interviewing": 0,
    //     "Offered": 0,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 0,
    //     "Total": 0
    //   },
    //   "Drama": {
    //     "Received": 3,
    //     "Interviewing": 0,
    //     "Offered": 1,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 0,
    //     "Total": 4
    //   },
    //   "English": {
    //     "Received": 37,
    //     "Interviewing": 11,
    //     "Offered": 10,
    //     "Awaiting conditions": 5,
    //     "Ready to enroll": 2,
    //     "Total": 65
    //   },
    //   "Primary": {
    //     "Received": 33,
    //     "Interviewing": 12,
    //     "Offered": 5,
    //     "Awaiting conditions": 5,
    //     "Ready to enroll": 8,
    //     "Total": 63
    //   },
    //   "Geography": {
    //     "Received": 0,
    //     "Interviewing": 0,
    //     "Offered": 0,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 0,
    //     "Total": 0
    //   },
    //   "History": {
    //     "Received": 0,
    //     "Interviewing": 0,
    //     "Offered": 0,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 0,
    //     "Total": 0
    //   },
    //   "Social sciences": {
    //     "Received": 3,
    //     "Interviewing": 0,
    //     "Offered": 0,
    //     "Awaiting conditions": 1,
    //     "Ready to enroll": 0,
    //     "Total": 4
    //   },
    //   "Mathematics": {
    //     "Received": 22,
    //     "Interviewing": 9,
    //     "Offered": 8,
    //     "Awaiting conditions": 12,
    //     "Ready to enroll": 5,
    //     "Total": 56
    //   },
    //   "Music": {
    //     "Received": 4,
    //     "Interviewing": 1,
    //     "Offered": 0,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 0,
    //     "Total": 5
    //   },
    //   "Physical education": {
    //     "Received": 17,
    //     "Interviewing": 8,
    //     "Offered": 1,
    //     "Awaiting conditions": 7,
    //     "Ready to enroll": 0,
    //     "Total": 33
    //   },
    //   "Physics": {
    //     "Received": 1,
    //     "Interviewing": 1,
    //     "Offered": 2,
    //     "Awaiting conditions": 2,
    //     "Ready to enroll": 1,
    //     "Total": 7
    //   },
    //   "Primary with English": {
    //     "Received": 15,
    //     "Interviewing": 7,
    //     "Offered": 7,
    //     "Awaiting conditions": 6,
    //     "Ready to enroll": 2,
    //     "Total": 37
    //   },
    //   "Primary with science": {
    //     "Received": 13,
    //     "Interviewing": 5,
    //     "Offered": 8,
    //     "Awaiting conditions": 2,
    //     "Ready to enroll": 5,
    //     "Total": 33
    //   },
    //   "Primary with physical education": {
    //     "Received": 22,
    //     "Interviewing": 10,
    //     "Offered": 2,
    //     "Awaiting conditions": 4,
    //     "Ready to enroll": 2,
    //     "Total": 40
    //   },
    //   "Primary with mathematics": {
    //     "Received": 0,
    //     "Interviewing": 0,
    //     "Offered": 0,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 0,
    //     "Total": 0
    //   },
    //   "Religious education": {
    //     "Received": 1,
    //     "Interviewing": 0,
    //     "Offered": 0,
    //     "Awaiting conditions": 0,
    //     "Ready to enroll": 0,
    //     "Total": 1
    //   },
    //   "All courses": {
    //     "Received": 190,
    //     "Interviewing": 70,
    //     "Offered": 64,
    //     "Awaiting conditions": 50,
    //     "Ready to enroll": 28,
    //     "Total": 402
    //   }
    // }

    const dimension1 = [
      'Art and design',
      'Biology',
      'Chemistry',
      'Computer science',
      'Design and technology',
      'Design and technology',
      'Drama',
      'English',
      'Primary',
      'Geography',
      'History',
      'Social sciences',
      'Mathematics',
      'Music',
      'Physical education',
      'Physics',
      'Primary with English',
      'Primary with science',
      'Primary with physical education',
      'Primary with mathematics',
      'Religious education'
    ]

    const dimension2 = [
      'Received',
      'Interviewing',
      'Offered',
      'Awaiting conditions',
      'Ready to enroll'
    ]

    res.render('statistics/status', {
      report: 'courses-by-status',
      pageName: 'Number of applications to courses by status (2020 to 2021)',
      dimension1,
      dimension2,
      counts,
      showPercentage,
      trainingProviders
    })
  })

  router.get('/statistics/conversion', (req, res) => {
    let applications = req.session.data.applications
    applications = applications.filter(application => application.cycle === '2020 to 2021')

    const dimension1 = [
      'Art and design',
      'Biology',
      'Chemistry',
      'Computer science',
      'Design and technology',
      'Drama',
      'English',
      'Primary',
      'Geography',
      'History',
      'Social sciences',
      'Mathematics',
      'Music',
      'Physical education',
      'Physics',
      'Primary with English',
      'Primary with science',
      'Primary with physical education',
      'Primary with mathematics',
      'Religious education'
    ]

    const dimension2 = [
      'From received to interviewing',
      'From interviewing to offered',
      'From offered to awaiting conditions',
      'From awaiting conditions to ready to enroll',
      'From offered to ready to enroll'
    ]

    const counts = {
      "Art and design": {
        "From received to interviewing": 65,
        "From interviewing to offered": 85,
        "From offered to awaiting conditions": 75,
        "From awaiting conditions to ready to enroll": 65,
        "From offered to ready to enroll": 10
      }
    }

    res.render('statistics/conversion', {
      pageName: 'Movement of applications between statuses (2020 to 2021)',
      dimension1,
      dimension2,
      counts
    })
  })

  router.get('/statistics/:report/settings', (req, res) => {
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

    res.render('statistics/settings', {
      section: req.params.section,
      report: req.params.report,
      reportName: 'Courses',
      counter,
      chosenOptions
    })
  })

  router.post('/statistics/:report/settings', (req, res) => {
    if (req.session.data.button.submit === 'continue') {
      res.redirect(`/statistics/${req.params.report}/settings`)
    } else {
      res.redirect(`/statistics/${req.params.report}`)
    }
  })

  // ===========================================================================
  // Report filters
  // ===========================================================================

  router.get('/statistics/:report/remove-cycle-filter/:cycle', (req, res) => {
    req.session.data.statisticsFilters.cycle = req.session.data.statisticsFilters.cycle.filter(item => item !== req.params.cycle)
    res.redirect(`/statistics/${req.params.report}`)
  })

  router.get('/statistics/:report/remove-status-filter/:status', (req, res) => {
    req.session.data.statisticsFilters.status = req.session.data.statisticsFilters.status.filter(item => item !== req.params.status)
    res.redirect(`/statistics/${req.params.report}`)
  })

  router.get('/statistics/:report/remove-provider-filter/:provider', (req, res) => {
    req.session.data.statisticsFilters.provider = req.session.data.statisticsFilters.provider.filter(item => item !== req.params.provider)
    res.redirect(`/statistics/${req.params.report}`)
  })

  router.get('/statistics/:report/remove-accreditedbody-filter/:accreditedBody', (req, res) => {
    req.session.data.statisticsFilters.accreditedBody = req.session.data.statisticsFilters.accreditedBody.filter(item => item !== req.params.accreditedBody)
    res.redirect(`/statistics/${req.params.report}`)
  })

  router.get('/statistics/:report/remove-studymode-filter/:studyMode', (req, res) => {
    req.session.data.statisticsFilters.studyMode = req.session.data.statisticsFilters.studyMode.filter(item => item !== req.params.studyMode)
    res.redirect(`/statistics/${req.params.report}`)
  })

  router.get('/statistics/:report/remove-fundingtype-filter/:fundingType', (req, res) => {
    req.session.data.statisticsFilters.fundingType = req.session.data.statisticsFilters.fundingType.filter(item => item !== req.params.fundingType)
    res.redirect(`/statistics/${req.params.report}`)
  })

  router.get('/statistics/:report/remove-subjectlevel-filter/:subjectLevel', (req, res) => {
    req.session.data.statisticsFilters.subjectLevel = req.session.data.statisticsFilters.subjectLevel.filter(item => item !== req.params.subjectLevel)
    res.redirect(`/statistics/${req.params.report}`)
  })

  router.get('/statistics/:report/remove-location-filter/:location', (req, res) => {
    req.session.data.statisticsFilters.location = req.session.data.statisticsFilters.location.filter(item => item !== req.params.location)
    res.redirect(`/statistics/${req.params.report}`)
  })

  router.get('/statistics/:report/remove-all-filters', (req, res) => {
    req.session.data.statisticsFilters.cycle = null
    req.session.data.statisticsFilters.status = null
    req.session.data.statisticsFilters.provider = null
    req.session.data.statisticsFilters.accreditedBody = null
    req.session.data.statisticsFilters.studyMode = null
    req.session.data.statisticsFilters.fundingType = null
    req.session.data.statisticsFilters.subjectLevel = null
    req.session.data.statisticsFilters.location = null
    res.redirect(`/statistics/${req.params.report}`)
  })

  // ===========================================================================
  // Report settings
  // ===========================================================================

  router.get('/statistics/:report/remove-all-settings', (req, res) => {
    delete req.session.data.statisticsOptions
    delete req.session.data.statisticsFilters
    res.redirect(`/statistics/${req.params.report}`)
  })

}
