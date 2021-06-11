const StatisticsHelper = require('../data/helpers/statistics')

module.exports = router => {

  router.get('/data', (req, res) => {
    const userOrganisations = req.session.data.user.organisations.map((organisation) => {
      return organisation.name
    })

    // const userOrganisations = [
    //   'University of Bedfordshire',
    //   'University of Hertfordshire'
    // ]

    res.render('data/index', {
      userOrganisations
    })
  })

  router.get('/data/status', (req, res) => {
    const partners = req.session.data.relationships.map((relationship) => {
      return relationship.org2.name
    })

    const statuses = [
      'Received',
      'Interviewing',
      'Offered',
      'Awaiting conditions',
      'Ready to enroll'
    ]

    const statusData = StatisticsHelper.statusData

    res.render('data/statistics/status', {
      organisation: req.query.organisation,
      statuses,
      statusData,
      partners
    })
  })

  router.get('/data/progress', (req, res) => {
    const partners = req.session.data.relationships.map((relationship) => {
      return relationship.org2.name
    })

    const stages = [
      'From received to interviewing',
      'From interviewing to offered',
      'From offered to awaiting conditions',
      'From awaiting conditions to ready to enroll',
      'From offered to ready to enroll'
    ]

    const stageData = StatisticsHelper.progressData

    res.render('data/statistics/progress', {
      organisation: req.query.organisation,
      stages,
      stageData,
      partners
    })
  })

  router.get('/data/conversion', (req, res) => {
    const userOrganisations = req.session.data.user.organisations.map((organisation) => {
      return organisation.name
    })

    const partners = req.session.data.relationships.map((relationship) => {
      return relationship.org2.name
    })

    const stages = [
      { title: 'Shortlist for interview rate', description: '% of applications received offered an interview' },
      { title: 'Interview success rate', description: '% interviewed that are made an offer'},
      { title: 'Offer rate', description: '% applications received that are made an offer'},
      { title: 'Acceptance rate', description: '% offers made that are accepted'},
      { title: 'Conditions met rate', description: '% accepted offers that go on to meet their conditions'},
      { title: 'Offer conversion rate', description: '% offers made lead to successful enrollment'},
      { title: 'Overall conversion', description: '% received applications that  lead to successful enrollment'}
    ]

    const conversionData = StatisticsHelper.conversionData

    res.render('data/statistics/conversion', {
      organisation: req.query.organisation,
      stages,
      conversionData,
      partners
    })
  })

  router.get('/data/export', (req, res) => {

    res.render('data/export/index', {

    })
  })

  router.get('/data/hesa', (req, res) => {

    res.render('data/export/hesa', {

    })
  })

}
