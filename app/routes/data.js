const archiver = require('archiver')
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
  headers.push({ id: 'received', title: 'Received' })
  headers.push({ id: 'recruited', title: 'Recruited' })

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
  headers.push({ id: 'received', title: 'Received' })
  headers.push({ id: 'recruited', title: 'Recruited' })

  const csv = csvWriter({
    path: filePath,
    header: headers
  })

  // content for the CSV file
  const records = []

  disabilityData.forEach((item, i) => {
    const data = {}
    data.disability = item.title
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
  headers.push({ id: 'received', title: 'Received' })
  headers.push({ id: 'recruited', title: 'Recruited' })

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
  headers.push({ id: 'received', title: 'Received' })
  headers.push({ id: 'recruited', title: 'Recruited' })

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

    const applications = req.session.data.applications.filter(app => app.provider === organisation.name)

    const ethnicityData = StatisticsHelper.getEthnicityData(applications)
    const ageData = StatisticsHelper.getAgeData(applications)
    const sexData = StatisticsHelper.getSexData(applications)
    const disabilityData = StatisticsHelper.getDisabilityData(applications)

    res.render('data/statistics/diversity/index', {
      organisation,
      ethnicityData,
      ageData,
      sexData,
      disabilityData
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

    // create a file to stream archive data to.
    const output = fs.createWriteStream(filePath)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes')
      console.log('archiver has been finalized and the output file descriptor has closed.')
    })

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', () => {
      console.log('Data has been drained')
    })

    // catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err
      }
    })

    // catch this error explicitly
    archive.on('error', (err) => {
      throw err
    })

    // pipe archive data to the file
    archive.pipe(output)

    // append files
    // archive.append(fs.createReadStream(sexData.filePath), { name: sexData.fileName })
    // archive.append(fs.createReadStream(disabilityData.filePath), { name: disabilityData.fileName })
    // archive.append(fs.createReadStream(ethnicityData.filePath), { name: ethnicityData.fileName })
    // archive.append(fs.createReadStream(ageData.filePath), { name: ageData.fileName })

    archive.file(sexData.filePath, { name: sexData.fileName })
    archive.file(disabilityData.filePath, { name: disabilityData.fileName })
    archive.file(ethnicityData.filePath, { name: ethnicityData.fileName })
    archive.file(ageData.filePath, { name: ageData.fileName })

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize()

    res.download(filePath,fileName)
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
    headers.push({ id: 'received', title: 'Received' })
    headers.push({ id: 'recruited', title: 'Recruited' })

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
    headers.push({ id: 'received', title: 'Received' })
    headers.push({ id: 'recruited', title: 'Recruited' })

    const csv = csvWriter({
      path: filePath,
      header: headers
    })

    // content for the CSV file
    const records = []

    disabilityData.forEach((item, i) => {
      const data = {}
      data.disability = item.title
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
    headers.push({ id: 'received', title: 'Received' })
    headers.push({ id: 'recruited', title: 'Recruited' })

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
    headers.push({ id: 'received', title: 'Received' })
    headers.push({ id: 'recruited', title: 'Recruited' })

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
