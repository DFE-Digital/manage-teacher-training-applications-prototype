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
  const submittedDate = params.submittedDate || faker.date.past()
  const personalDetails = { ...generatePersonalDetails(faker), ...params.personalDetails }

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
    personalDetails,
    contactDetails: params.contactDetails || generateContactDetails(faker, personalDetails),
    workHistory: generateWorkHistory(faker),
    degree: params.degree || generateDegree(faker, personalDetails.isInternationalCandidate),
    gcse: params.gcse || generateGcse(faker, personalDetails.isInternationalCandidate),
    englishLanguageQualification: params.englishLanguageQualification || generateEnglishLanguageQualification(faker),
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
  const applications = []

  applications.push(generateFakeApplication({
    status: 'Deferred',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Eloise',
      familyName: 'Wells'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'location'
    },
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Becky',
      familyName: 'Brother'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'course'
    },
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Laura',
      familyName: 'Say'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-05T14:01:00',
    personalDetails: {
      givenName: 'James',
      familyName: 'Sully'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-08T13:01:00',
    personalDetails: {
      givenName: 'Umar',
      familyName: 'Smith'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-21T18:59:00',
    personalDetails: {
      givenName: 'Emma',
      familyName: 'Hayes'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-29',
    personalDetails: {
      givenName: 'Daniel',
      familyName: 'James'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-08-10T13:32:00',
    personalDetails: {
      givenName: 'Teresa',
      familyName: 'Mendoza'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Sally',
      familyName: 'Harvey'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Rachael',
      familyName: 'Wayne'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Louise',
      familyName: 'Jenkins'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Trent',
      familyName: 'Skipp'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Ed',
      familyName: 'Lloyd'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Bill',
      familyName: 'Jones'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Killian',
      familyName: 'Black'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Tony',
      familyName: 'Stark'
    }
  }))

  // UR for international candidates
  // Scenario 1: Simple candidate
  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-05T14:01:00',
    personalDetails: {
      givenName: 'Tiago',
      familyName: 'Pereyra',
      nationality: ['Spanish', 'Argentinian'],
      residency: {
        rightToWorkStudy: 'Yes',
        details: 'I have lived in the UK for 10 years.'
      }
    },
    degree: [{
      type: 'Licenciatura',
      subject: 'History of Contemporary Art and Visual Culture',
      org: 'Complutense University of Madrid',
      country: 'Spain',
      grade: 'Pass',
      startDate: '2004',
      endDate: '2009'
    }],
    gcse: {
      maths: {
        missing: 'false',
        type: 'Título de Bachiller',
        subject: 'Maths',
        country: 'Spain',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE grades A*-C/9-4'
        },
        grade: [{
          grade: 8
        }],
        year: '2001'
      },
      english: {
        missing: 'false',
        type: 'Título de Bachiller',
        subject: 'English',
        country: 'Spain',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [{
          grade: 5
        }],
        year: '2001'
      },
      science: {
        missing: 'false',
        type: 'Título de Bachiller',
        subject: 'Science',
        country: 'Spain',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [{
          grade: 7
        }],
        year: '2001'
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Yes',
      status: 'Candidate has an English as a foreign language qualification',
      type: 'IELTS',
      grade: '5.5',
      gradeLabel: 'Overall band score',
      reference: '02GB0674SOOM599A',
      referenceLabel: 'Test report form (TRF) number',
      year: 2011
    }
  }))

  // UR for international candidates
  // Scenario 2: Slightly difficult candidate
  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-05T14:01:00',
    personalDetails: {
      givenName: 'Kung',
      familyName: 'Ha-Sun',
      nationality: ['South Korean', 'Australian'],
      residency: {
        rightToWorkStudy: 'Not yet'
      }
    },
    contactDetails: {
      tel: '+61 (08) 7225 5825',
      email: faker.internet.email('Kung', 'Ha-Sun').toLowerCase(),
      address: {
        line1: '197 Gover St',
        line2: '',
        level2: 'North Adelaide',
        level1: 'SA',
        postalCode: '5006',
        country: 'Australia'
      }
    },
    degree: [{
      type: 'Degree',
      subject: 'Applied sociology',
      org: 'University of Adelaide',
      country: 'Australia',
      grade: '81% (Distinction)',
      startDate: '2014',
      endDate: '2017'
    }],
    gcse: {
      maths: {
        missing: '-'
      },
      english: {
        missing: 'false',
        type: 'General High School Diploma',
        subject: 'English',
        country: 'South Korea',
        grade: [{
          grade: 'A'
        }],
        year: '2012'
      },
      science: {
        missing: 'false',
        type: 'General High School Diploma',
        subject: 'Science',
        country: 'South Korea',
        grade: [{
          grade: 'B'
        }],
        year: '2012'
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Not needed',
      status: 'English is not a foreign language to the candidate'
    }
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
const count = process.argv.slice(-1)[0] || 25
generateFile(filePath, count)
