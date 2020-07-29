module.exports = router => {
  router.get('/activity', (req, res) => {
    // Clone and turn into an array
    const apps = req.session.data.applications.filter(app => {
      return app.cycle === "Current cycle (2020 to 2021)"
    })

    let allEvents = []

    apps.forEach(app => {
      const events = app.events.items.map(item => {
        return {
          app: app,
          event: item
        }
      })
      allEvents = allEvents.concat(events)
    })

    allEvents.sort((a, b) => {
      return new Date(b.event.date) - new Date(a.event.date)
    })

    const todayEvents = allEvents.filter(event => {
      return event.event.date.indexOf('2019-08-12') >= 0
    })

    const yesterdayEvents = allEvents.filter(event => {
      return event.event.date.indexOf('2019-08-11') >= 0
    })

    const allOtherEvents = allEvents.filter(event => {
      return event.event.date.indexOf('2019-08-11') === -1 && event.event.date.indexOf('2019-08-12') === -1
    })

    res.render('activity/index', { todayEvents, yesterdayEvents, allOtherEvents })
  })
}
