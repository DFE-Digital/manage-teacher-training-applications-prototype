const utils = require( '../data/application-utils')
const { DateTime } = require('luxon')

function getCheckboxValues(name, data) {
  return name && (Array.isArray(name) ? name : [ name ].filter((name) => {
    return name !== '_unchecked'
  })) || data;
}

module.exports = router => {

  router.all('/', (req, res) => {

    // Clone and turn into an array
    let apps = Object.values(req.session.data.applications).reverse();
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

        // if( rbddates && rbddates.length ){

        //   var now = DateTime.fromISO('2019-08-15');
        //   var rbd = DateTime.fromISO(app.submittedDate).plus({ days: 40 });
        //   var diff = rbd.diff(now, 'days').toObject().days;

        //   if(rbddates.includes("Within the next 5 days")) {
        //     rbdValid = diff <= 5;
        //   }

        //   if(rbddates.includes("Within the next 10 days")) {
        //     rbdValid = diff <= 10;
        //   }

        //   if(rbddates.includes("Within the next 20 days")) {
        //     rbdValid = diff <= 50;
        //   }

        // }

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

      // if(rbddates && rbddates.length) {
      //   selectedFilters.categories.push({
      //     heading: { text: "Reject by default date" },
      //     items: rbddates.map((rbddate) => {
      //       return {
      //         text: rbddate,
      //         href: `/remove-rbddate-filter/${rbddate}`
      //       }
      //     })
      //   })
      // }

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
          heading: { text: "Training locations for Growing Expert Teachers" },
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
      if(app.status !== 'Submitted') {
        app.daysToRespond = 1000;
      }

      app.lastEventDate = lastEvent.datetime.timestamp;
      return app;
    }).sort(function(a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.lastEventDate) - new Date(a.lastEventDate);
    });

    if(sortby == 'reject by default') {
      // applications = applications.sort(function(a, b) {
      //   if(a.status == "Submitted") {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // })
      applications = applications.sort(function(a, b) {
        return a.daysToRespond - b.daysToRespond;
      })
    }

    res.render('index', {
      applications: applications,
      selectedFilters: selectedFilters
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

}
