const StatisticsHelper = require('../data/helpers/statistics')

module.exports = router => {

  router.get('/reports-and-export-data', (req, res) => {
    const userOrganisations = req.session.data.user.organisations

    res.render('data/index', {
      userOrganisations
    })
  })

  router.get('/reports-and-export-data/status-of-applications', (req, res) => {
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
      statuses,
      statusData,
      partners
    })
  })

  router.get('/reports-and-export-data/:organisationId/status-of-applications', (req, res) => {
    const organisation = req.session.data.user.organisations.filter(organisation => organisation.id = req.params.organisationId)[0]

    const partners = req.session.data.relationships
                    .filter(rel => rel.org1.id = req.params.organisationId)
                    .map((relationship) => {
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
      organisation,
      statuses,
      statusData,
      partners
    })
  })

  router.get('/reports-and-export-data/progress-of-applications', (req, res) => {
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
      stages,
      stageData,
      partners
    })
  })

  router.get('/reports-and-export-data/:organisationId/progress-of-applications', (req, res) => {
    const organisation = req.session.data.user.organisations.filter(organisation => organisation.id = req.params.organisationId)[0]

    const partners = req.session.data.relationships
                    .filter(rel => rel.org1.id = req.params.organisationId)
                    .map((relationship) => {
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
      organisation,
      stages,
      stageData,
      partners
    })
  })

  router.get('/reports-and-export-data/conversion', (req, res) => {
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
      stages,
      conversionData,
      partners
    })
  })

  router.get('/reports-and-export-data/:organisationId/conversion', (req, res) => {
    const organisation = req.session.data.user.organisations.filter(organisation => organisation.id = req.params.organisationId)[0]

    const partners = req.session.data.relationships
                    .filter(rel => rel.org1.id = req.params.organisationId)
                    .map((relationship) => {
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
      organisation,
      stages,
      conversionData,
      partners
    })
  })

  router.get('/reports-and-export-data/export', (req, res) => {

    res.render('data/export/index', {

    })
  })

  router.get('/reports-and-export-data/hesa', (req, res) => {

    res.render('data/export/hesa', {

    })
  })

}
