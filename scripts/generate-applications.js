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
const relationships = user.relationships
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
  const deferredOfferUnavailable = params.deferredOfferUnavailable || null
  const submittedDate = params.submittedDate || generateSubmittedDate({ status })
  const personalDetails = { ...generatePersonalDetails(), ...params.personalDetails }

  let provider = user.organisation
  let accreditedBody = user.organisation
  let organisation = provider

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
  const qualifications = tempCourse.qualifications


  let offer = null
  if (['Deferred', 'Offered', 'Conditions pending', 'Recruited', 'Declined', 'Offer withdrawn', 'Conditions not met'].includes(status)) {
    offer = generateOffer({
      status,
      submittedDate,
      accreditedBody: accreditedBody.name,
      provider: provider.name,
      course,
      courseCode,
      location,
      studyMode,
      fundingType,
      qualifications
    })
  }

  if (offer && params.offer.standardConditions) {
    offer.standardConditions = params.offer.standardConditions
  }

  const notes = {
    items: []
  }

  const interviews = params.interviews || generateInterviews({
    status,
    submittedDate
  })

  // const assignedUsers = generateAssignedUsers(accreditedBody, provider, status)

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
    fundingType,
    qualifications,
    organisation
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
    rejectedDate = params.rejectedDate || faker.date.past()

    if(typeof params.rejectedReasons !== 'undefined') {
      rejectedReasons = params.rejectedReasons
    } else {
      rejectedReasons = generateRejection(status)
    }

    // this might be null to signal an automatic rejection
    if(rejectedReasons) {
      rejectedFeedbackDate = rejectedDate
    }
  }

  let withdrawal
  if(status === 'Application withdrawn') {
    withdrawal = generateWithdrawal()
  }

  let otherQualifications

  if(!params.otherQualifications == null) {
    otherQualifications = generateOtherQualifications()
  } else {
    otherQualifications = params.otherQualifications
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
    id: params.id || ('' + faker.datatype.number({min: 123456, max: 999999})),
    assignedUsers: params.assignedUsers || assignedUsers,
    deferredOfferUnavailable,
    cycle,
    withdrawal,
    provider: provider.name,
    accreditedBody: accreditedBody.name,
    studyMode: params.studyMode || studyMode,
    fundingType: params.fundingType || fundingType,
    subject: params.subject || subjects,
    subjectLevel: params.subjectLevel || subjectLevel,
    course: params.course || course,
    qualifications: params.qualifications || qualifications,
    courseCode: params.courseCode || courseCode,
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
    workHistory: params.workHistory || generateWorkHistory(submittedDate),
    schoolExperience:  params.schoolExperience || generateSchoolExperience(submittedDate),
    degree: params.degree || degree,
    gcse: params.gcse || gcse,
    englishLanguageQualification,
    otherQualifications,
    personalStatement: params.personalStatement || generatePersonalStatement(),
    references: params.references || generateReferences(status),
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
    id: '46436',
    status: 'Received',
    course: 'Modern languages (French) (MD9Q)',
    subject: [
      {
        "code": "F1",
        "name": "French"
      }
    ],
    personalDetails: {
      givenName: 'Malika',
      familyName: 'Boutella',
      sex: 'Female',
      dateOfBirth: '2001-06-07',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false
    },
    gcse: {
      maths: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'Maths',
        country: 'United Kingdom',
        grade: [
          {
            grade: 'C'
          }
        ],
        year: 2017
      },
      english: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        grade: [
          {
            grade: 'C'
          }
        ],
        year: 2017
      }
    },
    degree: [
      {
        type: 'BA',
        subject: 'French',
        institution: 'University of Sheffield',
        country: 'United Kingdom',
        grade: '3rd',
        predicted: false,
        startYear: '2019',
        graduationYear: '2022'
      }
    ],
    otherQualifications: [
      {
        "type": "A level",
        "subject": "Mathematics",
        "country": "United Kingdom",
        "grade": "C",
        "year": "2019"
      },
      {
        "type": "A level",
        "subject": "French",
        "country": "United Kingdom",
        "grade": "A",
        "year": "2019"
      }
    ],
    workHistory: {
      answer: 'yes',
      items: [
        {
          category: 'job',
          role: 'Waiter',
          org: 'Turtle Bay',
          type: 'Full time',
          relevantToTeaching: 'No',
          startDate: '2018-06-11',
          endDate: false,
          isStartDateApproximate: false,
          isEndDateApproximate: false
        }
      ]
    },
    schoolExperience: [],
    personalStatement: {
      vocation: "I feel I’m well placed to teach French having grown up in a french speaking family and being fluent in the language.",
      subjectKnowledge: "Thinking about my own experience in education, I appreciate the incredible impact my teachers had on my life."
    },
    safeguarding: {
      response: false
    },
    assignedUsers: [],
    cycle: CycleHelper.CURRENT_CYCLE.code
  }))


  applications.push(generateFakeApplication({
    id: '9475924',
    status: 'Received',
    course: 'History (H152)',
    subject: [
      {
        "code": "H1",
        "name": "History"
      }
    ],
    personalDetails: {
      givenName: 'Peter',
      familyName: 'Essien',
      sex: 'Male',
      dateOfBirth: '1997-09-19',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false
    },
    gcse: {
      maths: {
        hasQualification: 'Yes',
        type: 'Maths senior secondary school certificate',
        subject: 'Maths',
        country: 'Ghana',
        grade: [
          {
            grade: 'B'
          }
        ],
        year: 2015
      },
      english: {
        hasQualification: 'Yes',
        type: 'English senior secondary school certificate',
        subject: 'English',
        country: 'Ghana',
        grade: [
          {
            grade: 'B'
          }
        ],
        year: 2015
      }
    },
    degree: [
      {
        type: 'BEd',
        subject: 'Social Studies',
        institution: 'University of Education',
        country: 'Ghana',
        grade: 'Pass',
        predicted: false,
        startYear: '2016',
        graduationYear: '2019'
      }
    ],
    otherQualifications: [
      {
        "type": "Higher Diploma",
        "subject": "Higher Diploma",
        "country": "Ghana",
        "grade": "Pass",
        "year": "2015"
      }
    ],
    workHistory: {
      answer: 'yes',
      items: [
        {
          category: 'job',
          role: 'School Health and Education Coordinator',
          org: 'Ghana Education Service',
          type: 'Full time',
          relevantToTeaching: 'No',
          startDate: '2019-01-01',
          endDate: false,
          isStartDateApproximate: false,
          isEndDateApproximate: false
        }
      ]
    },
    schoolExperience: [],
    personalStatement: {
      vocation: "In my current role as a School Health and Education Coordinator, has opened my eyes to the fascinating subject of teaching. Seeing such young poverty-stricken children with so much life and eagerness to learn posed many questions: could sparking enthusiasm in children and engaging them to learn through their studies be for me? Am I destined to be a teacher? Where do I learn more about education and inspiring others through teaching? My wish to find out more about child development, education and school curriculum started my interest in teaching. My interest in schools and learning developed further in Sunday school, where I was introduced to areas of Special Education Needs and Disability learning support: child development and 1:1 mentoring, and the differing aspects of teaching in church as opposed to teaching in primary and secondary schools. I became interested in SEND, SENCOs and learning support challenges, leading me to embark upon a SEN training course. The course taught me about the SEN needs background and how the introduction of SEN children into mainstream schools impacted schools in their planning for communication, interaction, social, emotional and mental health difficulties. Beyond teaching, due to my infectious enthusiasm and brilliance in my role as a School Health and Education Coordinator I have learnt a lot about how a teacher should conduct themselves inside and outside the classroom.",
      subjectKnowledge: "I am personable, energetic and always up for a challenge. I have done a teaching internship at a secondary school where I supported SEN students with reading, writing, maths and French activities and lessons. While working in secondary education, I gained knowledge on child development, teaching strategies and behaviour management. I have also been familiarising myself with the English national curriculum and during my internship at Achimota Senior High School I was given the opportunity to assist teachers in planning lessons, managing behaviours in the classroom and supporting student learning whilst adhering to the national curriculum and child safeguarding guidelines. Through my work, I have a unique ability to see where students need support, I also communicate well with teachers and other teaching staff, to support a team atmosphere. I inspire a love for learning and find that children gravitate towards me in all areas of my life, this allows me to accomplish my classroom aims of supporting their understanding of subjects and encouragement in their healthy peer relationships."
    },
    safeguarding: {
      response: false
    },
    assignedUsers: [],
    cycle: CycleHelper.CURRENT_CYCLE.code
  }))


  applications.push(generateFakeApplication({
    id: '18571512',
    status: 'Received',
    course: 'Primary (2S8T)',
    subject: [
      {
        "code": "P1",
        "name": "Primary"
      }
    ],
    personalDetails: {
      givenName: 'Freida',
      familyName: 'Jackson',
      sex: 'Female',
      dateOfBirth: '1964-05-11',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false
    },
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
        year: 1980
      },
      english: {
        hasQualification: 'Yes',
        type: 'O level',
        subject: 'English',
        country: 'United Kingdom',
        grade: [
          {
            grade: 'B'
          }
        ],
        year: 1980
      },
      science: {
        hasQualification: 'Yes',
        type: 'O level',
        subject: 'Science',
        country: 'United Kingdom',
        grade: [
          {
            subject: 'Biology',
            grade: 'C'
          }
        ],
        year: 1980
      }
    },
    degree: [
      {
        type: 'BA',
        subject: 'German language',
        institution: 'University of East Anglia',
        country: 'United Kingdom',
        grade: 'First-class honours',
        predicted: false,
        startYear: '1982',
        graduationYear: '1986'
      }
    ],
    otherQualifications: false,
    workHistory: {
      answer: 'yes',
      items: [
        {
          category: 'job',
          role: 'Observing a classroom (unpaid)',
          org: 'St Marys Community Primary School',
          type: 'Full time',
          relevantToTeaching: 'Yes',
          startDate: '2022-09-1',
          endDate: '2022-11-30',
          isStartDateApproximate: false,
          isEndDateApproximate: false
        },
        {
          category: 'job',
          role: 'Administrative assistant',
          org: 'Mitchell and Mcgill Law Firm',
          type: 'Full time',
          relevantToTeaching: 'No',
          startDate: '2002-03-04',
          endDate: false,
          isStartDateApproximate: false,
          isEndDateApproximate: false
        }
      ]
    },
    schoolExperience: [],
    personalStatement: {
      vocation: "My education journey is firmly rooted in the inspiring primary school teachers I had growing up. I remember feeling fully supported, gently guided and made to feel I could achieve my goals. I now hope to become this type of teacher, to guide young children in a positive direction. I have volunteered at the school listening to readers in Key Stage 1 and Lower Key Stage 2. I particularly enjoyed engaging with the children and helping to reinforce their phonics knowledge, as well as watching the children develop their love of stories and reading for pleasure. I have also helped my own children throughout their schooling in helping them understand subjects they struggled with like Maths and foreign languages. Through observing teachers at St Mary’s Community Primary School, I have seen first-hand the demands of the profession; classroom and behaviour management within a mixed ability class, periods of assessment, and managing the expectations of parents and carers. However, I have also seen the unwavering commitment of all teachers towards their pupils, and the hundreds of ‘little wins’ that show how rewarding the role of teacher can be. I am particularly looking forward to being challenged and ultimately making a small difference. Though my intention will be to strive for perfection in my role as a teacher, I have realistic expectations. External factors such as a child’s behaviour, homelife and special educational needs may hinder my ability to succeed in this aim and it may at times feel like a struggle. However, I will aim to provide a stimulating learning environment for the children in my care, in conjunction with being supportive and encouraging while offering a safe space for children to make mistakes and learn from them.",
      subjectKnowledge: "Primary teaching offers a wide range of learning opportunities for children, and I hope to introduce the children to many different subjects and experiences. I have always loved languages and I carried this love through to completing a degree in German at the University of East Anglia. I firmly believe that introducing a second language to young children is vital. Not only will the children have their first experience of a different language, but it will also start a conversation about different cultures and the multicultural world that we live in. I hope to be able to use my enthusiasm for foreign languages in my role as a primary school teacher to start these conversations, and perhaps to inspire other children to seek out opportunities to learn and use a foreign language. I also have a particular love of literature and feel it is important to promote reading and storytelling from a young age. I hope to give children the confidence to learn to read, to broaden their vocabulary and ultimately to enjoy retrieving information from a written text. While studying for my English Literature A-level, I enjoyed reading poetry and comparing poems. I found the analysis of the structure of the poems and the use of rhythm and words chosen to be of particular interest. I look forward to introducing the children to poetry in the form of simple poems and nursery rhymes."
    },
    safeguarding: {
      response: false
    },
    assignedUsers: [],
    cycle: CycleHelper.CURRENT_CYCLE.code
  }))


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
