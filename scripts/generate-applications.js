const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'

// Fake data generators: general
const generateStatus = require('../app/data/generators/status')
const generateCourse = require('../app/data/generators/course')
const generateCycle = require('../app/data/generators/cycle')
const generateOrganisation = require('../app/data/generators/organisation')
const generateTrainingLocation = require('../app/data/generators/training-location')

// Fake data generators: application
const generatePersonalDetails = require('../app/data/generators/personal-details')
const generateContactDetails = require('../app/data/generators/contact-details')
const generateDegree = require('../app/data/generators/degree')
const generateGcse = require('../app/data/generators/gcse')
const generateEnglishLanguageQualification = require('../app/data/generators/english-language-qualification')
const generateOtherQualifications = require('../app/data/generators/other-qualifications')
const generateWorkHistory = require('../app/data/generators/work-history')
const generateSchoolExperience = require('../app/data/generators/school-experience')
const generatePersonalStatement = require('../app/data/generators/personal-statement')
const generateReferences = require('../app/data/generators/references')

// Fake data generators: application management
const generateOffer = require('../app/data/generators/offer')
const generateRejection = require('../app/data/generators/rejection')
const generateWithdrawal = require('../app/data/generators/withdrawal')
const generateNotes = require('../app/data/generators/notes')
const generateEvents = require('../app/data/generators/events')

// Populate application data object with fake data
const generateFakeApplication = (params = {}) => {
  const organisations = require('../app/data/organisations.json')
  const cycle = params.cycle || generateCycle(faker)
  const status = params.status || generateStatus(faker, cycle)
  const offerCanNotBeReconfirmed = params.offerCanNotBeReconfirmed || null
  const submittedDate = params.submittedDate || faker.date.past()
  const personalDetails = generatePersonalDetails(faker, params)

  let offer = null
  if (['Offered', 'Accepted', 'Conditions met', 'Declined', 'Offer withdrawn', 'Conditions not met'].includes(status)) {
    offer = generateOffer(faker, status)
  }
  let previousOffer = null
  if (['Deferred'].includes(status)) {
    previousOffer = generateOffer(faker, status)
  }

  const notes = generateNotes(faker)
  const events = generateEvents(faker, { offer, status })

  return {
    id: faker.random.alphaNumeric(7).toUpperCase(),
    offerCanNotBeReconfirmed,
    cycle,
    accreditingbody: faker.helpers.randomize(organisations).name,
    provider: params.organisation ? params.organisation.name : faker.helpers.randomize(organisations).name,
    course: generateCourse(faker),
    locationname: generateTrainingLocation(faker),
    status,
    submittedDate,
    offer,
    previousOffer,
    rejectedDate: status === 'Rejected' ? faker.date.past() : null,
    rejectedReasons: status === 'Rejected' ? generateRejection(faker) : null,
    withdrawnDate: status === 'Application withdrawn' ? faker.date.past() : null,
    withdrawnReasons: status === 'Application withdrawn' ? generateWithdrawal(faker) : null,
    notes,
    events,
    'personal-details': personalDetails,
    'contact-details': generateContactDetails(faker, personalDetails),
    'work-history': generateWorkHistory(faker),
    degree: generateDegree(faker, personalDetails.isInternationalCandidate),
    gcse: generateGcse(faker, personalDetails.isInternationalCandidate),
    englishLanguageQualification: generateEnglishLanguageQualification(faker),
    'other-qualifications': generateOtherQualifications(faker),
    'school-experience': generateSchoolExperience(faker),
    'personal-statement': generatePersonalStatement(faker),
    references: generateReferences(faker),
    miscellaneous: faker.lorem.paragraph()
  }
}

/**
 * Generate a number of fake applications
 *
 * @param {String} count Number of applications to generate
 *
 */
const generateFakeApplications = (count) => {
  const organisations = require('../app/data/organisations.json')
  const applications = []

  applications.push(generateFakeApplication({
    status: 'Deferred',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Eloise',
    'family-name': 'Wells'
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'location'
    },
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Becky',
    'family-name': 'Brother'
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'course'
    },
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Laura',
    'family-name': 'Say'
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-05T14:01:00',
    'given-name': 'James',
    'family-name': 'Sully'
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-08T13:01:00',
    'given-name': 'Umar',
    'family-name': 'Smith'
  }))

  var organisation = organisations[0];

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-21T18:59:00',
    organisation: organisation,
    'given-name': 'Emma',
    'family-name': 'Hayes'
  }))

  applications.push(generateFakeApplication({
    status: 'Rejected',
    cycle: 'Previous cycle (2019 to 2020)',
    submittedDate: '2018-07-21T18:59:00',
    organisation: organisation,
    'given-name': 'Emma',
    'family-name': 'Hayes'
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-29',
    'given-name': 'Daniel',
    'family-name': 'James'
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-08-10T13:32:00',
    'given-name': 'Teresa',
    'family-name': 'Mendoza'
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Sally',
    'family-name': 'Harvey'
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Rachael',
    'family-name': 'Wayne'
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Louise',
    'family-name': 'Jenkins'
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Trent',
    'family-name': 'Skipp'
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Ed',
    'family-name': 'Lloyd'
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Bill',
    'family-name': 'Jones'
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Killian',
    'family-name': 'Black'
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    'given-name': 'Tony',
    'family-name': 'Stark'
  }))

  for (var i = 0; i < count; i++) {
    const application = generateFakeApplication()
    applications.push(application)
  }

  return applications
}

/**
 * Generate JSON file
 *
 * @param {String} filePath Location of generated file
 * @param {String} count Number of applications to generate
 *
 */
const generateApplicationsFile = (filePath, count) => {
  const applications = generateFakeApplications(count)
  const filedata = JSON.stringify(applications, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Application data generated: ${filePath}`)
    }
  )
}

generateApplicationsFile(path.join(__dirname, '../app/data/applications.json'), 100)
