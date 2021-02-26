const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'
const { DateTime } = require('luxon')
const _ = require('lodash')

// Fake data generators: general
const generateSubject = require('../app/data/generators/subject')
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
const generateInterviewNeeds = require('../app/data/generators/interview-needs')
const generateSafeguarding = require('../app/data/generators/safeguarding')
const generateDisability = require('../app/data/generators/disability')

// Fake data generators: application management
const generateOffer = require('../app/data/generators/offer')
const generateRejection = require('../app/data/generators/rejection')
const generateWithdrawal = require('../app/data/generators/withdrawal')
const generateNotes = require('../app/data/generators/notes')
const generateEvents = require('../app/data/generators/events')
const generateInterviews = require('../app/data/generators/interviews')

// Populate application data object with fake data
const generateFakeApplication = (params = {}) => {
  if (!params.status.length) {
    return null
  }

  const organisations = require('../app/data/organisations.json')
  const status = params.status
  const cycle = params.cycle || generateCycle(faker, { status })
  const offerCanNotBeReconfirmed = params.offerCanNotBeReconfirmed || null
  const submittedDate = params.submittedDate || DateTime.fromISO('2020-08-15').minus({ days: 20 }).toISO()
  const personalDetails = { ...generatePersonalDetails(faker), ...params.personalDetails }

  let offer = null
  if (['Deferred', 'Offered', 'Accepted', 'Conditions met', 'Declined', 'Offer withdrawn', 'Conditions not met'].includes(status)) {
    offer = generateOffer({ status, submittedDate })
  }

  const notes = generateNotes(faker)
  const interviews = params.interviews || generateInterviews(faker, { status })

  const events = generateEvents({ offer, status, interviews })

  // delete any interviews that have been cancelled
  var cancelledInterviewEvents = events.items
    .filter(event => event.title == 'Interview cancelled')

  cancelledInterviewEvents.forEach(event => {
    _.remove(interviews.items, function(interview) {
      return interview.id == event.meta.interview.id
    })
  })

  const provider = faker.helpers.randomize(organisations.filter(org => !org.isAccreditedBody))
  const accreditedBody = faker.helpers.randomize(organisations.filter(org => org.isAccreditedBody))

  const subject = generateSubject(faker)
  const courseCode = faker.random.alphaNumeric(4).toUpperCase()
  const course = `${subject.name} (${courseCode})`

  let rejectedDate
  let rejectedFeedbackDate
  let rejectedReasons
  if(status === 'Rejected') {
    rejectedDate = faker.date.past()
    rejectedReasons = generateRejection(status)
    // might be null to singal automatic rejection
    if(rejectedReasons) {
      rejectedFeedbackDate = rejectedDate
    }
  }

  return {
    id: params.id || faker.random.alphaNumeric(7).toUpperCase(),
    offerCanNotBeReconfirmed,
    cycle,
    provider: provider.name,
    accreditingbody: accreditedBody.name,
    studyMode: params.studyMode || faker.helpers.randomize(['Full time', 'Part time']),
    fundingType: params.fundingType || faker.helpers.randomize(['Salaried', 'Fee paying']),
    subject: params.subject || subject.name,
    course: params.course || course,
    locationname: params.locationname || generateTrainingLocation(faker),
    status,
    submittedDate,
    offer,
    rejectedDate: rejectedDate,
    rejectedReasons: rejectedReasons,
    rejectedFeedbackDate: rejectedFeedbackDate,
    interviews,
    notes,
    events,
    personalDetails,
    contactDetails: params.contactDetails || generateContactDetails(faker, personalDetails),
    interviewNeeds: params.interviewNeeds || generateInterviewNeeds(faker),
    workHistory: params.workHistory || generateWorkHistory(),
    schoolExperience:  params.schoolExperience || generateSchoolExperience(),
    degree: params.degree || generateDegree(faker, personalDetails.isInternationalCandidate),
    gcse: params.gcse || generateGcse(faker, personalDetails.isInternationalCandidate),
    englishLanguageQualification: params.englishLanguageQualification || generateEnglishLanguageQualification(faker),
    otherQualifications: params.otherQualifications || generateOtherQualifications(faker),
    personalStatement: params.personalStatement || generatePersonalStatement(faker),
    references: params.references || generateReferences(faker),
    miscellaneous: params.miscellaneous || faker.lorem.paragraph(),
    safeguarding: params.safeguarding || generateSafeguarding(faker),
    disability: params.disability || generateDisability(faker)
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
  const now = DateTime.fromISO('2020-08-15')
  const randomNumber = faker.random.number({ 'min': 1, 'max': 20 })
  const past = now.minus({ days: randomNumber }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  })
  const future = now.plus({ days: randomNumber }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  })

  /* Applications for Work History research */
  applications.push(generateFakeApplication({
    id: 'PBNF7WM',
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-06T14:02:00',
    personalDetails: {
      givenName: 'Tricia',
      familyName: 'Jones',
      sex: 'Female',
      dateOfBirth: '1965-03-05',
      isInternationalCandidate: false
    },
    degree: [
      {
        "type": "BA",
        "subject": "History",
        "org": "Aston University",
        "country": "United Kingdom",
        "grade": "Distinction",
        "predicted": true,
        "startDate": "2017",
        "endDate": "2020"
      }
    ],
    gcse: {
      "maths": {
        "type": "O level",
        "subject": "Maths",
        "country": "United Kingdom",
        "missing": "false",
        "grade": [
          {
            "grade": "C"
          }
        ],
        "year": 1982
      },
      "english": {
        "type": "O level",
        "subject": "English",
        "country": "United Kingdom",
        "missing": "false",
        "grade": [
          {
            "exam": "English",
            "grade": "B"
          }
        ],
        "year": 1982
      },
      "science": {
        "type": "O level",
        "subject": "Science",
        "country": "United Kingdom",
        "missing": "false",
        "grade": [
          {
            "exam": "Science",
            "grade": "B"
          }
        ],
        "year": 1982
      }
    },
    otherQualifications:
      [
    ],
    englishLanguageQualification: {
      hasQualification: "Not needed",
      status: "English is not a foreign language to the candidate"
    },
    schoolExperience: [
      {
        "role": "Holiday club staff",
        "org": "Heathcote Primary School",
        "workedWithChildren": "Yes",
        "startDate": "2019-07-01T23:14:28.205Z",
        "endDate": "2019-08-30T05:13:38.382Z",
        "timeCommitment": "3 afternoons a week over the summer"
      }
    ],
    "references": {
      "first": {
        "type": "Professional",
        "name": "Braeden Schultz",
        "email": "braeden.schultz@gmail.com",
        "tel": "01189 388018",
        "relationship": {
          "summary": "Deputy head at the school where I currently volunteer",
          "validated": true
        },
        "safeguarding": {
          "response": "no"
        },
        "comments": "A charismatic talented and able person."
      },
      "second": {
        "type": "Professional",
        "name": "Yolanda Ferry",
        "email": "yolanda.ferry@yahoo.com",
        "tel": "0800 435003",
        "relationship": {
          "summary": "Manager at R & T Ltd where I worked for 3 years.",
          "validated": true
        },
        "safeguarding": {
          "response": "no"
        },
        "comments": "Tricia is great, and will be a good teacher."
      }
    },
    "safeguarding": {
      "response": false
    },
    "disability": {
      "response": false
    },
    workHistory: {
      answer: 'yes',
      items: [
      {
        category: 'job',
        role: 'Camp assistant',
        org: 'XYZ Summer Camps Ltd',
        type: 'Part time',
        relevantToTeaching: 'Yes',
        startDate: '1983-01-01',
        endDate: '1985-10-01',
        isStartDateApproximate: true,
        isEndDateApproximate: true
      },
      {
        category: 'job',
        role: 'Retail assistant',
        org: 'Jones’s Stores',
        type: 'Part time',
        relevantToTeaching: 'No',
        startDate: '1985-11-01',
        endDate: '1986-08-01',
        isStartDateApproximate: true,
        isEndDateApproximate: true
      },
      {
        category: 'job',
        role: 'Deputy Manager',
        org: 'Jones’s Stores',
        type: 'Full time',
        relevantToTeaching: 'No',
        startDate: '1986-08-01',
        endDate: '1991-11-01',
        isStartDateApproximate: true,
        isEndDateApproximate: true
      },
      {
        category: 'job',
        role: 'Deputy store manager',
        org: 'Arnolds department store',
        type: 'Full time',
        relevantToTeaching: 'No',
        startDate: '1991-11-01',
        endDate: '1996-05-01',
        isStartDateApproximate: true,
        isEndDateApproximate: true
      },
      {
        category: 'break',
        description: 'Bringing up my 4 children',
        duration: '10 years and 3 months',
        startDate: '1996-05-01',
        endDate: '2006-08-01',
        isStartDateApproximate: true,
        isEndDateApproximate: false
      },
      {
        category: 'job',
        role: 'Buyer',
        org: 'R & T Ltd',
        type: 'Full time',
        relevantToTeaching: 'No',
        startDate: '2006-08-01',
        endDate: '2017-06-01'
      },
      {
        category: 'break',
        description: 'Degree course',
        duration: '2 years and 10 months',
        startDate: '2017-09-01',
        endDate: '2020-07-01'
      }
    ]
    }
  }))


  applications.push(generateFakeApplication({
    id: 'YD3TMD2L',
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-05T14:02:00',
    personalDetails: {
      givenName: 'Alex',
      familyName: 'Roberts',
      sex: 'Female',
      dateOfBirth: "1999-04-05"
    },
    safeguarding: {
      "response": false
    },
    workHistory: {
      answer: 'no--in-full-time-education',
      items: []
    },
    schoolExperience: [
      {
        "role": "Volunteer",
        "org": "Local nature reserve",
        "workedWithChildren": "No",
        "startDate": "2019-08-01T23:14:28.205Z",
        "endDate": "2019-08-09T05:13:38.382Z",
        "timeCommitment": "1 week"
      }
    ]
  }))

  applications.push(generateFakeApplication({
    id: 'ABC15F25',
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-05T14:02:00',
    personalDetails: {
      givenName: 'Barbara',
      familyName: 'Kite',
      sex: 'Female',
      dateOfBirth: '1991-05-01'
    },
    safeguarding: {
      "response": false
    },
    workHistory: {
      answer: 'no',
      reason: 'Shortly after leaving school at 18 I became pregnant. After having my baby I suffered from post natal depression and anxiety, which prevented me from being able to work. After a mental health breakdown I received support from a councillor and medication. This enabled me to recover, and I decided to study for a degree part time to enable me to realise my goal of becoming a teacher. I have also volunteered with an after school club that my child goes to.',
      items: []
    },
    schoolExperience: [
      {
        "role": "Peer support",
        "org": "Bradshaw mental health charity",
        "workedWithChildren": "No",
        "startDate": "2017-08-01T23:14:28.205Z",
        "endDate": "2018-08-09T05:13:38.382Z",
        "timeCommitment": "1 evening a week"
      }

    ]
  }))


  applications.push(generateFakeApplication({
    status: 'Deferred',
    cycle: '2019 to 2020',
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
    cycle: '2019 to 2020',
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
    cycle: '2019 to 2020',
    personalDetails: {
      givenName: 'Laura',
      familyName: 'Say',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-05T14:01:00',
    personalDetails: {
      givenName: 'James',
      familyName: 'Sully',
      sex: 'Male'
    },
    interviews: {
      items: [{
        id: faker.random.uuid(),
        date: past,
        details: "Some details of the interview go here"
      }]
    }
  }))

  applications.push(generateFakeApplication({
    id: 'P6RGOZC',
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-05T14:01:00',
    personalDetails: {
      givenName: 'Sarah',
      familyName: 'Fisher',
      sex: 'Female'
    },
    interviews: {
      items: [{
        id: faker.random.uuid(),
        date: future,
        organisation: 'The Royal Borough Teaching School Alliance',
        location: 'https://zoom.us/12345/'
      }, {
        id: faker.random.uuid(),
        date: future.plus({
          days: 1
        }),
        organisation: 'Kingston University',
        location: 'https://zoom.us/z1234/'
      }]
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-08T13:01:00',
    personalDetails: {
      givenName: 'Umar',
      familyName: 'Smith',
      sex: 'Male'
    },
    interviews: { items: [] }
  }))

  var organisation = organisations[0]

  applications.push(generateFakeApplication({
    status: 'Rejected',
    cycle: '2019 to 2020',
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
    status: 'Offered',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Sally',
      familyName: 'Harvey',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Rachael',
      familyName: 'Wayne',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Louise',
      familyName: 'Jenkins',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Trent',
      familyName: 'Skipp',
      sex: 'Male'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Ed',
      familyName: 'Lloyd',
      sex: 'Male'
    }
  }))

 applications.push(generateFakeApplication({
    status: 'Accepted',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Audree',
      familyName: 'Bowen',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Bill',
      familyName: 'Jones',
      sex: 'Male'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Amy',
      familyName: 'Black',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions met',
    cycle: '2020 to 2021',
    personalDetails: {
      givenName: 'Tony',
      familyName: 'Stark',
      sex: 'Male'
    }
  }))

  // UR for international candidates
  // Scenario 1: Simple candidate
  applications.push(generateFakeApplication({
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-12T14:01:00',
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
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-11T14:01:00',
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
    status: 'Awaiting decision',
    cycle: '2020 to 2021',
    submittedDate: '2020-07-10T14:01:00',
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
      status: 'Awaiting decision'
    })
    applications.push(application)
  }

  for (var i = 0; i < 20; i++) {
    const application = generateFakeApplication({
      status: 'Offered',
      cycle: '2020 to 2021'
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

  for (var i = 0; i < 20; i++) {
    const application = generateFakeApplication({
      status: 'Conditions not met'
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
