const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'
const { DateTime } = require('luxon')
const _ = require('lodash')
const SystemHelper = require('../app/data/helpers/system')
const CycleHelper = require('../app/data/helpers/cycles')
const GeneratorsHelper = require('../app/data/helpers/generators')
const user = require('../app/data/user')
const relationships = require('../app/data/relationships-wren-academy.js')
let partners = relationships.map(relationship => relationship.org2)

const generateCycle = require('../app/data/generators/cycle')
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
const generateAssignedUsers = require('../app/data/generators/assigned-users')
const generateOffer = require('../app/data/generators/offer')
const generateRejection = require('../app/data/generators/rejection')
const generateWithdrawal = require('../app/data/generators/withdrawal')
const generateNotes = require('../app/data/generators/notes')
const generateEvents = require('../app/data/generators/events')
const generateInterviews = require('../app/data/generators/interviews')
const generateSubmittedDate = require('../app/data/generators/submittedDate')

const { STATUS } = require('./applications/constants')
const otherQualifications = require('../app/data/generators/other-qualifications')

const generateFakeApplication = (params = {}) => {
  if (!params.status.length) {
    return null
  }

  const organisations = user.organisations
  const status = params.status
  const cycle = params.cycle || generateCycle({ status })
  const offerCanNotBeReconfirmed = params.offerCanNotBeReconfirmed || null
  const submittedDate = params.submittedDate || generateSubmittedDate({ status })
  const personalDetails = { ...generatePersonalDetails(), ...params.personalDetails }

  let accreditedBody
  let provider
  let organisation = faker.helpers.randomize(organisations)
  if(organisation.isAccreditedBody) {
    accreditedBody = organisation
    provider = faker.helpers.randomize(partners)
  } else {
    provider = organisation
    accreditedBody = faker.helpers.randomize(partners)
  }

  // ---------------------------------------------------------------------------
  // Get the course data
  // TODO: get course data into the app in a proper structure
  // ---------------------------------------------------------------------------
  const courses = GeneratorsHelper.getCourseData(provider)
  const tempCourse = faker.helpers.randomize(courses)

  const courseCode = tempCourse.code
  const course = `${tempCourse.name} (${tempCourse.code})`
  const subjects = tempCourse.subjects
  const location = faker.helpers.randomize(tempCourse.locations)
  const studyMode = faker.helpers.randomize(tempCourse.studyModes)
  const subjectLevel = tempCourse.subjectLevel
  const fundingType = tempCourse.fundingType


  let offer = null
  if (['Deferred', 'Offered', 'Conditions pending', 'Recruited', 'Declined', 'Offer withdrawn', 'Conditions not met'].includes(status)) {
    offer = generateOffer({
      status,
      submittedDate,
      accreditedBody: accreditedBody.name,
      provider: provider.name,
      course,
      location,
      studyMode
    })
  }

  const notes = generateNotes()

  const interviews = params.interviews || generateInterviews({
    status,
    submittedDate
  })

  const assignedUsers = generateAssignedUsers(accreditedBody, provider, status)

  const events = generateEvents({
    offer,
    status,
    submittedDate,
    interviews,
    notes,
    provider: provider.name,
    course,
    location,
    studyMode,
    accreditedBody: accreditedBody.name,
    organisation,
    assignedUsers
  })

  // delete any interviews that have been cancelled
  let cancelledInterviewEvents = events.items
    .filter(event => event.title == 'Interview cancelled')

  cancelledInterviewEvents.forEach(event => {
    _.remove(interviews.items, function(interview) {
      return interview.id == event.meta.interview.id
    })
  })

  let rejectedDate
  let rejectedFeedbackDate
  let rejectedReasons
  if(status === 'Rejected') {
    rejectedDate = faker.date.past()
    rejectedReasons = generateRejection(status)
    // this might be null to signal an automatic rejection
    if(rejectedReasons) {
      rejectedFeedbackDate = rejectedDate
    }
  }

  let otherQualifications

  if(params.otherQualifications === null) {
    otherQualifications = null
  } else {
    otherQualifications = generateOtherQualifications()
  }

  const gcse = generateGcse({
    isInternationalCandidate: personalDetails.isInternationalCandidate,
    dateOfBirth: personalDetails.dateOfBirth,
    subjectLevel
  })
  const degree = generateDegree({
    isInternationalCandidate: personalDetails.isInternationalCandidate,
    dateOfBirth: personalDetails.dateOfBirth
  })

  let englishLanguageQualification
  if (personalDetails.isInternationalCandidate) {
    englishLanguageQualification = (params.englishLanguageQualification) ? params.englishLanguageQualification : generateEnglishLanguageQualification({
      englishGcseQualification: gcse.english,
      dateOfBirth: personalDetails.dateOfBirth
    })
  }

  return {
    id: params.id || faker.random.alphaNumeric(7).toUpperCase(),
    assignedUsers: params.assignedUsers || assignedUsers,
    offerCanNotBeReconfirmed,
    cycle,
    provider: provider.name,
    accreditedBody: accreditedBody.name,
    studyMode: params.studyMode || studyMode,
    fundingType: params.fundingType || fundingType,
    subject: params.subject || subjects,
    subjectLevel: params.subjectLevel || subjectLevel,
    course: params.course || course,
    location: params.location || location,
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
    contactDetails: params.contactDetails || generateContactDetails(personalDetails),
    interviewNeeds: params.interviewNeeds || generateInterviewNeeds(),
    workHistory: params.workHistory || generateWorkHistory(),
    schoolExperience:  params.schoolExperience || generateSchoolExperience(),
    degree: params.degree || degree,
    gcse: params.gcse || gcse,
    englishLanguageQualification,
    otherQualifications,
    personalStatement: params.personalStatement || generatePersonalStatement(),
    references: params.references || generateReferences(),
    miscellaneous: params.miscellaneous || faker.lorem.paragraph(),
    safeguarding: params.safeguarding || generateSafeguarding(),
    disability: params.disability || generateDisability()
  }
}

