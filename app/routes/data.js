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
      { title: 'Shortlist for interview', description: 'Percentage of of applications received offered an interview' },
      { title: 'Interview success', description: 'Percentage interviewed that are made an offer'},
      { title: 'Offer', description: 'Percentage of applications received that are made an offer'},
      { title: 'Acceptance', description: 'Percentage of offers made that are accepted'},
      { title: 'Conditions met', description: 'Percentage of accepted offers that go on to meet their conditions'},
      { title: 'Offer conversion', description: 'Percentage of offers made lead to successful enrollment'},
      { title: 'Overall conversion', description: 'Percentage of received applications that  lead to successful enrollment'}
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
      { title: 'Shortlist for interview', description: 'Percentage of of applications received offered an interview' },
      { title: 'Interview success', description: 'Percentage interviewed that are made an offer'},
      { title: 'Offer', description: 'Percentage of applications received that are made an offer'},
      { title: 'Acceptance', description: 'Percentage of offers made that are accepted'},
      { title: 'Conditions met', description: 'Percentage of accepted offers that go on to meet their conditions'},
      { title: 'Offer conversion', description: 'Percentage of offers made lead to successful enrollment'},
      { title: 'Overall conversion', description: 'Percentage of received applications that  lead to successful enrollment'}
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
        { id: 'total_count', title: 'Total number of applications' },
        { id: 'data1_count', title: 'Shortlist for interview (number)' },
        { id: 'data1_percentage', title: 'Shortlist for interview rate (percentage)' },
        { id: 'data2_count', title: 'Interview success (number)' },
        { id: 'data2_percentage', title: 'Interview success rate (percentage)' },
        { id: 'data3_count', title: 'Offer (number)' },
        { id: 'data3_percentage', title: 'Offer rate (percentage)' },
        { id: 'data4_count', title: 'Acceptance (number)' },
        { id: 'data4_percentage', title: 'Acceptance rate (percentage)' },
        { id: 'data5_count', title: 'Conditions met (number)' },
        { id: 'data5_percentage', title: 'Conditions met rate (percentage)' },
        { id: 'data6_count', title: 'Offer conversion (number)' },
        { id: 'data6_percentage', title: 'Offer conversion rate (percentage)' },
        { id: 'data7_count', title: 'Overall conversion (number)' },
        { id: 'data7_percentage', title: 'Overall conversion rate (percentage)' }
      ]
    })

    const records = []

    const description = {
      course: '',
      code: '',
      provider: '',
      total_count: '',
      data1_count: 'Number of applications received offered an interview',
      data1_percentage: 'Percentage of applications received offered an interview',
      data2_count: 'Number interviewed that are made an offer',
      data2_percentage: 'Percentage interviewed that are made an offer',
      data3_count: 'Number of applications received that are made an offer',
      data3_percentage: 'Percentage o fapplications received that are made an offer',
      data4_count: 'Number of offers made that are accepted',
      data4_percentage: 'Percentage of offers made that are accepted',
      data5_count: 'Number of accepted offers that go on to meet their conditions',
      data5_percentage: 'Percentage of accepted offers that go on to meet their conditions',
      data6_count: 'Number of offers made lead to successful enrollment',
      data6_percentage: 'Percentage of offers made lead to successful enrollment',
      data7_count: 'Number of received applications that lead to successful enrollment',
      data7_percentage: 'Percentage of received applications that lead to successful enrollment'
    }

    records.push(description)

    const conversionData = StatisticsHelper.conversionData

    conversionData.forEach((item, i) => {
      const data = {}

      data.course = item.title
      data.code = item.code
      data.provider = item.provider
      data.total_count = item.total_count
      data.data1_count = item.shortlist_for_interview.count
      data.data1_percentage = item.shortlist_for_interview.percentage
      data.data2_count = item.interview_success.count
      data.data2_percentage = item.interview_success.percentage
      data.data3_count = item.offer.count
      data.data3_percentage = item.offer.percentage
      data.data4_count = item.acceptance.count
      data.data4_percentage = item.acceptance.percentage
      data.data5_count = item.conditions_met.count
      data.data5_percentage = item.conditions_met.percentage
      data.data6_count = item.offer_conversion.count
      data.data6_percentage = item.offer_conversion.percentage
      data.data7_count = item.overall_conversion.count
      data.data7_percentage = item.overall_conversion.percentage

      records.push(data)
    })

    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,'Progress of applications (2020 to 2021)')
      })
  })

}
