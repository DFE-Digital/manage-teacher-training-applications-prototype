const utils = require('../data/application-utils')
const { DateTime } = require('luxon')

function getCheckboxValues (name, data) {
  return name && (Array.isArray(name) ? name : [name].filter((name) => {
    return name !== '_unchecked'
  })) || data
}

module.exports = router => {
  router.all('/', (req, res) => {
    let apps = req.session.data.applications.reverse().filter(app => {
      return app.cycle === req.session.data.cycle
    })
    let { status, provider, accreditingbody, keywords, locationname, rbddate, sortby } = req.query

    keywords = keywords || req.session.data.keywords

    // let rbddates = getCheckboxValues(rbddate, req.session.data.rbddate);
    const statuses = getCheckboxValues(status, req.session.data.status)
    const providers = getCheckboxValues(provider, req.session.data.provider)
    const locationnames = getCheckboxValues(locationname, req.session.data.locationname)
    const accreditingbodies = getCheckboxValues(accreditingbody, req.session.data.accreditingbody)

    const hasFilters = !!((statuses && statuses.length > 0) || (locationnames && locationnames.length > 0) || (providers && providers.length > 0) || (accreditingbodies && accreditingbodies.length > 0) || (keywords))

    if (hasFilters) {
      apps = apps.filter((app) => {
        let statusValid = true
        let providerValid = true
        let locationnameValid = true
        let accreditingbodyValid = true
        let candidateNameValid = true
        // let rbdValid = true;

        if (statuses && statuses.length) {
          statusValid = statuses.includes(app.status)
        }

        if (locationnames && locationnames.length) {
          locationnameValid = locationnames.includes(app.locationname)
        }

        if (providers && providers.length) {
          providerValid = providers.includes(app.provider)
        }

        if (accreditingbodies && accreditingbodies.length) {
          accreditingbodyValid = accreditingbodies.includes(app.accreditingbody)
        }

        var candidateName = app['personal-details']['given-name'] + ' ' + app['personal-details']['family-name']

        if (keywords) {
          candidateNameValid = candidateName.toLowerCase().includes(keywords.toLowerCase())
        }

        return statusValid && locationnameValid && providerValid && candidateNameValid && accreditingbodyValid
      })
    }

    let selectedFilters = null
    if (hasFilters) {
      selectedFilters = {
        categories: []
      }

      if (keywords) {
        selectedFilters.categories.push({
          heading: { text: "Candidate's name" },
          items: [{
            text: keywords,
            href: '/remove-keywords-filter'
          }]
        })
      }

      if (statuses && statuses.length) {
        selectedFilters.categories.push({
          heading: { text: 'Statuses' },
          items: statuses.map((status) => {
            return {
              text: status,
              href: `/remove-status-filter/${status}`
            }
          })
        })
      }

      if (locationnames && locationnames.length) {
        selectedFilters.categories.push({
          heading: { text: 'Training locations for ' + req.session.data.organisations[1].name },
          items: locationnames.map((locationname) => {
            return {
              text: locationname,
              href: `/remove-locationname-filter/${locationname}`
            }
          })
        })
      }

      if (providers && providers.length) {
        selectedFilters.categories.push({
          heading: { text: 'Providers' },
          items: providers.map((provider) => {
            return {
              text: provider,
              href: `/remove-provider-filter/${provider}`
            }
          })
        })
      }

      if (accreditingbodies && accreditingbodies.length) {
        selectedFilters.categories.push({
          heading: { text: 'Courses ratified by' },
          items: accreditingbodies.map((accreditingbody) => {
            return {
              text: accreditingbody,
              href: `/remove-accreditingbody-filter/${accreditingbody}`
            }
          })
        })
      }
    }

    var applications = apps.map(app => {
      // coz it's in reverse chron
      var lastEvent = utils.getTimeline(app)[0]
      if (lastEvent.label.text === 'Note added') {
        app.lastEventType = 'note'
      } else {
        app.lastEventType = 'status'
      }

      var now = DateTime.fromISO('2019-08-15')
      var rbd = DateTime.fromISO(app.submittedDate).plus({ days: 40 })
      var diff = rbd.diff(now, 'days').toObject().days

      app.daysToRespond = Math.round(diff)
      if (diff < 1) {
        app.daysToRespond = 0
      }

      if (app.status !== 'Submitted') {
        app.daysToRespond = 1000
      }

      app.lastEventDate = lastEvent.datetime.timestamp

      return app
    })


    applications = applications.sort(function (a, b) {
      return a.daysToRespond - b.daysToRespond
    })

    function getApplicationsByGroup(applications) {
      const deferred = applications
        .filter(app => app.status === 'Deferred')

      const rejectedWithoutFeedback = applications
        .filter(app => app.status === 'Rejected' && !app.rejectedReasons)

      const aboutToBeRejectedAutomatically = applications
        .filter(app => app.status === 'Submitted')
        .filter(app => app.daysToRespond < 5)

      const awaitingDecision = applications
        .filter(app => app.status === 'Submitted')
        .filter(app => app.daysToRespond >= 5)

      console.log(awaitingDecision);

      const waitingOn = applications
        .filter(app => app.status === 'Offered')
        .concat(applications.filter(app => app.status === 'Accepted'))

      const conditionsMet = applications.filter(app => app.status === 'Conditions met')

      // console.log(conditionsMet);

      let other = applications
        .filter(app => app.status !== 'Submitted')
        .filter(app => app.status !== 'Deferred')
        .filter(app => app.status !== 'Offered')
        .filter(app => app.status !== 'Accepted')
        .filter(app => app.status !== 'Conditions met')

      const rejectedWithFeedback = applications
        .filter(app => app.status === 'Rejected')
        .filter(function (app) {
          return app.rejectedReasons
        })

      other = other.concat(rejectedWithFeedback)

      return {
        deferred,
        rejectedWithoutFeedback,
        aboutToBeRejectedAutomatically,
        awaitingDecision,
        waitingOn,
        conditionsMet,
        other
      }
    }

    // Whack all the grouped items into an array without headings
    var grouped = getApplicationsByGroup(applications)

    // console.log(grouped);

    function flattenGroup(grouped) {
      var array = [];

      // console.log(grouped.rejectedWithoutFeedback);

      array = array.concat(grouped.deferred)
      array = array.concat(grouped.rejectedWithoutFeedback)
      array = array.concat(grouped.aboutToBeRejectedAutomatically)
      // array = array.concat(grouped.awaitingDecision)
      // array = array.concat(grouped.waitingOn)
      // array = array.concat(grouped.conditionsMet)
      // array = array.concat(grouped.other)

      return array;



      if (deferredApplications.length) {
        // applications.push({
        //   heading: 'Reconfirm offers'
        // })
        applications = applications.concat(deferredApplications)
      }

      if (aboutToBeRejectedAutomatically.length) {
        // applications.push({
        //   heading: 'Deadline approaching: respond to the candidate'
        // })
        applications = applications.concat(aboutToBeRejectedAutomatically)
      }

      if (needsFeedback.length) {
        // applications.push({
        //   heading: 'Give feedback: you did not respond in time'
        // })
        applications = applications.concat(needsFeedback)
      }

      if (applicationsThatNeedResponse.length) {
        // applications.push({
        //   heading: 'Ready for review'
        // })
        applications = applications.concat(applicationsThatNeedResponse)
      }

      if (waitingOnApplications.length) {
        // applications.push({
        //   heading: 'Waiting for candidate action'
        // })
        applications = applications.concat(waitingOnApplications)
      }

      if (successfulApplications.length) {
        // applications.push({
        //   heading: 'Successful candidates'
        // })
        applications = applications.concat(successfulApplications)
      }

      if (otherApplications.length) {
        // if (deferredApplications.length || needsFeedback.length || aboutToBeRejectedAutomatically.length || applicationsThatNeedResponse.length || waitingOnApplications.length || successfulApplications.length) {
        //   applications.push({
        //     heading: 'No action needed'
        //   })
        // }
        applications = applications.concat(otherApplications)
      }
    }

    var flatten = flattenGroup(grouped);

    // console.log(flatten[0].status);
    // console.log(flatten[1].status);
    // console.log(flatten[2].status);
    // console.log(flatten[3].status);

    // function getGroupedLenth(grouped) {
    //   return Object.values(grouped).reduce((accumulator, item) => {
    //     return accumulator + item.length;
    //   }, 0)
    // }

    // var groupedLength = getGroupedLenth(grouped)

    // Get the page worth of items
    let pageSize = 20;
    let page = req.query.page || 1







    // Then sort those into groups again
    // Then inject the headings
    // Pass that to view







    // var headingCount = applications.filter(app => app.heading).length;
    // var appCount = (applications.length - headingCount);




    // let viewApps = applications.slice(0, 20);

    // var headingCount = viewApps.filter(app => app.heading).length;

    // applications = applications.slice(0, pageSize + headingCount);


    res.render('index', {
      applications: applications,
      selectedFilters: selectedFilters,
      hasFilters: hasFilters
    })
  })

  router.get('/remove-keywords-filter', (req, res) => {
    req.session.data.keywords = ''
    res.redirect('/')
  })

  // router.get('/remove-rbddate-filter/:rbddate', (req, res) => {
  //   req.session.data.rbddate = req.session.data.rbddate.filter(item => item !== req.params.rbddate);
  //   res.redirect('/');
  // })

  router.get('/remove-status-filter/:status', (req, res) => {
    req.session.data.status = req.session.data.status.filter(item => item !== req.params.status)
    res.redirect('/')
  })

  router.get('/remove-provider-filter/:provider', (req, res) => {
    req.session.data.provider = req.session.data.provider.filter(item => item !== req.params.provider)
    res.redirect('/')
  })

  router.get('/remove-locationname-filter/:locationname', (req, res) => {
    req.session.data.locationname = req.session.data.locationname.filter(item => item !== req.params.locationname)
    res.redirect('/')
  })

  router.get('/remove-accreditingbody-filter/:accreditingbody', (req, res) => {
    req.session.data.accreditingbody = req.session.data.accreditingbody.filter(item => item !== req.params.accreditingbody)
    res.redirect('/')
  })

  router.get('/remove-all-filters', (req, res) => {
    // req.session.data.rbddate = null;
    req.session.data.status = null
    req.session.data.provider = null
    req.session.data.keywords = null
    req.session.data.accreditingbody = null
    req.session.data.locationname = null
    res.redirect('/')
  })

  router.post('/switch-cycle', (req, res) => {
    res.redirect('/')
  })
}
