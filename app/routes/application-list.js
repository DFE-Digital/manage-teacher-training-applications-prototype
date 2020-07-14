const utils = require( '../data/application-utils')
const { DateTime } = require('luxon');
const { notify } = require('browser-sync');
const { application } = require('express');

function getCheckboxValues(name, data) {
  return name && (Array.isArray(name) ? name : [ name ].filter((name) => {
    return name !== '_unchecked'
  })) || data;
}

module.exports = router => {

  router.all('/', (req, res) => {

    // Clone and turn into an array
    let apps = Object.values(req.session.data.applications).reverse().filter(app => {
      return app.cycle == req.session.data.cycle;
    });
    let { status, provider, accreditingbody, keywords, locationname, rbddate, sortby } = req.query

    keywords = keywords || req.session.data.keywords;

    // let rbddates = getCheckboxValues(rbddate, req.session.data.rbddate);
    let statuses = getCheckboxValues(status, req.session.data.status);
    let providers = getCheckboxValues(provider, req.session.data.provider);
    let locationnames = getCheckboxValues(locationname, req.session.data.locationname);
    let accreditingbodies = getCheckboxValues(accreditingbody, req.session.data.accreditingbody);

    const hasFilters = !!( ( statuses && statuses.length > 0) || ( locationnames && locationnames.length > 0 ) || ( providers && providers.length > 0 ) || ( accreditingbodies && accreditingbodies.length > 0 ) || (keywords) )

    if( hasFilters ){
      apps = apps.filter((app) => {
        let statusValid = true;
        let providerValid = true;
        let locationnameValid = true;
        let accreditingbodyValid = true;
        let candidateNameValid = true;
        // let rbdValid = true;

        if( statuses && statuses.length ){
          statusValid = statuses.includes(app.status)
        }

        if( locationnames && locationnames.length ){
          locationnameValid = locationnames.includes(app.locationname)
        }

        if( providers && providers.length ){
          providerValid = providers.includes(app.provider)
        }

        if( accreditingbodies && accreditingbodies.length ){
          accreditingbodyValid = accreditingbodies.includes(app.accreditingbody)
        }

        var candidateName = app['personal-details']['given-name'] + ' ' + app['personal-details']['family-name'];

        if(keywords) {
          candidateNameValid = candidateName.toLowerCase().includes(keywords.toLowerCase());
        }

        return statusValid && locationnameValid && providerValid && candidateNameValid && accreditingbodyValid;
      })
    }

    let selectedFilters = null;
    if(hasFilters) {
      selectedFilters = {
        categories: []
      }

      if(keywords) {
        selectedFilters.categories.push({
          heading: { text: "Candidate's name" },
          items: [{
            text: keywords,
            href: `/remove-keywords-filter`
          }]
        })
      }

      if(statuses && statuses.length) {
        selectedFilters.categories.push({
          heading: { text: "Statuses" },
          items: statuses.map((status) => {
            return {
              text: status,
              href: `/remove-status-filter/${status}`
            }
          })
        })
      }

      if(locationnames && locationnames.length) {
        selectedFilters.categories.push({
          heading: { text: "Training locations for " + data.organisations[1].name },
          items: locationnames.map((locationname) => {
            return {
              text: locationname,
              href: `/remove-locationname-filter/${locationname}`
            }
          })
        })
      }

      if(providers && providers.length) {
        selectedFilters.categories.push({
          heading: { text: "Providers" },
          items: providers.map((provider) => {
            return {
              text: provider,
              href: `/remove-provider-filter/${provider}`
            }
          })
        })
      }

      if(accreditingbodies && accreditingbodies.length) {
        selectedFilters.categories.push({
          heading: { text: "Courses ratified by" },
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
      var lastEvent = utils.getTimeline(app)[0];
      if(lastEvent.label.text === "Note added") {
        app.lastEventType = "note";
      } else {
        app.lastEventType = "status";
      }

      var now = DateTime.fromISO('2019-08-15');
      var rbd = DateTime.fromISO(app.submittedDate).plus({ days: 40 });
      var diff = rbd.diff(now, 'days').toObject().days;

      app.daysToRespond = Math.round(diff);
      if(diff < 1) {
        app.daysToRespond = 0;
      }

      if(app.status !== 'Submitted') {
        app.daysToRespond = 1000;
      }

      app.lastEventDate = lastEvent.datetime.timestamp;
      return app;
    })

    if(sortby == 'last changed') {
      applications.sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.lastEventDate) - new Date(a.lastEventDate);
      });
    } else {
      applications = applications.sort(function(a, b) {
        return a.daysToRespond - b.daysToRespond;
      })
      let deferredApplications = applications.filter(app => app.status == "Deferred");
      let automaticallyRejectedApplications = applications.filter(app => app.status == "Rejected automatically" && !app.rejectedReasons);

      let soonToBeRejectedAutomatically = applications.filter(app => app.status == "Submitted").filter(app => app.daysToRespond < 5);

      let applicationsThatNeedResponse = applications.filter(app => app.status == "Submitted").filter(app => app.daysToRespond >= 5);

      let waitingOnApplications = applications.filter(app => app.status == "Offered").concat(applications.filter(app => app.status == "Accepted"));

      let otherApplications = applications
        .filter(app => app.status != "Submitted")
        .filter(app => app.status != "Deferred")
        .filter(app => app.status != "Offered")
        .filter(app => app.status != "Accepted")

      let rejectedAutomaticallyWithFeedback = applications
        .filter(app => app.status == "Rejected automatically")
        .filter(function(app) {
          return app.rejectedReasons;
        })

      otherApplications.concat(rejectedAutomaticallyWithFeedback);

      applications = [];
      if(deferredApplications.length) {
        applications.push({
          heading: "Deferred offers: please check and confirm"
        })
        applications = applications.concat(deferredApplications)
      }

      if(automaticallyRejectedApplications.length) {
        applications.push({
          heading: "Rejected by default: please give feedback"
        })
        applications = applications.concat(automaticallyRejectedApplications)
      }

      if(soonToBeRejectedAutomatically.length) {
        applications.push({
          heading: "Rejected by default in less than 5 days: please respond"
        })
        applications = applications.concat(soonToBeRejectedAutomatically)
      }

      if(applicationsThatNeedResponse.length) {
        applications.push({
          heading: "Submitted applications: please respond"
        })
        applications = applications.concat(applicationsThatNeedResponse)
      }

      if(waitingOnApplications.length) {
        applications.push({
          heading: "Offers waiting for a candidate action"
        })
        applications = applications.concat(waitingOnApplications)
      }

      if(otherApplications.length) {

        if(deferredApplications.length || automaticallyRejectedApplications.length || applicationsThatNeedResponse.length || waitingOnApplications.length ) {
          applications.push({
            heading: "All other applications and offers"
          })
        }
        applications = applications.concat(otherApplications);
      }
    }

    res.render('index', {
      applications: applications,
      selectedFilters: selectedFilters,
      hasFilters: hasFilters
    })
  })

  router.get('/remove-keywords-filter', (req, res) => {
    req.session.data.keywords = '';
    res.redirect('/');
  })

  // router.get('/remove-rbddate-filter/:rbddate', (req, res) => {
  //   req.session.data.rbddate = req.session.data.rbddate.filter(item => item !== req.params.rbddate);
  //   res.redirect('/');
  // })

  router.get('/remove-status-filter/:status', (req, res) => {
    req.session.data.status = req.session.data.status.filter(item => item !== req.params.status);
    res.redirect('/');
  })

  router.get('/remove-provider-filter/:provider', (req, res) => {
    req.session.data.provider = req.session.data.provider.filter(item => item !== req.params.provider);
    res.redirect('/');
  })

  router.get('/remove-locationname-filter/:locationname', (req, res) => {
    req.session.data.locationname = req.session.data.locationname.filter(item => item !== req.params.locationname);
    res.redirect('/');
  })

  router.get('/remove-accreditingbody-filter/:accreditingbody', (req, res) => {
    req.session.data.accreditingbody = req.session.data.accreditingbody.filter(item => item !== req.params.accreditingbody);
    res.redirect('/');
  })

  router.get('/remove-all-filters', (req, res) => {
    // req.session.data.rbddate = null;
    req.session.data.status = null;
    req.session.data.provider = null;
    req.session.data.keywords = null;
    req.session.data.accreditingbody = null;
    req.session.data.locationname = null;
    res.redirect('/');
  })

  router.post('/switch-cycle', (req, res) => {
    res.redirect(`/`);
  })

}