const generateFakeApplications = () => {
  const organisations = user.organisations
  const applications = []
  const now = SystemHelper.now()
  const randomNumber = faker.datatype.number({ 'min': 1, 'max': 20 })
  const past = now.minus({ days: randomNumber }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  })
  const future = now.plus({ days: randomNumber }).set({
    hour: faker.helpers.randomize([9, 10, 11]),
    minute: faker.helpers.randomize([0, 15, 30, 45])
  })

  applications.push(generateFakeApplication({
    id: 'P6RGOZC',
    status: 'Interviewing',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 36 }).toISO(),
    personalDetails: {
      givenName: 'Sarah',
      familyName: 'Fisher',
      sex: 'Female'
    },
    interviews: {
      items: [{
        id: faker.datatype.uuid(),
        date: future,
        organisation: 'The Royal Borough Teaching School Alliance',
        location: 'https://zoom.us/12345/'
      }, {
        id: faker.datatype.uuid(),
        date: future.plus({
          days: 1
        }),
        organisation: 'Kingston University',
        location: 'https://zoom.us/z1234/'
      }]
    },
    otherQualifications: null
  }))

  applications.push(generateFakeApplication({
    id: 'PBNF7WM',
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 38 }).toISO(),
    personalDetails: {
      givenName: 'Rachael',
      familyName: 'Harvey',
      sex: 'Female',
      dateOfBirth: '1965-03-05',
      isInternationalCandidate: false
    },
    degree: [
      {
        type: 'BA',
        subject: 'History',
        institution: 'Aston University',
        country: 'United Kingdom',
        grade: 'Distinction',
        predicted: true,
        startYear: '2017',
        graduationYear: '2020'
      }
    ],
    gcse: {
      maths: {
        hasQualification: 'Yes',
        type: 'O level',
        subject: 'Maths',
        country: 'United Kingdom',
        grade: [
          {
            grade: 'C'
          }
        ],
        year: 1982
      },
      english: {
        hasQualification: 'Yes',
        type: 'O level',
        subject: 'English',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'English',
            grade: 'B'
          }
        ],
        year: 1982
      },
      science: {
        hasQualification: 'Yes',
        type: 'O level',
        subject: 'Science',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'Science',
            grade: 'B'
          }
        ],
        year: 1982
      }
    },
    otherQualifications: null,
    englishLanguageQualification: {
      hasQualification: 'Not needed',
      status: 'No, English is not a foreign language to me'
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
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 40 }).toISO(),
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
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 30 }).toISO(),
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
    cycle: CycleHelper.PREVIOUS_CYCLE.code,
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
    cycle: CycleHelper.PREVIOUS_CYCLE.code,
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
    cycle: CycleHelper.PREVIOUS_CYCLE.code,
    personalDetails: {
      givenName: 'Laura',
      familyName: 'Say',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Interviewing',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 35 }).toISO(),
    personalDetails: {
      givenName: 'James',
      familyName: 'Sully',
      sex: 'Male'
    },
    interviews: {
      items: [{
        id: faker.datatype.uuid(),
        date: past,
        details: "Some details of the interview go here"
      }]
    }
  }))



  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 37 }).toISO(),
    personalDetails: {
      givenName: 'Umar',
      familyName: 'Smith',
      sex: 'Male'
    }
  }))

  var organisation = organisations[0]

  applications.push(generateFakeApplication({
    status: 'Rejected',
    cycle: '2019 to 2020',
    submittedDate: SystemHelper.now().minus({ days: 1 }).toISO(),
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
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 19 }).toISO(),
    personalDetails: {
      givenName: 'Sally',
      familyName: 'Harvey',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 18 }).toISO(),
    personalDetails: {
      givenName: 'Rachael',
      familyName: 'Wayne',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Offered',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Louise',
      familyName: 'Jenkins',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions pending',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Trent',
      familyName: 'Skipp',
      sex: 'Male'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Conditions pending',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Ed',
      familyName: 'Lloyd',
      sex: 'Male'
    }
  }))

 applications.push(generateFakeApplication({
    status: 'Conditions pending',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Audree',
      familyName: 'Bowen',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Recruited',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 60 }).toISO(),
    personalDetails: {
      givenName: 'Bill',
      familyName: 'Jones',
      sex: 'Male'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Recruited',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 70 }).toISO(),
    personalDetails: {
      givenName: 'Amy',
      familyName: 'Black',
      sex: 'Female'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Recruited',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 65 }).toISO(),
    personalDetails: {
      givenName: 'Tony',
      familyName: 'Stark',
      sex: 'Male'
    }
  }))

  // ---------------------------------------------------------------------------
  // International candidates
  // ---------------------------------------------------------------------------

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Pip',
      familyName: 'Love',
      sex: 'Female',
      dateOfBirth: '1998-01-25',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU settled status',
      dateEnteredUK: '2015-10-26'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Te Kura',
      familyName: 'Ngata-Aerengamate',
      sex: 'Female',
      dateOfBirth: '1986-04-08',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU settled status',
      dateEnteredUK: '2008-03-26'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Aleisha',
      familyName: 'Pearl-Nelson',
      sex: 'Female',
      dateOfBirth: '1995-05-18',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU settled status',
      dateEnteredUK: '2016-06-29'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Eloise',
      familyName: 'Blackwell',
      sex: 'Female',
      dateOfBirth: '1987-06-10',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU settled status',
      dateEnteredUK: '2014-10-21'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Kelsie',
      familyName: 'Wills',
      sex: 'Female',
      dateOfBirth: '1992-08-21',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU settled status',
      dateEnteredUK: '2008-10-12'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Alana',
      familyName: 'Bremner',
      sex: 'Female',
      dateOfBirth: '1989-11-21',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2019-12-07'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Les',
      familyName: 'Elder',
      sex: 'Female',
      dateOfBirth: '1976-04-09',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-07-12'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Dhys',
      familyName: 'Faleafaga',
      sex: 'Female',
      dateOfBirth: '1998-07-26',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Kendra',
      familyName: 'Cocksedge',
      sex: 'Female',
      dateOfBirth: '1989-05-31',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'Other',
      immigrationStatusDetails: 'I have a family visa',
      dateEnteredUK: '2010-10-05'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Ruahei',
      familyName: 'Demant',
      sex: 'Female',
      dateOfBirth: '1993-08-12',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'A visa sponsored by a course provider',
      immigrationStatus: '',
      immigrationStatusDetails: '',
      dateEnteredUK: ''
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Ayesha',
      familyName: 'Leti-I’iga',
      sex: 'Female',
      dateOfBirth: '2000-11-01',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'A visa sponsored by a course provider',
      immigrationStatus: '',
      immigrationStatusDetails: '',
      dateEnteredUK: ''
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Chelsea',
      familyName: 'Alley',
      sex: 'Female',
      dateOfBirth: '2000-01-03',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'A visa sponsored by a course provider',
      immigrationStatus: '',
      immigrationStatusDetails: '',
      dateEnteredUK: ''
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Stacey',
      familyName: 'Fluhler',
      sex: 'Female',
      dateOfBirth: '1981-01-25',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'A visa sponsored by a course provider',
      immigrationStatus: '',
      immigrationStatusDetails: '',
      dateEnteredUK: ''
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Renee',
      familyName: 'Wickliffe',
      sex: 'Female',
      dateOfBirth: '1994-05-24',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'Another route',
      rightToWorkStudyHowDetails: 'I’m applying for a permanent residence card',
      immigrationStatus: '',
      immigrationStatusDetails: '',
      dateEnteredUK: ''
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Renee',
      familyName: 'Holmes',
      sex: 'Female',
      dateOfBirth: '1999-05-25',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      lengthOfStay: '',
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'Another route',
      rightToWorkStudyHowDetails: 'I’m applying for a visa',
      immigrationStatus: '',
      immigrationStatusDetails: '',
      dateEnteredUK: ''
    }
  }))

  // ---------------------------------------------------------------------------
  // Qualifications
  // ---------------------------------------------------------------------------

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Audrey',
      familyName: 'Abadie',
      sex: 'Female',
      dateOfBirth: '1998-01-25',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: '00',
        name: 'Primary'
      }
    ],
    subjectLevel: 'Primary',
    course: 'Primary (5 to 11) (C1AH)',
    degree: [
      {
        subject: 'Educational Psychology',
        startYear: 2016,
        graduationYear: 2019,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'English',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 18
          }
        ],
        year: 2014
      },
      maths: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Maths',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE grades A*-C/9-4'
        },
        grade: [
          {
            grade: 20
          }
        ],
        year: 2014
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Yes',
      status: 'Yes',
      type: 'IELTS',
      grade: 7.5,
      gradeLabel: 'Overall band score',
      reference: '02GB0674SOOM599A',
      referenceLabel: 'Test report form (TRF) number',
      year: 2020
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Julie',
      familyName: 'Annery',
      sex: 'Female',
      dateOfBirth: '1986-04-08',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: '00',
        name: 'Primary'
      }
    ],
    subjectLevel: 'Primary',
    course: 'Primary (5 to 11) (C1AH)',
    degree: [
      {
        subject: 'Educational Psychology',
        startYear: 2004,
        graduationYear: 2006,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'English',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 18
          }
        ],
        year: 2002
      },
      maths: {
        hasQualification: 'No',
        subject: 'Maths',
        missing: {
          hasQualification: 'I don’t have an maths qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take a maths equivalency test'
        }
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Yes',
      status: 'Yes',
      type: 'IELTS',
      grade: 7.5,
      gradeLabel: 'Overall band score',
      reference: '02GB0674SOOM599A',
      referenceLabel: 'Test report form (TRF) number',
      year: 2009
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Lise',
      familyName: 'Arricastre',
      sex: 'Female',
      dateOfBirth: '1995-05-18',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: '00',
        name: 'Primary'
      }
    ],
    subjectLevel: 'Primary',
    course: 'Primary (5 to 11) (C1AH)',
    degree: [
      {
        subject: 'Educational Psychology',
        startYear: 2013,
        graduationYear: 2015,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'No',
        subject: 'English',
        missing: {
          hasQualification: 'I don’t have an English qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take an English equivalency test'
        }
      },
      maths: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Maths',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE grades A*-C/9-4'
        },
        grade: [
          {
            grade: 20
          }
        ],
        year: 2011
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Yes',
      status: 'Yes',
      type: 'IELTS',
      grade: 7.5,
      gradeLabel: 'Overall band score',
      reference: '02GB0674SOOM599A',
      referenceLabel: 'Test report form (TRF) number',
      year: 2015
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Cyrielle',
      familyName: 'Banet',
      sex: 'Female',
      dateOfBirth: '1987-06-10',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: '00',
        name: 'Primary'
      }
    ],
    subjectLevel: 'Primary',
    course: 'Primary (5 to 11) (C1AH)',
    degree: [
      {
        subject: 'Educational Psychology',
        startYear: 2006,
        graduationYear: 2008,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'No',
        subject: 'English',
        missing: {
          hasQualification: 'I don’t have an English qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take an English equivalency test'
        }
      },
      maths: {
        hasQualification: 'No',
        subject: 'Maths',
        missing: {
          hasQualification: 'I don’t have an maths qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take a maths equivalency test'
        }
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Yes',
      status: 'Yes',
      type: 'TOEFL',
      grade: 92,
      gradeLabel: 'Total score',
      reference: '0000 0000 2500 2147',
      referenceLabel: 'TOEFL registration number',
      year: 2014
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Clara',
      familyName: 'Joyeaux',
      sex: 'Female',
      dateOfBirth: '1998-07-26',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'History of Art',
        startYear: 2016,
        graduationYear: 2019,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'English',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 18
          }
        ],
        year: 2014
      },
      maths: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Maths',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 20
          }
        ],
        year: 2014
      },
      science: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Science',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 13
          }
        ],
        year: 2014
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Yes',
      status: 'Yes',
      type: 'Other',
      grade: 'B',
      gradeLabel: 'Score or grade',
      reference: 'Pearson Test of English (Academic)',
      referenceLabel: 'Assessment name',
      year: 2021
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Gaelle',
      familyName: 'Hermet',
      sex: 'Female',
      dateOfBirth: '1989-05-31',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'History of Art',
        startYear: 2007,
        graduationYear: 2009,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'English',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 18
          }
        ],
        year: 2005
      },
      maths: {
        hasQualification: 'No',
        subject: 'Maths',
        missing: {
          hasQualification: 'I don’t have an maths qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take a maths equivalency test'
        }
      },
      science: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Science',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 13
          }
        ],
        year: 2005
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Yes',
      status: 'Yes',
      type: 'Other',
      grade: 'B',
      gradeLabel: 'Score or grade',
      reference: 'Pearson Test of English (Academic)',
      referenceLabel: 'Assessment name',
      year: 2020
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Morgane',
      familyName: 'Peyronnet',
      sex: 'Female',
      dateOfBirth: '1993-08-12',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'History of Art',
        startYear: 2012,
        graduationYear: 2014,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'English',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 18
          }
        ],
        year: 2011
      },
      maths: {
        hasQualification: 'No',
        subject: 'Maths',
        missing: {
          hasQualification: 'I don’t have an maths qualification yet',
          isStudying: 'No',
          otherReason: 'I applied to NARIC for the equivalent'
        }
      },
      science: {
        hasQualification: 'No',
        subject: 'Science',
        missing: {
          hasQualification: 'I don’t have a science qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take a science equivalency test'
        }
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Not needed',
      status: 'No, English is not a foreign language to me'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Elise',
      familyName: 'Pignot',
      sex: 'Female',
      dateOfBirth: '2000-11-01',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'History of Art',
        startYear: 2019,
        graduationYear: 2022,
        predicted: true,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'No',
        subject: 'English',
        missing: {
          hasQualification: 'I don’t have an English qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take an English equivalency test'
        }
      },
      maths: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Maths',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE grades A*-C/9-4'
        },
        grade: [
          {
            grade: 20
          }
        ],
        year: 2017
      },
      science: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Science',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 13
          }
        ],
        year: 2017
      }
    },
    englishLanguageQualification: {
      hasQualification: 'No',
      status: 'No, I have not done an English as a foreign language assessment',
      reason: 'I will take a Pearson English test'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Yanna',
      familyName: 'Rivoalen',
      sex: 'Female',
      dateOfBirth: '2000-01-03',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'History of Art',
        startYear: 2018,
        graduationYear: 2020,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'No',
        subject: 'English',
        missing: {
          hasQualification: 'I don’t have an English qualification yet',
          isStudying: 'No',
          otherReason: 'I applied to NARIC for the equivalent'
        }
      },
      maths: {
        hasQualification: 'No',
        subject: 'Maths',
        missing: {
          hasQualification: 'I don’t have an maths qualification yet',
          isStudying: 'No',
          otherReason: 'I applied to NARIC for the equivalent'
        }
      },
      science: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Science',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 13
          }
        ],
        year: 2016
      }
    },
    englishLanguageQualification: {
      hasQualification: 'No',
      status: 'No, I have not done an English as a foreign language assessment',
      reason: 'I will take a Pearson English test'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Laure',
      familyName: 'Sansus',
      sex: 'Female',
      dateOfBirth: '1981-01-25',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'History of Art',
        startYear: 1999,
        graduationYear: 2002,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      },
      {
        subject: 'Sports coaching',
        startYear: 2005,
        graduationYear: 2008,
        predicted: true,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'No',
        subject: 'English',
        missing: {
          hasQualification: 'I don’t have an English qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take an English equivalency test'
        }
      },
      maths: {
        hasQualification: 'No',
        subject: 'Maths',
        missing: {
          hasQualification: 'I don’t have an maths qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take a maths equivalency test'
        }
      },
      science: {
        hasQualification: 'No',
        subject: 'Science',
        missing: {
          hasQualification: 'I don’t have a science qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take a science equivalency test'
        }
      }
    },
    englishLanguageQualification: {
      hasQualification: 'No',
      status: 'No, I have not done an English as a foreign language assessment',
      reason: 'I will take a Pearson English test'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Agathe',
      familyName: 'Sochat',
      sex: 'Female',
      dateOfBirth: '1994-05-24',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'History of Art',
        startYear: 2012,
        graduationYear: 2015,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      },
      {
        subject: 'Sports coaching',
        startYear: 2020,
        graduationYear: 2023,
        predicted: true,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'No',
        subject: 'English',
        missing: {
          hasQualification: 'I don’t have an English qualification yet',
          isStudying: 'No',
          otherReason: 'I applied to NARIC for the equivalent'
        }
      },
      maths: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Maths',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE grades A*-C/9-4'
        },
        grade: [
          {
            grade: 20
          }
        ],
        year: 2010
      },
      science: {
        hasQualification: 'No',
        subject: 'Science',
        missing: {
          hasQualification: 'I don’t have a science qualification yet',
          isStudying: 'No',
          otherReason: 'Not provided'
        }
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Not needed',
      status: 'No, English is not a foreign language to me'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Dhia',
      familyName: 'Traore',
      sex: 'Female',
      dateOfBirth: '1997-05-25',
      nationalities: [
        'French'
      ],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Yes',
      immigrationStatus: 'EU pre-settled status',
      dateEnteredUK: '2020-01-04'
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'History of Art',
        startYear: 2015,
        graduationYear: 2018,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      },
      {
        subject: 'Sports coaching',
        startYear: 2019,
        graduationYear: 2022,
        predicted: true,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'English',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [
          {
            grade: 18
          }
        ],
        year: 2013
      },
      maths: {
        hasQualification: 'Yes',
        type: 'Baccalauréat Général',
        subject: 'Maths',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE grades A*-C/9-4'
        },
        grade: [
          {
            grade: 20
          }
        ],
        year: 2013
      },
      science: {
        hasQualification: 'No',
        subject: 'Science',
        missing: {
          hasQualification: 'I don’t have a science qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take a science equivalency test'
        }
      }
    },
    englishLanguageQualification: {
      hasQualification: 'Not needed',
      status: 'No, English is not a foreign language to me'
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Axelle',
      familyName: 'Berthoumieu',
      sex: 'Female',
      dateOfBirth: '1992-08-21',
      nationalities: [
        'British',
        'French'
      ],
      isInternationalCandidate: false,
      lengthOfStay: 'Yes',
      rightToWorkStudy: '',
      immigrationStatus: '',
      dateEnteredUK: ''
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: '00',
        name: 'Primary'
      }
    ],
    subjectLevel: 'Primary',
    course: 'Primary (5 to 11) (C1AH)',
    degree: [
      {
        subject: 'Educational Psychology',
        startYear: 2010,
        graduationYear: 2012,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'English',
            grade: 'AA'
          }
        ],
        year: 2008
      },
      maths: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'Maths',
        country: 'United Kingdom',
        grade: [
          {
            grade: 'A'
          }
        ],
        year: 2008
      }
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Coralie',
      familyName: 'Bertrand',
      sex: 'Female',
      dateOfBirth: '1989-11-21',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false,
      lengthOfStay: 'Yes',
      rightToWorkStudy: '',
      immigrationStatus: '',
      dateEnteredUK: ''
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: 'W1',
        name: 'Art and design'
      }
    ],
    subjectLevel: 'Secondary',
    course: 'Art and design (1NBJ)',
    degree: [
      {
        subject: 'Art and Design',
        startYear: 2007,
        graduationYear: 2010,
        predicted: false,
        level: 6,
        grade: 'First-class honours',
        type: 'BA - Art and Design',
        institution: 'Loughborough College of Art and Design',
        country: 'United Kingdom'
      }
    ],
    gcse: {
      english: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'English',
            grade: 'CC'
          }
        ],
        year: 2005
      },
      maths: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'Maths',
        country: 'United Kingdom',
        grade: [
          {
            grade: 'B'
          }
        ],
        year: 2005
      },
      science: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'Science',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'Double award',
            grade: 'BC'
          }
        ],
        year: 2005
      }
    }
  }))

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Madoussou',
      familyName: 'Fall',
      sex: 'Female',
      dateOfBirth: '1976-04-09',
      nationalities: [
        'British',
        'French'
      ],
      isInternationalCandidate: false,
      lengthOfStay: 'Yes',
      rightToWorkStudy: '',
      immigrationStatus: '',
      dateEnteredUK: ''
    },
    studyMode: 'Full time',
    fundingType: 'Fee paying',
    subject: [
      {
        code: '00',
        name: 'Primary'
      }
    ],
    subjectLevel: 'Primary',
    course: 'Primary (5 to 11) (C1AH)',
    degree: [
      {
        subject: 'Educational Psychology',
        startYear: 1994,
        graduationYear: 1997,
        predicted: false,
        type: 'Diplôme',
        institution: 'University of Paris',
        country: 'France',
        grade: 'Pass',
        naric: {
          reference: '4000228363',
          comparable: 'Bachelor (Honours) degree'
        }
      }
    ],
    gcse: {
      english: {
        hasQualification: 'No',
        subject: 'English',
        missing: {
          hasQualification: 'I don’t have an English qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take an English equivalency test'
        }
      },
      maths: {
        hasQualification: 'No',
        subject: 'Maths',
        missing: {
          hasQualification: 'I don’t have an maths qualification yet',
          isStudying: 'Yes',
          studyingDetails: 'I am planning to take a maths equivalency test'
        }
      }
    }
  }))

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 33 }).toISO(),
    personalDetails: {
      isInternationalCandidate: true,
      givenName: 'Tiago',
      familyName: 'Pereyra',
      isInternationalCandidate: true,
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'Another route',
      rightToWorkStudyHowDetails: 'I am applying for a visa',
      dateEnteredUK: DateTime.fromJSDate(
          faker.date.between('2007-01-01','2021-08-31')
        ).toFormat('yyyy-LL-dd')
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
      institution: 'Complutense University of Madrid',
      country: 'Spain',
      grade: 'Pass',
      startYear: '2004',
      graduationYear: '2009'
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

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 34 }).toISO(),
    personalDetails: {
      isInternationalCandidate: true,
      givenName: 'Kung',
      familyName: 'Ha-Sun',
      nationalities: ['South Korean', 'Australian'],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'Another route',
      rightToWorkStudyHowDetails: 'I am applying for a visa',
      dateEnteredUK: DateTime.fromJSDate(
          faker.date.between('2007-01-01','2021-08-31')
        ).toFormat('yyyy-LL-dd')
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
      institution: 'University of Adelaide',
      country: 'Australia',
      grade: '81% (Distinction)',
      startYear: '2014',
      graduationYear: '2017'
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

  applications.push(generateFakeApplication({
    status: 'Received',
    cycle: CycleHelper.CURRENT_CYCLE.code,
    submittedDate: SystemHelper.now().minus({ days: 35 }).toISO(),
    personalDetails: {
      isInternationalCandidate: true,
      givenName: 'Chitprem',
      familyName: 'Sra',
      nationalities: ['Indian'],
      isInternationalCandidate: true,
      rightToWorkStudy: 'Not yet',
      rightToWorkStudyHow: 'Another route',
      rightToWorkStudyHowDetails: 'I am applying for a visa',
      dateEnteredUK: DateTime.fromJSDate(
          faker.date.between('2007-01-01','2021-08-31')
        ).toFormat('yyyy-LL-dd')
    },
    degree: [{
      type: 'BCA',
      subject: 'System Analysis & Design',
      institution: 'Panjab University',
      country: 'India',
      grade: 'A',
      startYear: '2012',
      graduationYear: '2016'
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


  for (const [key, value] of Object.entries(STATUS)) {
    const count = faker.datatype.number({ 'min': 30, 'max': 45 })
    let application

    if(key === "DEFERRED") continue;

    for (let i = 0; i < count; i++) {
      if (value === 'Offered') {
        application = generateFakeApplication({
          status: value,
          cycle: CycleHelper.CURRENT_CYCLE.code
        })
      } else {
        application = generateFakeApplication({
          status: value
        })
      }
      applications.push(application)
    }
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
