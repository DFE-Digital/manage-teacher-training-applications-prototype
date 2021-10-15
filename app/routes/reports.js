const archiver = require('archiver-promise')
const csvWriter = require('csv-writer').createObjectCsvWriter
const fs = require('fs')
const path = require('path')
const { DateTime } = require('luxon')

const downloadDirectoryPath = path.join(__dirname, '../data/downloads/')

const ReportsHelper = require('../data/helpers/reports')

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
  const fileName = 'candidate-sex_2020-to-2021_' + organisationName + '_' + DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss') + '.csv'
  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const sexData = ReportsHelper.getSexData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'sex', title: 'Sex' })
  headers.push({ id: 'receivedNumber', title: 'Number of candidates who applied in the group' })
  headers.push({ id: 'recruitedNumber', title: 'Number of candidates who were recruited in the group' })
  headers.push({ id: 'recruitedGroupPercent', title: 'Percentage of candidates recruited, out of those who applied in the group' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage of candidates recruited, out of the total recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  sexData.forEach((item, i) => {
    const data = {}
    data.sex = item.title
    data.receivedNumber = item.counts.received
    data.recruitedNumber = item.counts.recruited
    data.recruitedGroupPercent = item.rates.group
    data.recruitedPercent = item.rates.recruited
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeDisabilityData = (organisation, applications) => {
  const organisationName = slugify(organisation.name)
  const fileName = 'candidate-disability_2020-to-2021_' + organisationName + '_' + DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss') + '.csv'
  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const disabilityData = ReportsHelper.getDisabilityData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'disability', title: 'Disability' })
  headers.push({ id: 'description', title: 'Description of disability' })
  headers.push({ id: 'receivedNumber', title: 'Number of candidates who applied in the group' })
  headers.push({ id: 'recruitedNumber', title: 'Number of candidates who were recruited in the group' })
  headers.push({ id: 'recruitedGroupPercent', title: 'Percentage of candidates recruited, out of those who applied in the group' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage of candidates recruited, out of the total recruited' })

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
    data.receivedNumber = item.counts.received
    data.recruitedNumber = item.counts.recruited
    data.recruitedGroupPercent = item.rates.group
    data.recruitedPercent = item.rates.recruited
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeEthnicityData = (organisation, applications) => {
  const organisationName = slugify(organisation.name)
  const fileName = 'candidate-ethnicity_2020-to-2021_' + organisationName + '_' + DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss') + '.csv'
  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const ethnicityData = ReportsHelper.getEthnicityData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'ethnicGroup', title: 'Ethnic group' })
  headers.push({ id: 'ethnicBackground', title: 'Ethnic background' })
  headers.push({ id: 'receivedNumber', title: 'Number of candidates who applied in the group' })
  headers.push({ id: 'recruitedNumber', title: 'Number of candidates who were recruited in the group' })
  headers.push({ id: 'recruitedGroupPercent', title: 'Percentage of candidates recruited, out of those who applied in the group' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage of candidates recruited, out of the total recruited' })

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
    data.receivedNumber = parent.counts.received
    data.recruitedNumber = parent.counts.recruited
    data.recruitedGroupPercent = parent.rates.group
    data.recruitedPercent = parent.rates.recruited

    records.push(data)

    if (parent.items !== undefined) {
      parent.items.forEach((child, i) => {
        data = {}
        data.ethnicGroup = parent.title
        data.ethnicBackground = child.title
        data.receivedNumber = child.counts.received
        data.recruitedNumber = child.counts.recruited
        data.recruitedGroupPercent = child.rates.group
        data.recruitedPercent = child.rates.recruited
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
  const fileName = 'candidate-age_2020-to-2021_' + organisationName + '_' + DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss') + '.csv'
  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const ageData = ReportsHelper.getAgeData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'age', title: 'Age' })
  headers.push({ id: 'receivedNumber', title: 'Number of candidates who applied in the group' })
  headers.push({ id: 'recruitedNumber', title: 'Number of candidates who were recruited in the group' })
  headers.push({ id: 'recruitedGroupPercent', title: 'Percentage of candidates recruited, out of those who applied in the group' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage of candidates recruited, out of the total recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  ageData.forEach((item, i) => {
    const data = {}
    data.age = item.title
    data.receivedNumber = item.counts.received
    data.recruitedNumber = item.counts.recruited
    data.recruitedGroupPercent = item.rates.group
    data.recruitedPercent = item.rates.recruited
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

module.exports = router => {

  router.get('/reports', (req, res) => {
    const organisations = req.session.data.user.organisations

    res.render('reports/index', {
      organisations
    })
  })

  router.get('/reports/:organisationId/status-of-applications', (req, res) => {
    // console.log(req.session.data.user.organisations);
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    // console.log(organisation);
    const fileName = slugify(organisation.name)

    let statusData = ReportsHelper.getStatusData(fileName)
    const statusTotals = statusData.find(data => data.code === 'TOTAL')
    statusData = statusData.filter(data => data.code !== 'TOTAL')

    res.render('reports/status/index', {
      organisation,
      statuses,
      statusData,
      statusTotals
    })
  })

  router.get('/reports/:organisationId/status-of-applications/download', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = 'status-of-active-applications_' + organisationName + '_' + DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const statusData = ReportsHelper.getStatusData(organisationName)

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

    const attritionData = ReportsHelper.getAttritionData(fileName)

    res.render('reports/attrition/index', {
      organisation,
      attritionData
    })
  })

  router.get('/reports/:organisationId/candidate-drop-out/download', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = 'when-candidates-choose-to-leave-the-application-process_' + organisationName + '_' + DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss') + '.csv'
    const filePath = downloadDirectoryPath + fileName

    const attritionData = ReportsHelper.getAttritionData(organisationName)

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

    let course = ReportsHelper.getAttritionData(fileName)
    course = course.find(course => course.code === req.params.courseId)

    res.render('reports/attrition/show', {
      organisation,
      course,
      statuses
    })
  })

  router.get('/reports/:organisationId/diversity/cycle/:cycle', (req, res) => {
    const cycle = req.params.cycle
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const applications = req.session.data.applications.filter(app => app.provider === organisation.name) //  && app.cycle === '2020 to 2021'

    // use application count as a proxy for candidate count
    const candidateCount = applications.length
    const recruitedCount = applications.filter(app => app.status === 'Recruited').length
    const questionnaireCount = applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes').length
    const questionnairePercentage = Math.round((questionnaireCount/candidateCount) * 100)

    const ethnicityData = ReportsHelper.getEthnicityData(applications)
    const ageData = ReportsHelper.getAgeData(applications)
    const sexData = ReportsHelper.getSexData(applications)
    const disabilityData = ReportsHelper.getDisabilityData(applications)
    const questionnaireResponseData = ReportsHelper.getDiversityQuestionnaireResponseCounts(applications)
    const disabilityResponseData = ReportsHelper.getDisabilityQuestionResponseCounts(applications)

    res.render('reports/diversity/index', {
      organisation,
      cycle,
      questionnaireResponseData,
      ethnicityData,
      ageData,
      sexData,
      disabilityData,
      disabilityResponseData,
      candidateCount,
      recruitedCount,
      questionnaireCount,
      questionnairePercentage
    })
  })

  router.get('/reports/:organisationId/diversity/cycle/:cycle/download', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)
    const fileName = 'sex-disability-ethnicity-and-age-of-candidates_2020-to-2021_' + organisationName + '_' + DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss') + '.zip'
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
        res.download(filePath, fileName, (error) => {
          if (error) {
            console.error(error)
          }
          const filePaths = []
          filePaths.push(sexData.filePath)
          filePaths.push(disabilityData.filePath)
          filePaths.push(ethnicityData.filePath)
          filePaths.push(ageData.filePath)
          filePaths.push(filePath)

          filePaths.forEach((filePath, i) => {
            try {
              fs.unlinkSync(filePath)
            } catch (error) {
              console.error(error)
            }
          })
        })
        console.log('Done')
      })
  })

  router.get('/reports/export', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    res.render('reports/applications/index', {
      organisation
    })
  })

  router.get('/reports/hesa', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    res.render('reports/hesa/index', {
      organisation
    })
  })

}
