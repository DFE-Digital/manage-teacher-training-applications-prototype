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

  router.get('/reports/:organisationId/candidate-drop-out', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const fileName = slugify(organisation.name)

    const attritionData = StatisticsHelper.getAttritionData(fileName)

    res.render('data/statistics/attrition/index', {
      organisation,
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

    const fileName = slugify(organisation.name)

    let course = StatisticsHelper.getAttritionData(fileName)
    course = course.find(course => course.code === req.params.courseId)

    res.render('data/statistics/attrition/show', {
      organisation,
      course,
      statuses
    })
  })

  router.get('/reports/:organisationId/diversity', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const ethnicityData = [
      {title: 'All'},
      {title: 'Asian', items: ['Bangladeshi', 'Indian', 'Pakistani', 'Asian other']},
      {title: 'Black', items: ['Black african', 'Black Caribbean', 'Black other']},
      {title: 'Mixed', items: ['Mixed White/Asian', 'Mixed White/Black African', 'Mixed White/Black Caribbean', 'Mixed other']},
      {title: 'White', items: ['White British', 'White Irish', 'White other']},
      {title: 'Other', items: ['Arab', 'Any other']}
    ]
    const ageData = ['18 to 24', '25 to 34', '35 to 44', '45 to 54', '55 to 64', '65 and older', 'Prefer not to say']
    const sexData = ['Female', 'Male', 'Prefer not to say']

    res.render('data/statistics/diversity/index', {
      organisation,
      ethnicityData,
      ageData,
      sexData
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

}
