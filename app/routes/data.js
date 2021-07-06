const csvWriter = require('csv-writer').createObjectCsvWriter
const path = require('path')

const downloadDirectoryPath = path.join(__dirname, '../data/downloads')

const StatisticsHelper = require('../data/helpers/statistics')

const statuses = [
  { code: 'received', title: 'Received' },
  { code: 'interviewing', title: 'Interviewing' },
  { code: 'offered', title: 'Offered' },
  { code: 'awaiting_conditions', title: 'Awaiting conditions' },
  { code: 'ready_to_enroll', title: 'Ready to enroll' }
]

const stages = [
  { code: 'shortlist_for_interview', title: 'Invited to interview', description: 'Applications which led to interviews' },
  { code: 'interview_success', title: 'Made offer after interview', description: 'Interviews which led to offers'},
  { code: 'offer', title: 'Made offer', description: 'Applications which led to offers'},
  { code: 'acceptance', title: 'Accepted offer', description: 'Offers which led to candidate accepting'},
  { code: 'conditions_met', title: 'Met offer conditions', description: 'Accepted offers which led to conditions being met'},
  { code: 'offer_conversion', title: 'Successful offer', description: 'Offers which led to candidate being ready to enroll'},
  { code: 'overall_conversion', title: 'Successful application', description: 'Applications which led to candidate being ready to enroll'}
]

module.exports = router => {

  router.get('/reports', (req, res) => {
    const userOrganisations = req.session.data.user.organisations

    res.render('data/index', {
      userOrganisations
    })
  })

  router.get('/reports/:organisationId/status-of-applications', (req, res) => {
    const userOrganisations = req.session.data.user.organisations
    const organisation = req.session.data.user.organisations.filter(organisation => organisation.id = req.params.organisationId)[0]

    // const partners = req.session.data.relationships
    //                 .filter(rel => rel.org1.id = req.params.organisationId)
    //                 .map((relationship) => {
    //                   return relationship.org2.name
    //                 })

    const statusData = StatisticsHelper.statusData

    res.render('data/statistics/status', {
      userOrganisations,
      organisation,
      statuses,
      statusData
      // ,
      // partners
    })
  })

  router.get('/reports/:organisationId/progress-of-applications', (req, res) => {
    const userOrganisations = req.session.data.user.organisations
    const organisation = req.session.data.user.organisations.filter(organisation => organisation.id = req.params.organisationId)[0]

    // const partners = req.session.data.relationships
    //                 .filter(rel => rel.org1.id = req.params.organisationId)
    //                 .map((relationship) => {
    //                   return relationship.org2.name
    //                 })

    const conversionData = StatisticsHelper.conversionData

    res.render('data/statistics/conversion', {
      userOrganisations,
      organisation,
      stages,
      conversionData
      // ,
      // partners
    })
  })

  router.get('/reports/:organisationId/export', (req, res) => {
    const organisation = req.session.data.user.organisations.filter(organisation => organisation.id = req.params.organisationId)[0]
    res.render('data/export/index', {
      organisation
    })
  })

  router.get('/reports/:organisationId/hesa', (req, res) => {
    const organisation = req.session.data.user.organisations.filter(organisation => organisation.id = req.params.organisationId)[0]
    res.render('data/export/hesa', {
      organisation
    })
  })

  router.get('/reports/:organisationId/status-of-applications/download', (req, res) => {
    const filePath = downloadDirectoryPath + '/status-of-applications.csv'
    const statusData = StatisticsHelper.statusData

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'course', title: 'Course' })
    headers.push({ id: 'code', title: 'Course code' })
    headers.push({ id: 'provider', title: 'Partner organisation' })

    statuses.forEach((status, i) => {
      const header = {}
      header.id = status.code + '_number'
      header.title = status.title // + ' - number'
      headers.push(header)
    })

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    const records = []

    statusData.forEach((item, i) => {
      const data = {}

      data.course = item.title
      data.code = item.code
      data.provider = item.provider

      statuses.forEach((status, i) => {
        data[status.code + '_number'] = item[status.code].number
      })

      records.push(data)
    })

    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,'Status of applications')
      })
  })

  router.get('/reports/:organisationId/progress-of-applications/download', (req, res) => {
    const filePath = downloadDirectoryPath + '/progress-of-applications.csv'
    const conversionData = StatisticsHelper.conversionData

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'course', title: 'Course' })
    headers.push({ id: 'code', title: 'Course code' })
    headers.push({ id: 'provider', title: 'Partner organisation' })

    stages.forEach((stage, i) => {
      const headerNumber = {}
      headerNumber.id = stage.code + '_number'
      headerNumber.title = stage.title + ' - number'
      headers.push(headerNumber)

      const headerPercentage = {}
      headerPercentage.id = stage.code + '_percentage'
      headerPercentage.title = stage.title + ' - percentage'
      headers.push(headerPercentage)
    })

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    const records = []

    // the first row for the records is a description
    const description = {}
    description.course = ''
    description.code = ''
    description.provider = ''
    description.total_count = ''

    stages.forEach((stage, i) => {
      description[stage.code + '_number'] = stage.description
      description[stage.code + '_percentage'] = stage.description
    })

    records.push(description)

    // iterate over the conversion data to populate the CSV
    conversionData.forEach((item, i) => {
      const data = {}

      data.course = item.title
      data.code = item.code
      data.provider = item.provider
      data.total_count = item.total_count

      stages.forEach((stage, i) => {
        data[stage.code + '_number'] = item[stage.code].number
        data[stage.code + '_percentage'] = item[stage.code].percentage + '%'
      })

      records.push(data)
    })

    // write the CSV file and send to browser
    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,'Progress of applications')
      })
  })

}
