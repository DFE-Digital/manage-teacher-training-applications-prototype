const archiver = require('archiver-promise')
const csvWriter = require('csv-writer').createObjectCsvWriter
const fs = require('fs')
const path = require('path')
const { DateTime } = require('luxon')

const downloadDirectoryPath = path.join(__dirname, '../data/downloads/')

const CycleHelper = require('../data/helpers/cycles')
const ReportHelper = require('../data/helpers/reports')

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

const writeSexData = (organisation, applications, cycleName) => {
  const organisationName = slugify(organisation.name)

  let fileName = 'candidate-sex_'
  fileName += cycleName + '_'
  fileName += organisationName + '_'
  fileName += DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss')
  fileName += '.csv'

  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const sexData = ReportHelper.getSexData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'sex', title: 'Sex' })
  headers.push({ id: 'receivedNumber', title: 'Applied' })
  headers.push({ id: 'recruitedNumber', title: 'Recruited' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  sexData.items.forEach((item, i) => {
    const data = {}
    data.sex = item.title
    data.receivedNumber = item.counts.received
    data.recruitedNumber = item.counts['Recruited']
    data.recruitedPercent = item.rates['Recruited']
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeDisabilityReponseCountsData = (organisation, applications, cycleName) => {
  const organisationName = slugify(organisation.name)

  let fileName = 'candidate-disability-response-counts_'
  fileName += cycleName + '_'
  fileName += organisationName + '_'
  fileName += DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss')
  fileName += '.csv'

  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const disabilityData = ReportHelper.getDisabilityQuestionResponseCounts(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'disability', title: 'Candidate is disabled' })
  headers.push({ id: 'receivedNumber', title: 'Applied' })
  headers.push({ id: 'recruitedNumber', title: 'Recruited' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  disabilityData.items.forEach((item, i) => {
    const data = {}
    data.disability = item.title
    data.receivedNumber = item.counts.received
    data.recruitedNumber = item.counts['Recruited']
    data.recruitedPercent = item.rates['Recruited']
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeDisabilityData = (organisation, applications, cycleName) => {
  const organisationName = slugify(organisation.name)

  let fileName = 'candidate-disability_'
  fileName += cycleName + '_'
  fileName += organisationName + '_'
  fileName += DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss')
  fileName += '.csv'

  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const disabilityData = ReportHelper.getDisabilityData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'disability', title: 'Disability' })
  headers.push({ id: 'description', title: 'Description of disability' })
  headers.push({ id: 'receivedNumber', title: 'Applied' })
  headers.push({ id: 'recruitedNumber', title: 'Recruited' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  disabilityData.items.forEach((item, i) => {
    const data = {}
    data.disability = item.title
    data.description = item.description
    data.receivedNumber = item.counts.received
    data.recruitedNumber = item.counts['Recruited']
    data.recruitedPercent = item.rates['Recruited']
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeEthnicityData = (organisation, applications, cycleName) => {
  const organisationName = slugify(organisation.name)

  let fileName = 'candidate-ethnicity_'
  fileName += cycleName + '_'
  fileName += organisationName + '_'
  fileName += DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss')
  fileName += '.csv'

  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const ethnicityData = ReportHelper.getEthnicityData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'ethnicGroup', title: 'Ethnic group' })
  headers.push({ id: 'ethnicBackground', title: 'Ethnic background' })
  headers.push({ id: 'receivedNumber', title: 'Applied' })
  headers.push({ id: 'recruitedNumber', title: 'Recruited' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  ethnicityData.items.forEach((parent, i) => {
    let data = {}
    data.ethnicGroup = parent.title
    data.ethnicBackground = ''
    data.receivedNumber = parent.counts.received
    data.recruitedNumber = parent.counts['Recruited']
    data.recruitedPercent = parent.rates['Recruited']

    records.push(data)

    if (parent.items !== undefined) {
      parent.items.forEach((child, i) => {
        data = {}
        data.ethnicGroup = parent.title
        data.ethnicBackground = child.title
        data.receivedNumber = child.counts.received
        data.recruitedNumber = child.counts['Recruited']
        data.recruitedPercent = child.rates['Recruited']
        records.push(data)
      })
    }
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeAgeData = (organisation, applications, cycleName) => {
  const organisationName = slugify(organisation.name)

  let fileName = 'candidate-age_'
  fileName += cycleName + '_'
  fileName += organisationName + '_'
  fileName += DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss')
  fileName += '.csv'

  const filePath = downloadDirectoryPath + fileName

  const apps = applications.filter(app => app.provider === organisation.name)
  const ageData = ReportHelper.getAgeData(apps)

  // headers for the CSV file
  const headers = []
  headers.push({ id: 'age', title: 'Age' })
  headers.push({ id: 'receivedNumber', title: 'Applied' })
  headers.push({ id: 'recruitedNumber', title: 'Recruited' })
  headers.push({ id: 'recruitedPercent', title: 'Percentage recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  ageData.items.forEach((item, i) => {
    const data = {}
    data.age = item.title
    data.receivedNumber = item.counts.received
    data.recruitedNumber = item.counts['Recruited']
    data.recruitedPercent = item.rates['Recruited']
    records.push(data)
  })

  // write the CSV file and send to browser
  csv.writeRecords(records)

  return { filePath, fileName }
}

const writeDiversityReadMe = (organisation, applications, cycleName) => {
  const organisationName = slugify(organisation.name)

  let fileName = 'about-this-data_'
  fileName += cycleName + '_'
  fileName += organisationName + '_'
  fileName += DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss')
  fileName += '.txt'

  const candidateCount = applications.filter(app => app.provider === organisation.name).length
  const questionnaireCount = applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes').length
  const questionnairePercentage = Math.round((questionnaireCount/candidateCount) * 100)

  const filePath = downloadDirectoryPath + fileName

  let content = 'Sex, disability, ethnicity and age of candidates\n\n'
  content += 'About this data\n\n'
  content += 'The sex, disability and ethnicity data comes from ' + questionnaireCount + ' candidates who filled in a questionnaire when they applied. This is ' + questionnairePercentage + '% of the total candidates.\n\n'
  content += 'Candidates are asked to select a general ethnic group, such as ‘Asian or Asian British’. They can also select ‘prefer not to say’. If they select a general group then they can also select a more specific group such as ‘Bangladeshi’.\n\n'
  content += 'Candidates who say that they have a disability are asked about the type of disability. They can select more than one type.\n\n'
  content += 'The age data is from all ' + candidateCount + ' candidates. It’s based on each candidate’s age on ' + DateTime.fromJSDate(CycleHelper.CURRENT_CYCLE.ageCalculationDate).toFormat('d MMMM yyyy') + '.'

  fs.writeFile(filePath, content, err => {
    if (err) {
      console.error(err)
      return
    }
  })

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
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const fileName = slugify(organisation.name)

    let statusData = ReportHelper.getStatusData(fileName)
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

    const statusData = ReportHelper.getStatusData(organisationName)

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

    const attritionData = ReportHelper.getAttritionData(fileName)

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

    const attritionData = ReportHelper.getAttritionData(organisationName)

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

    let course = ReportHelper.getAttritionData(fileName)
    course = course.find(course => course.code === req.params.courseId)

    res.render('reports/attrition/show', {
      organisation,
      course,
      statuses
    })
  })

  router.get('/reports/:organisationId/diversity/cycle/:cycle', (req, res) => {
    let cycleData = req.session.data.currentCycle
    if (req.session.data.previousCycle.code === req.params.cycle) {
      cycleData = req.session.data.previousCycle
    }

    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const applications = req.session.data.applications.filter(app => app.provider === organisation.name && app.cycle === cycleData.code)

    // use application count as a proxy for candidate count
    const candidateCount = applications.length
    const recruitedCount = applications.filter(app => app.status === 'Recruited').length
    const questionnaireCount = applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes').length
    const questionnairePercentage = Math.round((questionnaireCount/candidateCount) * 100)

    const ethnicityData = ReportHelper.getEthnicityData(applications)
    const ageData = ReportHelper.getAgeData(applications)
    const sexData = ReportHelper.getSexData(applications)
    const disabilityData = ReportHelper.getDisabilityData(applications)
    const questionnaireResponseData = ReportHelper.getDiversityQuestionnaireResponseCounts(applications)
    const disabilityResponseData = ReportHelper.getDisabilityQuestionResponseCounts(applications)

    res.render('reports/diversity/index', {
      organisation,
      cycleData,
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
    let cycleData = req.session.data.currentCycle
    if (req.session.data.previousCycle.code === req.params.cycle) {
      cycleData = req.session.data.previousCycle
    }

    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    const organisationName = slugify(organisation.name)

    const applications = req.session.data.applications.filter(app => app.provider === organisation.name && app.cycle === cycleData.code)

    const cycleName = slugify(req.params.cycle)

    let fileName = 'sex-disability-ethnicity-and-age-of-candidates_'
    fileName += cycleName + '_'
    fileName += organisationName + '_'
    fileName += DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss')
    fileName += '.zip'

    console.log(fileName);

    const filePath = downloadDirectoryPath + fileName

    const sexData = writeSexData(organisation, applications, cycleName)
    const disabilityResponseCountsData = writeDisabilityReponseCountsData(organisation, applications, cycleName)
    const disabilityData = writeDisabilityData(organisation, applications, cycleName)
    const ethnicityData = writeEthnicityData(organisation, applications, cycleName)
    const ageData = writeAgeData(organisation, applications, cycleName)

    const readme = writeDiversityReadMe(organisation, applications, cycleName)

    // create archive file
    const archive = archiver(filePath, {
      store: true
    })

    // populate the archive with data
    archive.file(sexData.filePath, { name: sexData.fileName })
    archive.file(disabilityResponseCountsData.filePath, { name: disabilityResponseCountsData.fileName })
    archive.file(disabilityData.filePath, { name: disabilityData.fileName })
    archive.file(ethnicityData.filePath, { name: ethnicityData.fileName })
    archive.file(ageData.filePath, { name: ageData.fileName })
    archive.file(readme.filePath, { name: readme.fileName })

    // send archive to browser
    archive.finalize()
      .then(() => {
        res.download(filePath, fileName, (error) => {
          if (error) {
            console.error(error)
          }
          const filePaths = []
          filePaths.push(sexData.filePath)
          filePaths.push(disabilityResponseCountsData.filePath)
          filePaths.push(disabilityData.filePath)
          filePaths.push(ethnicityData.filePath)
          filePaths.push(ageData.filePath)
          filePaths.push(readme.filePath)
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
    const cycleItems = CycleHelper.getCycleOptions(req.session.data.export_cycle)
    res.render('reports/applications/index', {
      organisation,
      cycleItems
    })
  })

  router.get('/reports/hesa', (req, res) => {
    const organisation = req.session.data.user.organisations.find(org => org.id === req.params.organisationId)
    res.render('reports/hesa/index', {
      organisation
    })
  })

}
