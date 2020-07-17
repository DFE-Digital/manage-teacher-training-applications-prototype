const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'

// Fake data generators: general
const applicationStatus = require('../app/data/generators/status')
const course = require('../app/data/generators/course')
const cycle = require('../app/data/generators/cycle')
const organisation = require('../app/data/generators/organisation')
const trainingLocation = require('../app/data/generators/training-location')

// Fake data generators: application
const personalDetails = require('../app/data/generators/personal-details')
const contactDetails = require('../app/data/generators/contact-details')
const degree = require('../app/data/generators/degree')
const gcse = require('../app/data/generators/gcse')
const otherQualifications = require('../app/data/generators/other-qualifications')
const workHistory = require('../app/data/generators/work-history')
const schoolExperience = require('../app/data/generators/school-experience')
const personalStatement = require('../app/data/generators/personal-statement')
const references = require('../app/data/generators/references')

// Fake data generators: application management
const offer = require('../app/data/generators/offer')
const rejection = require('../app/data/generators/rejection')
const withdrawal = require('../app/data/generators/withdrawal')
const notes = require('../app/data/generators/notes')
const events = require('../app/data/generators/events')

// Populate application data object with fake data
const fakeApplication = () => {
  const thisCycle = cycle(faker)

  return {
    id: faker.random.alphaNumeric(7).toUpperCase(),
    cycle: thisCycle,
    accreditingbody: organisation(faker).name,
    provider: organisation(faker).name,
    course: course(faker),
    locationname: trainingLocation(faker),
    status: applicationStatus(faker, thisCycle),
    submittedDate: faker.date.past(),
    offer: applicationStatus === 'Offered' ? offer(faker) : false,
    previousOffer: applicationStatus === 'Deferred' ? offer(faker) : false,
    rejectedDate: applicationStatus === 'Rejected' ? faker.date.past() : false,
    rejectedReasons: applicationStatus === 'Rejected' ? rejection(faker) : false,
    withdrawnDate: applicationStatus === 'Application withdrawn' ? faker.date.past() : false,
    withdrawnReasons: applicationStatus === 'Application withdrawn' ? withdrawal(faker) : false,
    notes: notes(faker),
    events: events(faker),
    'personal-details': personalDetails(faker),
    'contact-details': contactDetails(faker),
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    'work-history': workHistory(faker),
    degree: degree(faker),
    gcse: gcse(faker),
    'other-qualifications': otherQualifications(faker),
    'school-experience': schoolExperience(faker),
    'personal-statement': personalStatement(faker),
    references: references(faker),
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

  for (var i = 0; i < count; i++) {
    const application = fakeApplication()
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
