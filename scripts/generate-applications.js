const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'
const { DateTime } = require('luxon')

// Fake data generators: general
const generateStatus = require('../app/data/generators/status')
const generateCourse = require('../app/data/generators/course')
const generateCycle = require('../app/data/generators/cycle')
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
  const status = params.status || generateStatus(faker)
  const cycle = params.cycle || generateCycle(faker, { status })
  const offerCanNotBeReconfirmed = params.offerCanNotBeReconfirmed || null
  const submittedDate = params.submittedDate || DateTime.fromISO('2019-08-15').minus({ days: 20 })
  const personalDetails = { ...generatePersonalDetails(faker), ...params.personalDetails }

  let offer = null
  if (['Deferred', 'Offered', 'Accepted', 'Conditions met', 'Declined', 'Offer withdrawn', 'Conditions not met'].includes(status)) {
    offer = generateOffer(faker, status)
  }

  const notes = generateNotes(faker)
  const events = generateEvents(faker, { offer, status })

  const provider = faker.helpers.randomize(organisations.filter(org => !org.isAccreditedBody))
  const accreditedBody = faker.helpers.randomize(organisations.filter(org => org.isAccreditedBody))

  const rejectedReasons = faker.helpers.randomize([generateRejection(faker), null])

  return {
    id: faker.random.alphaNumeric(7).toUpperCase(),
    offerCanNotBeReconfirmed,
    cycle,
    provider: provider.name,
    accreditingbody: accreditedBody.name,
    course: generateCourse(faker),
    locationname: generateTrainingLocation(faker),
    status,
    submittedDate,
    offer,
    rejectedDate: status === 'Rejected' ? faker.date.past() : null,
    rejectedReasons: status === 'Rejected' ? rejectedReasons : null,
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
    otherQualifications: params.otherQualifications || generateOtherQualifications(faker),
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
const generateFakeApplications = () => {
  const organisations = require('../app/data/organisations.json')
  const applications = []

  applications.push(generateFakeApplication({
    status: 'Deferred',
    cycle: 'Previous cycle (2019 to 2020)',
    personalDetails: {
      givenName: 'Eloise',
      familyName: 'Wells',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'location'
    },
    cycle: 'Previous cycle (2019 to 2020)',
    personalDetails: {
      givenName: 'Becky',
      familyName: 'Brother',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Deferred',
    offerCanNotBeReconfirmed: {
      reason: 'course'
    },
    cycle: 'Previous cycle (2019 to 2020)',
    personalDetails: {
      givenName: 'Laura',
      familyName: 'Say',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-05T14:01:00',
    personalDetails: {
      givenName: 'James',
      familyName: 'Sully',
      sex: 'Male'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-08T13:01:00',
    personalDetails: {
      givenName: 'Umar',
      familyName: 'Smith',
      sex: 'Male'
    }
  }))

  var organisation = organisations[0]

  applications.push(generateFakeApplication({
    status: 'Rejected',
    cycle: 'Previous cycle (2019 to 2020)',
    submittedDate: '2018-07-21T18:59:00',
    organisation: organisation,
    givenName: 'Emma',
    familyName: 'Hayes',
    personalDetails: {
      givenName: 'Emma',
      familyName: 'Hayes',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-29',
    personalDetails: {
      givenName: 'Daniel',
      familyName: 'James',
      sex: 'Male'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-08-10T13:32:00',
    personalDetails: {
      givenName: 'Teresa',
      familyName: 'Mendoza',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Sally',
      familyName: 'Harvey',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Rachael',
      familyName: 'Wayne',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Louise',
      familyName: 'Jenkins',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Trent',
      familyName: 'Skipp',
      sex: 'Male'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Ed',
      familyName: 'Lloyd',
      sex: 'Male'
    }
  }))

 applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Audree',
      familyName: 'Bowen',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Bill',
      familyName: 'Jones',
      sex: 'Male'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Amy',
      familyName: 'Black',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: 'Current cycle (2020 to 2021)',
    personalDetails: {
      givenName: 'Tony',
      familyName: 'Stark',
      sex: 'Male'
    }
  }))

  // UR for international candidates
  // Scenario 1: Simple candidate
  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-12T14:01:00',
    personalDetails: {
      isInternationalCandidate: true,
      givenName: 'Tiago',
      familyName: 'Pereyra',
      nationality: ['Spanish', 'Argentinian'],
      residency: {
        rightToWorkStudy: 'Yes',
        details: 'I have lived in the UK for 10 years.'
      }
    },
    contactDetails: {
      tel: '07700 900978',
      email: faker.internet.email('Tiago', 'Pereyra').toLowerCase(),
      address: {
        line1: '161 Portland Road',
        line2: '',
        level2: 'Birmingham',
        level1: 'West Midlands',
        postalCode: 'B16 6AS'
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
    },
    otherQualifications: {
      1: {
        type: 'Título de Bachiller',
        subject: 'Geography',
        provenance: 'international',
        country: 'Spain',
        grade: '8',
        year: '2001'
      },
      2: {
        type: 'Título de Bachiller',
        subject: 'History',
        provenance: 'international',
        country: 'Spain',
        grade: '7',
        year: '2001'
      },
      3: {
        type: 'Título de Bachiller',
        subject: 'Information Systems',
        provenance: 'international',
        country: 'Spain',
        grade: '6',
        year: '2001'
      }
    }
  }))

  // UR for international candidates
  // Scenario 2: Slightly difficult candidate
  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-11T14:01:00',
    personalDetails: {
      isInternationalCandidate: true,
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
        subject: 'Maths',
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
    },
    otherQualifications: {
      1: {
        type: 'Vocational High School Diploma',
        subject: '',
        provenance: 'international',
        country: 'South Korea',
        grade: 'A',
        year: '2014'
      }
    }
  }))

  // UR for international candidates
  // Scenario 3: Difficult candidate
  applications.push(generateFakeApplication({
    status: 'Submitted',
    cycle: 'Current cycle (2020 to 2021)',
    submittedDate: '2019-07-10T14:01:00',
    personalDetails: {
      isInternationalCandidate: true,
      givenName: 'Chitprem',
      familyName: 'Sra',
      nationality: ['Indian'],
      residency: {
        rightToWorkStudy: 'Do not know'
      }
    },
    degree: [{
      type: 'BCA',
      subject: 'System Analysis & Design',
      org: 'Panjab University',
      country: 'India',
      grade: 'A',
      startDate: '2012',
      endDate: '2016'
    }],
    gcse: {
      maths: {
        subject: 'Maths',
        missing: '-'
      },
      english: {
        missing: 'false',
        type: 'Indian School Certificate',
        subject: 'English',
        country: 'India',
        grade: [{
          grade: '3'
        }],
        year: '2010'
      },
      science: {
        missing: 'false',
        type: 'Indian School Certificate',
        subject: 'Science',
        country: 'India',
        grade: [{
          grade: '4'
        }],
        year: '2010'
      }
    },
    englishLanguageQualification: {
      hasQualification: 'No',
      status: 'Candidate does not have an English as a foreign language qualification yet',
      missing: '-'
    },
    otherQualifications: {}
  }))

  for (var i = 0; i < 20; i++) {
    const application = generateFakeApplication({
      status: 'Submitted'
    })
    applications.push(application)
  }

  for (var i = 0; i < 20; i++) {
    const application = generateFakeApplication({
      status: 'Offered',
      cycle: 'Current cycle (2020 to 2021)'
    })
    applications.push(application)
  }

  for (var i = 0; i < 20; i++) {
    const application = generateFakeApplication({
      status: 'Accepted'
    })
    applications.push(application)
  }

  for (var i = 0; i < 20; i++) {
    const application = generateFakeApplication({
      status: 'Conditions met'
    })
    applications.push(application)
  }

  for (var i = 0; i < 2; i++) {
    const application = generateFakeApplication({
      status: 'Deferred'
    })
    applications.push(application)
  }

  for (var i = 0; i < 30; i++) {
    const application = generateFakeApplication({
      status: 'Declined'
    })
    applications.push(application)
  }

  for (var i = 0; i < 30; i++) {
    const application = generateFakeApplication({
      status: 'Rejected'
    })
    applications.push(application)
  }

  for (var i = 0; i < 30; i++) {
    const application = generateFakeApplication({
      status: 'Application withdrawn'
    })
    applications.push(application)
  }

  for (var i = 0; i < 30; i++) {
    const application = generateFakeApplication({
      status: 'Offer withdrawn'
    })
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
const generateApplicationsFile = (filePath) => {
  const applications = generateFakeApplications()
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

generateApplicationsFile(path.join(__dirname, '../app/data/applications.json'))
