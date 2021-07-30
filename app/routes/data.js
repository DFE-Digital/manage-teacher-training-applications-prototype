const csvWriter = require('csv-writer').createObjectCsvWriter
const path = require('path')

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
  { code: 'awaiting_conditions', title: 'Awaiting conditions' },
  { code: 'ready_to_enroll', title: 'Ready to enrol' }
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
      { code: 'offer_conversion', title: 'Offers which led to candidate being ready to enroll', description: ''},
      { code: 'overall_conversion', title: 'Applications which led to candidate being ready to enroll', description: ''}
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
    const filePath = downloadDirectoryPath + '/candidate-drop-out.csv'

    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const fileName = slugify(organisation.name)

    const attritionData = StatisticsHelper.getAttritionData(fileName)

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'course', title: 'Course' })
    headers.push({ id: 'code', title: 'Course code' })
    headers.push({ id: 'provider', title: 'Partner organisation' })
    headers.push({ id: 'applications_total', title: 'Applications total'})
    headers.push({ id: 'applications_withdrawn_percentage', title: 'Applications withdrawn - percentage'})
    headers.push({ id: 'applications_withdrawn_number', title: 'Applications withdrawn - number'})
    headers.push({ id: 'offers_total', title: 'Offers total'})
    headers.push({ id: 'offers_declined_percentage', title: 'Offers declined - percentage'})
    headers.push({ id: 'offers_declined_number', title: 'Offers declined - number'})
    headers.push({ id: 'offers_accepted_total', title: 'Offers accepted total'})
    headers.push({ id: 'conditions_not_met_percentage', title: 'Accepted offers with conditions not met - percentage'})
    headers.push({ id: 'conditions_not_met_number', title: 'Accepted offers with conditions not met - number'})

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

      data.applications_total = Math.round((item.applications_withdrawn.number / item.applications_withdrawn.percentage) * 100)

      data.applications_withdrawn_number = item.applications_withdrawn.number
      data.applications_withdrawn_percentage = item.applications_withdrawn.percentage + '%'

      data.offers_total = Math.round((item.offers_declined.number / item.offers_declined.percentage) * 100)

      data.offers_declined_number = item.offers_declined.number
      data.offers_declined_percentage = item.offers_declined.percentage + '%'

      data.offers_accepted_total = Math.round((item.conditions_not_met.number / item.conditions_not_met.percentage) * 100)

      data.conditions_not_met_number = item.conditions_not_met.number
      data.conditions_not_met_percentage = item.conditions_not_met.percentage + '%'

      records.push(data)
    })

    // write the CSV file and send to browser
    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,'candidate-drop-out.csv')
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

  router.get('/reports/:organisationId/export', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    res.render('data/export/index', {
      organisation
    })
  })

  router.get('/reports/:organisationId/hesa', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    res.render('data/export/hesa', {
      organisation
    })
  })

  router.get('/reports/:organisationId/status-of-applications/download', (req, res) => {
    const filePath = downloadDirectoryPath + '/status-of-applications.csv'

    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const fileName = slugify(organisation.name)

    const statusData = StatisticsHelper.getStatusData(fileName)

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
        res.download(filePath,'status-of-applications.csv')
      })
  })

  router.get('/reports/:organisationId/progress-of-applications/download', (req, res) => {
    const filePath = downloadDirectoryPath + '/progress-of-applications.csv'

    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)

    const fileName = slugify(organisation.name)

    const conversionData = StatisticsHelper.getConversionData(fileName)

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
        res.download(filePath,'progress-of–applications.csv')
      })
  })

}
