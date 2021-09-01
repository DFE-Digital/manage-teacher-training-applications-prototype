const csvWriter = require('csv-writer').createObjectCsvWriter
const path = require('path')
const { DateTime } = require('luxon')

const downloadDirectoryPath = path.join(__dirname, '../data/downloads')

const StatisticsHelper = require('../data/helpers/statistics')

const slugify = (text) => {
  return text.trim()
    .toLowerCase()
    // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
    .replace(/[^\w\s-]/g, '')
    // swap any length of whitespace, underscore, hyphen characters with a single -
    .replace(/[\s_-]+/g, '-')
    // remove leading, trailing -
    .replace(/^-+|-+$/g, '')
}

const statuses = [
  { code: 'received', title: 'Received' },
  { code: 'interviewing', title: 'Interviewing' },
  { code: 'offered', title: 'Offered' },
  { code: 'conditions_pending', title: 'Conditions pending' },
  { code: 'recruited', title: 'Recruited' }
]

const stages = [
  { code: 'shortlist_for_interview', title: 'Invited to interview', description: 'Applications which led to interviews' },
  { code: 'interview_success', title: 'Made offer after interview', description: 'Interviews which led to offers'},
  { code: 'offer', title: 'Made offer', description: 'Applications which led to offers'},
  { code: 'acceptance', title: 'Accepted offer', description: 'Offers which led to candidate accepting'},
  { code: 'conditions_met', title: 'Met offer conditions', description: 'Accepted offers which led to conditions being met'},
  { code: 'offer_conversion', title: 'Successful offer', description: 'Offers which led to candidate being recruited'},
  { code: 'overall_conversion', title: 'Successful application', description: 'Applications which led to candidate being recruited'}
]

