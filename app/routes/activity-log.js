module.exports = router => {

  router.get('/activity', (req, res) => {

    // Clone and turn into an array
    let apps = Object.values(req.session.data.applications).filter(app => {
      return app.cycle == req.session.data.cycle;
    });

    let allEvents = [];

    apps.forEach(app => {
      let events = app.events.items.map(item => {
        return {
          app: app,
          event: item
        }
      });
      allEvents = allEvents.concat(events);
    });

    allEvents.sort((a, b) => {
      return new Date(a.event.date) - new Date(b.event.date);
    })

    allEvents = allEvents.reverse();

    res.render('activity/index', { events: allEvents });
  })

}
