const csvWriter = require('csv-writer').createObjectCsvWriter
const path = require('path')

const downloadDirectoryPath = path.join(__dirname, '../data/downloads')

const StatisticsHelper = require('../data/helpers/statistics')

module.exports = router => {

  router.get('/reports', (req, res) => {
    const userOrganisations = req.session.data.user.organisations

    res.render('data/index', {
      userOrganisations
    })
  })

  router.get('/reports/status-of-applications', (req, res) => {
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

  router.get('/reports/:organisationId/status-of-applications', (req, res) => {
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

  router.get('/reports/progress-of-applications', (req, res) => {
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

  router.get('/reports/:organisationId/progress-of-applications', (req, res) => {
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

  router.get('/reports/export', (req, res) => {

    res.render('data/export/index', {

    })
  })

  router.get('/reports/hesa', (req, res) => {

    res.render('data/export/hesa', {

    })
  })

  router.get('/reports/status-of-applications/download', (req, res) => {
    const filePath = downloadDirectoryPath + '/status-of-applications.csv'

    const csv = csvWriter({
      path: filePath,
      header: [
        { id: 'course', title: 'Course' },
        { id: 'code', title: 'Course code' },
        { id: 'provider', title: 'Provider' },
        { id: 'data1', title: 'Received' },
        { id: 'data2', title: 'Interviewing' },
        { id: 'data3', title: 'Offered' },
        { id: 'data4', title: 'Awaiting conditions' },
        { id: 'data5', title: 'Ready to enroll' }
      ]
    })

    const statusData = StatisticsHelper.statusData

    const records = []

    statusData.forEach((item, i) => {
      const data = {}

      data.course = item.title
      data.code = item.code
      data.provider = item.provider
      data.data1 = item.counts.received
      data.data2 = item.counts.interviewing
      data.data3 = item.counts.offered
      data.data4 = item.counts.awaiting_conditions
      data.data5 = item.counts.ready_to_enroll

      records.push(data)
    })

    csv.writeRecords(records)
      .then(() => {
        console.log('...Done')
        res.download(filePath,'Status of applications (2020 to 2021)')
      })
  })

  router.get('/reports/progress-of-applications/download', (req, res) => {
    const filePath = downloadDirectoryPath + '/progress-of-applications.csv'

    const csv = csvWriter({
      path: filePath,
      header: [
        { id: 'course', title: 'Course' },
        { id: 'code', title: 'Course code' },
        { id: 'provider', title: 'Provider' },
        { id: 'data1', title: 'Shortlist for interview rate' },
        { id: 'data2', title: 'Interview success rate' },
        { id: 'data3', title: 'Offer rate' },
        { id: 'data4', title: 'Acceptance rate' },
        { id: 'data5', title: 'Conditions met rate' },
        { id: 'data6', title: 'Offer conversion rate' },
        { id: 'data7', title: 'Overall conversion rate' }
      ]
    })

    const records = []

    const description = {
      course: '',
      code: '',
      provider: '',
      data1: 'Percentage of applications received offered an interview',
      data2: 'Percentage interviewed that are made an offer',
      data3: 'Percentage applications received that are made an offer',
      data4: 'Percentage offers made that are accepted',
      data5: 'Percentage accepted offers that go on to meet their conditions',
      data6: 'Percentage offers made lead to successful enrollment',
      data7: 'Percentage  received applications that lead to successful enrollment'
    }

    records.push(description)

    const conversionData = StatisticsHelper.conversionData

    conversionData.forEach((item, i) => {
      const data = {}

      data.course = item.title
      data.code = item.code
      data.provider = item.provider
      data.data1 = item.percentages.shortlist_for_interview_rate
      data.data2 = item.percentages.interview_success_rate
      data.data3 = item.percentages.offer_rate
      data.data4 = item.percentages.acceptance_rate
      data.data5 = item.percentages.conditions_met_rate
      data.data6 = item.percentages.offer_conversion_rate
      data.data7 = item.percentages.overall_conversion

      records.push(data)
    })

    csv.writeRecords(records)
      .then(() => {
        console.log('...Done')
        res.download(filePath,'Progress of applications (2020 to 2021)')
      })
  })

}