module.exports = router => {

  router.get('/reports', (req, res) => {
    const organisations = req.session.data.user.organisations

    res.render('data/index', {
      organisations
    })
  })

  router.get('/reports/:organisationId/status-of-applications', (req, res) => {
    // console.log(req.session.data.user.organisations);
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    // console.log(organisation);
    const fileName = slugify(organisation.name)

    let statusData = StatisticsHelper.getStatusData(fileName)
    const statusTotals = statusData.find(data => data.code === 'TOTAL')
    statusData = statusData.filter(data => data.code !== 'TOTAL')

    res.render('data/statistics/status/index', {
      organisation,
      statuses,
      statusData,
      statusTotals
    })
  })

  router.get('/reports/:organisationId/progress-of-applications', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const fileName = slugify(organisation.name)

    const conversionData = StatisticsHelper.getConversionData(fileName)

    res.render('data/statistics/progress', {
      organisation,
      stages,
      conversionData
    })
  })

  router.get('/reports/:organisationId/candidate-success', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const fileName = slugify(organisation.name)

    const conversionData = StatisticsHelper.getConversionData(fileName)

    res.render('data/statistics/conversion/index', {
      organisation,
      stages,
      conversionData
    })
  })

  router.get('/reports/:organisationId/candidate-success/:courseId', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const stages = [
      { code: 'shortlist_for_interview', title: 'Applications which led to interviews', description: '' },
      { code: 'interview_success', title: 'Interviews which led to offers', description: ''},
      { code: 'offer', title: 'Applications which led to offers', description: ''},
      { code: 'acceptance', title: 'Offers which led to candidate acceptingr', description: ''},
      { code: 'conditions_met', title: 'Accepted offers which led to conditions being met', description: ''},
      { code: 'offer_conversion', title: 'Offers which led to candidate being recruited', description: ''},
      { code: 'overall_conversion', title: 'Applications which led to candidate being recruited', description: ''}
    ]

    const fileName = slugify(organisation.name)

    let course = StatisticsHelper.getConversionData(fileName)
    course = course.find(course => course.code === req.params.courseId)

    res.render('data/statistics/conversion/show', {
      organisation,
      course,
      stages
    })
  })

  router.get('/reports/:organisationId/candidate-drop-out', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const fileName = slugify(organisation.name)

    const attritionData = StatisticsHelper.getAttritionData(fileName)

    res.render('data/statistics/attrition/index', {
      organisation,
      stages,
      attritionData
    })
  })

  router.get('/reports/:organisationId/candidate-drop-out/download', (req, res) => {
    const fileName = '/candidate-drop-out-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + '/candidate-drop-out.csv'

    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const organisationSlug = slugify(organisation.name)

    const attritionData = StatisticsHelper.getAttritionData(organisationSlug)

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'course', title: 'Course' })
    headers.push({ id: 'code', title: 'Course code' })
    headers.push({ id: 'provider', title: 'Partner organisation' })
    headers.push({ id: 'applications_total', title: 'Applications total'})
    headers.push({ id: 'applications_withdrawn_before_percentage', title: 'Applications withdrawn before offer made - percentage'})
    headers.push({ id: 'applications_withdrawn_before_number', title: 'Applications withdrawn before offer made - number'})
    headers.push({ id: 'offers_total_percentage', title: 'Offers total - percentage'})
    headers.push({ id: 'offers_total_number', title: 'Offers total - number'})
    headers.push({ id: 'applications_withdrawn_after_percentage', title: 'Offers declined and applications withdrawn after offer made - percentage'})
    headers.push({ id: 'applications_withdrawn_after_number', title: 'Offers declined and applications withdrawn after offer made - number'})

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    const records = []

    // iterate over the data to populate the CSV
    attritionData.forEach((item, i) => {
      const data = {}

      data.course = item.title
      data.code = item.code
      data.provider = item.provider

      data.applications_total = item.total_applications

      data.applications_withdrawn_before_number = item.applications_withdrawn_before.number
      data.applications_withdrawn_before_percentage = item.applications_withdrawn_before.percentage + '%'

      data.offers_total_number = item.total_offers.number
      data.offers_total_percentage = item.total_offers.percentage + '%'

      data.applications_withdrawn_after_number = item.applications_withdrawn_after.number
      data.applications_withdrawn_after_percentage = item.applications_withdrawn_after.percentage + '%'

      records.push(data)
    })

    // write the CSV file and send to browser
    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,fileName)
      })
  })

  router.get('/reports/:organisationId/candidate-drop-out/:courseId', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const statuses = [
      { code: 'rejections', title: 'Applications that led to rejection', description: '' },
      { code: 'interview_rejections', title: 'Interviews that led to rejection', description: ''},
      { code: 'applications_withdrawn', title: 'Applications that led to being withdrawn', description: ''},
      { code: 'offers_withdrawn', title: 'Offers that were withdrawn', description: ''},
      { code: 'offers_declined', title: 'Offers that were declined', description: ''},
      { code: 'conditions_not_met', title: 'Accepted offers that led to candidates not meeting one or more conditions', description: ''}
    ]

    const fileName = slugify(organisation.name)

    let course = StatisticsHelper.getAttritionData(fileName)
    course = course.find(course => course.code === req.params.courseId)

    res.render('data/statistics/attrition/show', {
      organisation,
      course,
      statuses
    })
  })

  router.get('/reports/export', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    res.render('data/export/index', {
      organisation
    })
  })

  router.get('/reports/hesa', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    res.render('data/export/hesa', {
      organisation
    })
  })

  router.get('/reports/:organisationId/status-of-applications/download', (req, res) => {
    const fileName = '/status-of-applications-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const organisationName = slugify(organisation.name)

    const statusData = StatisticsHelper.getStatusData(organisationName)

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
        res.download(filePath,fileName)
      })
  })

  router.get('/reports/:organisationId/progress-of-applications/download', (req, res) => {
    const fileName = '/progress-of-applications-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const organisationName = slugify(organisation.name)

    const conversionData = StatisticsHelper.getConversionData(organisationName)

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'course', title: 'Course' })
    headers.push({ id: 'code', title: 'Course code' })
    headers.push({ id: 'provider', title: 'Partner organisation' })

    stages.forEach((stage, i) => {
      const headerNumber = {}
      headerNumber.id = stage.code + '_number'
      // headerNumber.title = stage.title + ' - number'
      headerNumber.title = stage.description + ' - number'
      headers.push(headerNumber)

      const headerPercentage = {}
      headerPercentage.id = stage.code + '_percentage'
      // headerPercentage.title = stage.title + ' - percentage'
      headerPercentage.title = stage.description + ' - percentage'
      headers.push(headerPercentage)
    })

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    const records = []

    // the first row for the records is a description
    // const description = {}
    // description.course = ''
    // description.code = ''
    // description.provider = ''
    // description.total_count = ''
    //
    // stages.forEach((stage, i) => {
    //   description[stage.code + '_number'] = stage.description
    //   description[stage.code + '_percentage'] = stage.description
    // })
    //
    // records.push(description)

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
        res.download(filePath,fileName)
      })
  })

}
