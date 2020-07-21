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
  const cycle = params.cycle || generateCycle(faker)
  const status = params.status || generateStatus(faker, cycle)
  const offerCanNotBeReconfirmed = params.offerCanNotBeReconfirmed || null
  const personalDetails = generatePersonalDetails(faker)

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

  let submittedDate = faker.date.past();
  if(status === "Submitted") {
    submittedDate = faker.helpers.randomize([
      '2019-07-05T14:01:00',
      '2019-07-21T18:59:00',
      '2019-07-29',
      '2019-08-10T13:32:00'
    ])
  }

  return {
    id: faker.random.alphaNumeric(7).toUpperCase(),
    offerCanNotBeReconfirmed,
    cycle,
    accreditingbody: generateOrganisation(faker).name,
    provider: generateOrganisation(faker).name,
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
    'contact-details': generateContactDetails(faker),
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
  const applications = []

  applications.push(generateFakeApplication({
    status: 'Deferred',
    cycle: 'Current cycle (2020 to 2021)'
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'location'
    },
    cycle: 'Current cycle (2020 to 2021)'
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'course'
    },
    cycle: 'Current cycle (2020 to 2021)'
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
const generateFile = (filePath, count) => {
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

const filePath = path.join(__dirname, '../app/data/applications.json')
const count = process.argv.slice(-1)[0] || 50
generateFile(filePath, count)
