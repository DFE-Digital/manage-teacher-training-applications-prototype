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
    personalDetails,
    contactDetails: generateContactDetails(faker, personalDetails),
    workHistory: generateWorkHistory(faker),
    degree: generateDegree(faker, personalDetails.isInternationalCandidate),
    gcse: generateGcse(faker, personalDetails.isInternationalCandidate),
    englishLanguageQualification: generateEnglishLanguageQualification(faker),
    otherQualifications: generateOtherQualifications(faker),
    schoolExperience: generateSchoolExperience(faker),
    personalStatement: generatePersonalStatement(faker),
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
    givenName: 'Eloise',
    familyName: 'Wells'
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'location'
    },
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Becky',
    familyName: 'Brother'
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'course'
    },
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Laura',
    familyName: 'Say'
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-05T14:01:00',
    givenName: 'James',
    familyName: 'Sully'
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-08T13:01:00',
    givenName: 'Umar',
    familyName: 'Smith'
  }))

  var organisation = organisations[0];

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-21T18:59:00',
    organisation: organisation,
    givenName: 'Emma',
    familyName: 'Hayes'
  }))

  applications.push(generateFakeApplication({
    status: 'Rejected',
    cycle: 'Previous cycle (2019 to 2020)',
    submittedDate: '2018-07-21T18:59:00',
    organisation: organisation,
    givenName: 'Emma',
    familyName: 'Hayes'
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-29',
    givenName: 'Daniel',
    familyName: 'James'
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-08-10T13:32:00',
    givenName: 'Teresa',
    familyName: 'Mendoza'
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Sally',
    familyName: 'Harvey'
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Rachael',
    familyName: 'Wayne'
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Louise',
    familyName: 'Jenkins'
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Trent',
    familyName: 'Skipp'
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Ed',
    familyName: 'Lloyd'
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Bill',
    familyName: 'Jones'
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Killian',
    familyName: 'Black'
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    givenName: 'Tony',
    familyName: 'Stark'
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
