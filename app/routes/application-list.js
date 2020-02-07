const applications = require( '../data/applications')
const utils = require( '../data/application-utils')

module.exports = router => {

  router.all('/', (req, res) => {

    // Clone and turn into an array
    let apps = Object.values(req.session.data.applications).reverse();
    const { status, provider } = req.query

    let statuses = status && (Array.isArray(status) ? status : [ status ].filter((status) => {
      return status !== '_unchecked'
    })) || req.session.data.status;
    let providers = provider && (Array.isArray(provider) ? provider : [ provider ].filter((provider) => {
      return provider !== '_unchecked'
    })) || req.session.data.provider;
    const hasFilters = !!( ( statuses && statuses.length > 0) || ( providers && providers.length > 0 ) )

    if( hasFilters ){
      apps = apps.filter((app) => {
        let statusValid = true;
        let providerValid = true;

        if( statuses && statuses.length ){
          statusValid = statuses.includes(app.status)
        }

        if( providers && providers.length ){
          providerValid = providers.includes(app.provider)
        }

        return statusValid && providerValid;
      })
    }

    let selectedFilters = null;
    if(hasFilters) {
      selectedFilters = {
        categories: []
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
    }

    res.render('index', {
      applications: apps,
      selectedFilters: selectedFilters
    })
  })

  router.get('/remove-status-filter/:status', (req, res) => {
    req.session.data.status = req.session.data.status.filter(item => item !== req.params.status);
    res.redirect('/');
  })

  router.get('/remove-provider-filter/:provider', (req, res) => {
    req.session.data.provider = req.session.data.provider.filter(item => item !== req.params.provider);
    res.redirect('/');
  })

  router.get('/remove-all-filters', (req, res) => {
    req.session.data.status = null;
    req.session.data.provider = null;
    res.redirect('/');
  })

}
