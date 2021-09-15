const archiver = require('archiver-promise')
const csvWriter = require('csv-writer').createObjectCsvWriter
const fs = require('fs')
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

const writeSexData = (organisation, applications) => {
  const organisationName = slugify(organisation.name)
  const fileName = '/candidate-diversity-sex-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const sexData = StatisticsHelper.getSexData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'sex', title: 'Sex' })
  headers.push({ id: 'received', title: 'Candidates applied' })
  headers.push({ id: 'recruited', title: 'Candidates recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  sexData.forEach((item, i) => {
    const data = {}
    data.sex = item.title
    data.received = item.counts.received
    data.recruited = item.counts.recruited
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeDisabilityData = (organisation, applications) => {
  const organisationName = slugify(organisation.name)
  const fileName = '/candidate-diversity-disability-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const disabilityData = StatisticsHelper.getDisabilityData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'disability', title: 'Disability' })
  headers.push({ id: 'description', title: 'Description' })
  headers.push({ id: 'received', title: 'Candidates applied' })
  headers.push({ id: 'recruited', title: 'Candidates recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  disabilityData.forEach((item, i) => {
    const data = {}
    data.disability = item.title
    data.description = item.description
    data.received = item.counts.received
    data.recruited = item.counts.recruited
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeEthnicityData = (organisation, applications) => {
  const organisationName = slugify(organisation.name)
  const fileName = '/candidate-diversity-ethnicity-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const ethnicityData = StatisticsHelper.getEthnicityData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'ethnicGroup', title: 'Ethnic group' })
  headers.push({ id: 'ethnicBackground', title: 'Ethnic background' })
  headers.push({ id: 'received', title: 'Candidates applied' })
  headers.push({ id: 'recruited', title: 'Candidates recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  ethnicityData.forEach((parent, i) => {
    let data = {}
    data.ethnicGroup = parent.title
    data.ethnicBackground = ''
    data.received = parent.counts.received
    data.recruited = parent.counts.recruited
    records.push(data)

    if (parent.items !== undefined) {
      parent.items.forEach((child, i) => {
        data = {}
        data.ethnicGroup = parent.title
        data.ethnicBackground = child.title
        data.received = child.counts.received
        data.recruited = child.counts.recruited
        records.push(data)
      })
    }
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeAgeData = (organisation, applications) => {
  const organisationName = slugify(organisation.name)
  const fileName = '/candidate-diversity-age-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const ageData = StatisticsHelper.getAgeData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'age', title: 'Age' })
  headers.push({ id: 'received', title: 'Candidates applied' })
  headers.push({ id: 'recruited', title: 'Candidates recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  ageData.forEach((item, i) => {
    const data = {}
    data.age = item.title
    data.received = item.counts.received
    data.recruited = item.counts.recruited
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

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
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = '/status-of-applications-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

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
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = '/candidate-drop-out-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const attritionData = StatisticsHelper.getAttritionData(organisationName)

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'course', title: 'Course' })
    headers.push({ id: 'code', title: 'Course code' })
    headers.push({ id: 'provider', title: 'Partner organisation' })
    headers.push({ id: 'applications_total', title: 'Total applications'})
    headers.push({ id: 'before_offer_percentage', title: 'Before offer made (applications withdrawn) - percentage'})
    headers.push({ id: 'before_offer_number', title: 'Before offer made (applications withdrawn) - number'})
    // headers.push({ id: 'offers_total_percentage', title: 'Offers total - percentage'})
    headers.push({ id: 'offers_total_number', title: 'Total offers'})
    headers.push({ id: 'during_offer_percentage', title: 'While offer being considered (offers declined and applications withdrawn) - percentage'})
    headers.push({ id: 'during_offer_number', title: 'While offer being considered (offers declined and applications withdrawn) - number'})
    headers.push({ id: 'accepted_offers_total_number', title: 'Total accepted offers'})
    headers.push({ id: 'after_offer_percentage', title: 'After offer accepted (applications withdrawn) - percentage'})
    headers.push({ id: 'after_offer_number', title: 'After offer accepted (applications withdrawn) - number'})

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

      data.before_offer_number = item.before_offer.number
      data.before_offer_percentage = item.before_offer.percentage + '%'

      data.offers_total_number = item.total_offers.number
      // data.offers_total_percentage = item.total_offers.percentage + '%'

      data.during_offer_number = item.during_offer.number
      data.during_offer_percentage = item.during_offer.percentage + '%'

      data.accepted_offers_total_number = item.total_offers.number - item.during_offer.number

      data.after_offer_number = item.after_offer.number
      data.after_offer_percentage = item.after_offer.percentage + '%'

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

    const applications = req.session.data.applications.filter(app => app.provider === organisation.name) //  && app.cycle === '2020 to 2021'

    // use application count as a proxy for candidate count
    const candidateCount = applications.length
    const questionnaireCount = applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes').length
    const questionnairePercentage = Math.round((questionnaireCount/candidateCount) * 100)

    const ethnicityData = StatisticsHelper.getEthnicityData(applications)
    const ageData = StatisticsHelper.getAgeData(applications)
    const sexData = StatisticsHelper.getSexData(applications)
    const disabilityData = StatisticsHelper.getDisabilityData(applications)
    const questionnaireResponseData = StatisticsHelper.getDiversityQuestionnaireResponseCounts(applications)
    const disabilityResponseData = StatisticsHelper.getDisabilityQuestionResponseCounts(applications)

    res.render('data/statistics/diversity/index', {
      organisation,
      questionnaireResponseData,
      ethnicityData,
      ageData,
      sexData,
      disabilityData,
      disabilityResponseData,
      candidateCount,
      questionnaireCount,
      questionnairePercentage
    })
  })

  router.get('/reports/:organisationId/diversity/download', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = '/candidate-diversity-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.zip'
    const filePath = downloadDirectoryPath + fileName

    const sexData = writeSexData(organisation, req.session.data.applications)
    const disabilityData = writeDisabilityData(organisation, req.session.data.applications)
    const ethnicityData = writeEthnicityData(organisation, req.session.data.applications)
    const ageData = writeAgeData(organisation, req.session.data.applications)

    // create archive file
    const archive = archiver(filePath, {
      store: true
    })

    // populate the archive with data
    archive.file(sexData.filePath, { name: sexData.fileName })
    archive.file(disabilityData.filePath, { name: disabilityData.fileName })
    archive.file(ethnicityData.filePath, { name: ethnicityData.fileName })
    archive.file(ageData.filePath, { name: ageData.fileName })

    // send archive to browser
    archive.finalize()
      .then(() => {
        res.download(filePath,fileName)
        console.log('Done')
      })

  })

  router.get('/reports/:organisationId/diversity/download/sex', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = '/candidate-diversity-sex-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const applications = req.session.data.applications.filter(app => app.provider === organisation.name)
    const sexData = StatisticsHelper.getSexData(applications)

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'sex', title: 'Sex' })
    headers.push({ id: 'received', title: 'Candidates applied' })
    headers.push({ id: 'recruited', title: 'Candidates recruited' })

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    // content for the CSV file
    const records = []

    sexData.forEach((item, i) => {
      const data = {}
      data.sex = item.title
      data.received = item.counts.received
      data.recruited = item.counts.recruited
      records.push(data)
    })

    // write the CSV file and send to browser
    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,fileName)
      })
  })

  router.get('/reports/:organisationId/diversity/download/disability', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = '/candidate-diversity-disability-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const applications = req.session.data.applications.filter(app => app.provider === organisation.name)
    const disabilityData = StatisticsHelper.getDisabilityData(applications)

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'disability', title: 'Disability' })
    headers.push({ id: 'description', title: 'Description' })
    headers.push({ id: 'received', title: 'Candidates applied' })
    headers.push({ id: 'recruited', title: 'Candidates recruited' })

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    // content for the CSV file
    const records = []

    disabilityData.forEach((item, i) => {
      const data = {}
      data.disability = item.title
      data.description = item.description
      data.received = item.counts.received
      data.recruited = item.counts.recruited
      records.push(data)
    })

    // write the CSV file and send to browser
    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,fileName)
      })
  })

  router.get('/reports/:organisationId/diversity/download/ethnicity', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = '/candidate-diversity-ethnicity-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const applications = req.session.data.applications.filter(app => app.provider === organisation.name)
    const ethnicityData = StatisticsHelper.getEthnicityData(applications)

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'ethnicGroup', title: 'Ethnic group' })
    headers.push({ id: 'ethnicBackground', title: 'Ethnic background' })
    headers.push({ id: 'received', title: 'Candidates applied' })
    headers.push({ id: 'recruited', title: 'Candidates recruited' })

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    // content for the CSV file
    const records = []

    ethnicityData.forEach((parent, i) => {
      let data = {}
      data.ethnicGroup = parent.title
      data.ethnicBackground = ''
      data.received = parent.counts.received
      data.recruited = parent.counts.recruited
      records.push(data)

      if (parent.items !== undefined) {
        parent.items.forEach((child, i) => {
          data = {}
          data.ethnicGroup = parent.title
          data.ethnicBackground = child.title
          data.received = child.counts.received
          data.recruited = child.counts.recruited
          records.push(data)
        })
      }
    })

    // write the CSV file and send to browser
    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,fileName)
      })
  })

  router.get('/reports/:organisationId/diversity/download/age', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = '/candidate-diversity-age-' + organisationName + '-' + DateTime.now().toFormat('yyyy-LL-dd-HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const applications = req.session.data.applications.filter(app => app.provider === organisation.name)
    const ageData = StatisticsHelper.getAgeData(applications)

    // headers for the CSV file
    const headers = []
    headers.push({ id: 'age', title: 'Age' })
    headers.push({ id: 'received', title: 'Candidates applied' })
    headers.push({ id: 'recruited', title: 'Candidates recruited' })

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    // content for the CSV file
    const records = []

    ageData.forEach((item, i) => {
      const data = {}
      data.age = item.title
      data.received = item.counts.received
      data.recruited = item.counts.recruited
      records.push(data)
    })

    // write the CSV file and send to browser
    csv.writeRecords(records)
      .then(() => {
        res.download(filePath,fileName)
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
