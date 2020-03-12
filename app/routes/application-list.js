const utils = require( '../data/application-utils')

module.exports = router => {

  router.all('/', (req, res) => {

    // Clone and turn into an array
    let apps = Object.values(req.session.data.applications).reverse();
    let { status, provider, accreditingbody, keywords } = req.query

    keywords = keywords || req.session.data.keywords;

    let statuses = status && (Array.isArray(status) ? status : [ status ].filter((status) => {
      return status !== '_unchecked'
    })) || req.session.data.status;

    let providers = provider && (Array.isArray(provider) ? provider : [ provider ].filter((provider) => {
      return provider !== '_unchecked'
    })) || req.session.data.provider;

    let accreditingbodies = accreditingbody && (Array.isArray(accreditingbody) ? accreditingbody : [ accreditingbody ].filter((provider) => {
      return accreditingbody !== '_unchecked'
    })) || req.session.data.provider;

    const hasFilters = !!( ( statuses && statuses.length > 0) || ( providers && providers.length > 0 ) || ( accreditingbodies && accreditingbodies.length > 0 ) || (keywords) )

    if( hasFilters ){
      apps = apps.filter((app) => {
        let statusValid = true;
        let providerValid = true;
        let accreditingbodyValid = true;
        let candidateNameValid = true;

        if( statuses && statuses.length ){
          statusValid = statuses.includes(app.status)
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

        return statusValid && providerValid && candidateNameValid && accreditingbodyValid;
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
          heading: { text: "Status" },
          items: statuses.map((status) => {
            return {
              text: status,
              href: `/remove-status-filter/${status}`
            }
          })
        })
      }

      if(providers && providers.length) {
        selectedFilters.categories.push({
          heading: { text: "Provider" },
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
          heading: { text: "Accrediting bodies" },
          items: accreditingbodies.map((accreditingbody) => {
            return {
              text: accreditingbody,
              href: `/remove-accreditingbody-filter/${accreditingbody}`
            }
          })
        })
      }
    }

    res.render('index', {
      applications: apps,
      selectedFilters: selectedFilters
    })
  })

  router.get('/remove-keywords-filter', (req, res) => {
    req.session.data.keywords = '';
    res.redirect('/');
  })

  router.get('/remove-status-filter/:status', (req, res) => {
    req.session.data.status = req.session.data.status.filter(item => item !== req.params.status);
    res.redirect('/');
  })

  router.get('/remove-provider-filter/:provider', (req, res) => {
    req.session.data.provider = req.session.data.provider.filter(item => item !== req.params.provider);
    res.redirect('/');
  })

  router.get('/remove-accreditingbody-filter/:accreditingbody', (req, res) => {
    req.session.data.accreditingbody = req.session.data.accreditingbody.filter(item => item !== req.params.accreditingbody);
    res.redirect('/');
  })

  router.get('/remove-all-filters', (req, res) => {
    req.session.data.status = null;
    req.session.data.provider = null;
    req.session.data.keywords = null;
    res.redirect('/');
  })

}
