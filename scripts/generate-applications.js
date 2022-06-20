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

//   applications.push(generateFakeApplication({
//     status: 'Received',
//     cycle: CycleHelper.CURRENT_CYCLE.code
//   }))
//
//   applications.push(generateFakeApplication({
//     status: 'Received',
//     cycle: CycleHelper.CURRENT_CYCLE.code
//   }))


  applications.push(generateFakeApplication({
    course: 'History (HIS1)',
    courseCode: 'HIS1',
    studyMode: 'Full time',
    provider: user.organisation.name,
    id: '618451',
    status: 'Interviewing',
    assignedUsers: [],
    cycle: CycleHelper.CURRENT_CYCLE.code,
    subject: [
      {
        "code": "V1",
        "name": "History"
      }
    ],
    personalDetails: {
      givenName: 'Jennifer',
      familyName: 'Dyer',
      sex: 'Female',
      dateOfBirth: '1996-01-03',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false
    },
    "submittedDate": "2022-06-01T14:50:44.481+01:00",
    "interviews": {
      "items": [
        {
          "id": "02332342-787a-4e3d-bfec-c6a847d32247",
          "details": "As discussed by phone, please attend an interview with our panel.",
          "location": "100 School Drive, Birmingham, BR1 4SQ",
          "organisation": user.organisation.name,
          "date": "2022-06-16T10:00:00"
        }
      ]
    },
    degree: [
      {
        type: 'BA',
        subject: 'History',
        institution: 'University of Central Lancashire',
        country: 'United Kingdom',
        grade: '2:1',
        predicted: false,
        startYear: '2015',
        graduationYear: '2018'
      }
    ],
    gcse: {
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
        year: 2012
      },
      english: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'English',
            grade: 'A'
          }
        ],
        year: 2012
      }
    },
    otherQualifications: null,
    references: {},
    schoolExperience: [
    ],
    notes: {
      items: [
      ]
    },
    workHistory: {
      answer: 'yes',
      items: [
        {
          category: 'job',
          role: 'Bar staff',
          org: 'Berney Arms',
          type: 'Part time',
          relevantToTeaching: 'No',
          startDate: '2018-07-14',
          endDate: '2018-12-06',
          isStartDateApproximate: false,
          isEndDateApproximate: false
        },
        {
          category: 'job',
          role: 'Gallery attendant',
          org: 'Lancashire Museum',
          type: 'Full time',
          relevantToTeaching: 'No',
          startDate: '2019-01-14',
          endDate: '2019-06-06',
          isStartDateApproximate: false,
          isEndDateApproximate: false
        },
        {
          category: 'job',
          role: 'Family workshop leader',
          org: 'Lancashire Museum',
          type: 'Full time',
          relevantToTeaching: 'No',
          startDate: '2019-07-14',
          endDate: false,
          isStartDateApproximate: false,
          isEndDateApproximate: false
        }
      ]
    },
    safeguarding: {
      response: false
    },
    interviewNeeds: {
      response: false
    },
    disability: {
      response: false
    },
    personalStatement: {
      vocation: "The influence teachers have on young people cannot be understated. My memories of being a student are a testament to that, as my decision to become a teacher has been directly influenced by the positive experiences I had at secondary school.\n\nI feel I have the potential to inspire young people to reach their full potential, just as my teachers motivated me. I am passionate about supporting children to live a happy and healthy life, as well as helping them to develop the skills they need.\n\nWorking at a museum I’ve discovered that I’m able to listen and communicate well with children. I love to see the confidence a child can gain when they feel comfortable and secure.\n\nI have also recently completed a Level 1 in British Sign Language with the support of the museum where I work. This has helped broaden my communication skills as well as highlighting to me the importance of inclusion in education. This is something I hope to explore further when I train to become a teacher.",
      subjectKnowledge: "My current role as a family workshop leader has strengthened my passion to become a teacher. I have gained experience supporting the teaching of the National Curriculum for history, as well as helping students to get the best out of their time at the museum.\n\nOur summer workshops have been particularly rewarding, as students attend daily for a week and I’ve been able to see them develop their confidence from start to finish.\n\nI feel that my current employment has also given me a range of transferable skills. I currently provide training to new members of staff and have also been asked to update existing members of the team on changes to policies and procedures. Therefore I have to ensure that I am adaptable in my approach as I am aware that people all learn differently."
    },
  }))


  // TODO:
  // * applying for English course
  // * personal statement
  applications.push(generateFakeApplication({
    id: '736583',
    status: 'Conditions pending',
    course: 'English (E15P)',
    courseCode: 'E15P',
    studyMode: 'Full time',
    assignedUsers: [],
    subject: [
      {
        "code": "13",
        "name": "English"
      }
    ],
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Sandra',
      familyName: 'Smith',
      sex: 'Female',
      dateOfBirth: '1995-04-15',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false
    },
    "submittedDate": "2022-06-01T14:50:44.481+01:00",
    "interviews": {
      "items": [
        {
          "id": "02332342-787a-4e3d-bfec-c6a847d32247",
          "details": "As discussed by phone, please attend an interview with our panel.",
          "location": "100 School Drive, Birmingham, BR1 4SQ",
          "organisation": user.organisation.name,
          "date": "2022-06-16T11:00:00"
        }
      ]
    },
    degree: [
      {
        type: 'BA',
        subject: 'English and Journalism',
        institution: 'University of Birmingham',
        country: 'United Kingdom',
        grade: '2:1',
        predicted: false,
        startYear: '2014',
        graduationYear: '2017'
      }
    ],
    gcse: {
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
        year: 2011
      },
      english: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'English language',
            grade: 'A'
          },
          {
            exam: 'English literature',
            grade: 'A'
          }
        ],
        year: 2011
      }
    },
    otherQualifications: null,
    "references": {
      "first": {
        "type": "School based",
        "name": "Madie Olson",
        "email": "madie.olson58@birminghamhigh.birmingham.sch.uk",
        "tel": "0500 471823",
        "relationship": {
          "summary": "SENCO lead at Birmingham High School where I’ve been working as a Teaching Assistant since 2017.",
          "validated": true
        },
        "safeguarding": {
          "response": "no"
        },
        "comments": "Sandra joined our school in September 2107 as a teaching assistant. In the first year, she was assigned to assist one student who has complex medical needs. \n\nAs a result of his illness, this student missed a lot of classes and needed support to catch up. Sandra forged a good relationship with this student and completed training to make sure she could support his healthcare needs. \n\nSandra showed that she was able to provide support in subjects across the curriculum up to GCSE. This year, she has widened her role to include supporting other students with a variety of SEND needs such as learning difficulties and ADHD. \n\nShe works well with teaching staff to ensure that the curriculum is accessible for the students. She is able to give constructive written feedback on learner progress to inform review paperwork and he has attended meetings with parents, learners and professionals. \n\nSandra has also supported students on school trips and coached them during sports sessions. During the pandemic, she kept in regular contact with students and their parents. She was able to give subject advice as well as helping with the use of software. \n\nHaving familiarised herself with the demands of working within a secondary school, Sandra now wants to take the next step and train to become a teacher. I feel she has more than enough experience to do so."
      },
      "second": {
        "type": "Academic",
        "name": "Stephon Lesch",
        "email": "stephon66@birmingham.ac.uk",
        "tel": "0915 358 2730",
        "relationship": {
          "summary": "Personal tutor at University.",
          "validated": true
        },
        "safeguarding": {
          "response": "no"
        },
        "comments": "I can confirm that Sandra performed very well in her studies. I have high hopes for the continued development of her career and think she would be well suited for further academic or professional studies, including a vocation such as teaching.\n\nSandra received praise from several tutors during her undergraduate career and was one of the strongest students in her peer group. Her tutors reported that she had a clear and strong motivation to do well in her chosen career. She also had ample experience of the work environment, including the world of journalism.\n\nIn the classes which I taught, Sandra was been attentive, well-read and very well prepared. She always performed the required reading before seminars and participated with strongly reasoned arguments. She was also able to express herself with great passion and clarity, which are useful attributes for teaching. \n\nThis clarity of expression was also reflected in good coursework marks, indicating a strong level of analytical ability based on sound research skills.\n\nI do not know of any reason why Sandra would not make an excellent teacher. I have no doubts about her honesty or integrity or any of the other personal qualities required when working with children. I would strongly recommend her as a candidate."
      }
    },
    schoolExperience: [
    ],
    notes: {
      items: [
      ]
    },
    workHistory: {
      answer: 'yes',
      items: [
        {
          category: 'job',
          role: 'Sales assistant',
          org: 'Birmingham Superstore',
          type: 'Part time',
          relevantToTeaching: 'No',
          startDate: '2017-07-14',
          endDate: '2017-08-06',
          isStartDateApproximate: false,
          isEndDateApproximate: false
        },
        {
          category: 'job',
          role: 'Teaching assistant',
          org: 'Birmingham High School',
          type: 'Full time',
          relevantToTeaching: 'Yes',
          startDate: '2017-09-14',
          endDate: false,
          isStartDateApproximate: false,
          isEndDateApproximate: false
        }
      ]
    },
    safeguarding: {
      response: false
    },
    interviewNeeds: {
      response: false
    },
    disability: {
      response: false
    },
    personalStatement: {
      vocation: "My desire to teach stems from an appreciation of the impact that teachers have on the lives of students both inside and outside the classroom.\n\nOver the past few years, my position as a teaching assistant at Birmingham High School has given me the essential experience of being in a classroom and seeing the interactions between teachers and students. It has also made me aware of the demands of teaching. I realise that the classroom can be a high-pressure environment where things move quickly due to time constraints.\n\nAs a teaching assistant, most of my work involves supporting students who have special educational needs and disabilities. Working with these students has been extremely rewarding, particularly when I see them make progress.\n\nLooking further back, my degree in English and Journalism played a large role in developing my organisational skills, vocabulary and understanding of English grammar. This gives me a foundation to further enhance my skills by training to become a teacher.\n\nPerhaps unexpectedly, my job as a sales assistant also informed my decision to teach. It was a role in which good communication was essential, as I spent most of my time talking to customers. This taught me the significance of speaking in a clear and professional way, a skill which I would expect to need in the classroom.\n\nI would take great pleasure in training to become a teacher. Having worked with young people for the last few years, my decision to get into the profession was straightforward because I value the sense of achievement I feel when I see the impact I have on a student. I believe that my qualities would make me an effective teacher.",
      subjectKnowledge: "I have been passionate about the study of English for as long as I can remember. From as early as year 6 it was my aim to go to university to study English. Now I’m driven by the idea that I could go back to school as a teacher and teach my favourite subject.\n\nMy passion began due to the time I spent with my own teachers, who taught me skills which I have used in every facet of my life. I feel that a secondary school environment is the perfect place for me to help shape the minds of young people.\n\nMy undergraduate degree in English and Journalism as well as my A level in English Language would of course by the foundation of my ability to teach English in a secondary school. My degree in particular equipped me with a broad knowledge of English language and literature. I was required to produce creative writing pieces throughout the course, as well as analyse literature for assignments.\n\nHaving worked as a teaching assistant for two years and assisted in English lessons, I am positive that secondary education is where I would be most effective. I have learned valuable skills such as different teaching strategies, behaviour management and lesson planning. I have also had experience of communicating in a professional manner with both students and parents.\n\nTeaching is a challenging profession but I believe that it will also be rewarding. Teaching at secondary level will let me continue to work with the age group I already have experience with. This will in turn allow me to hone my skills in order to give them the best possible chance to succeed."
    },
    "offer": {
      "provider": "Birmingham SCITT",
      "course": "English (E15P)",
      "courseCode": "E15P",
      "location": {
        "id": "6220db19-815a-4314-a2c4-c89ff69ed27b",
        "name": "Main site",
        "address": {
          "address1": "123 Main Street",
          "town": "Birmingham",
          "postcode": "BR4 2CD"
        },
        "organisation": {
          "id": "c908772c-81b1-4bdb-8f8c-fea1465b8f74",
          "name": "Birmingham SCITT"
        }
      },
      "studyMode": "Full time",
      "accreditedBody": "Birmingham SCITT",
      "fundingType": "Fee paying",
      "qualifications": [
        "QTS"
      ],
      "madeDate": "2022-06-13T14:50:44.481+01:00",
      "acceptedDate": "2022-06-14T14:50:44.481+01:00",
      "standardConditions": [
        {
          "id": "b6928343-d052-4fb0-8f95-3e2fc853fed3",
          "description": "Fitness to train to teach check",
          "status": "Met"
        },
        {
          "id": "32960a3a-eb2f-4acf-8a9e-3dc89bfa4685",
          "description": "Disclosure and Barring Service (DBS) check",
          "status": "Met"
        },
        {
          "id": "532d135e-b3b8-4a7e-94de-7702a5fca587",
          "description": "Two references",
          "status": "Pending"
        }
      ],
      "withdrawalDate": null,
      "withdrawalReasons": null
    },
  }))


  applications.push(generateFakeApplication({
    id: '647592',
    status: 'Conditions pending',
    course: 'English (E15P)',
    courseCode: 'E15P',
    studyMode: 'Full time',
    assignedUsers: [],
    subject: [
      {
        "code": "13",
        "name": "English"
      }
    ],
    cycle: CycleHelper.CURRENT_CYCLE.code,
    personalDetails: {
      givenName: 'Andy',
      familyName: 'Pascoe',
      sex: 'Male',
      dateOfBirth: '1995-04-15',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false
    },
    "submittedDate": "2022-06-01T14:50:44.481+01:00",
    "interviews": {
      "items": [
      ]
    },
    degree: [
      {
        type: 'BA',
        subject: 'English and Journalism',
        institution: 'University of Birmingham',
        country: 'United Kingdom',
        grade: '2:1',
        predicted: false,
        startYear: '2014',
        graduationYear: '2017'
      }
    ],
    gcse: {
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
        year: 2011
      },
      english: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'English language',
            grade: 'A'
          },
          {
            exam: 'English literature',
            grade: 'A'
          }
        ],
        year: 2011
      }
    },
    otherQualifications: null,
    "references": {
      "first": {
        "type": "School based",
        "name": "Madie Olson",
        "email": "madie.olson58@birminghamhigh.birmingham.sch.uk",
        "tel": "0500 471823",
        "relationship": {
          "summary": "TODO",
          "validated": true
        },
        "safeguarding": {
          "response": "no"
        },
        "comments": "TODO\n\nTODO"
      },
      "second": {
        "type": "Academic",
        "name": "Stephon Lesch",
        "email": "stephon66@birmingham.ac.uk",
        "tel": "0915 358 2730",
        "relationship": {
          "summary": "TODO",
          "validated": true
        },
        "safeguarding": {
          "response": "no"
        },
        "comments": "TODO"
      }
    },
    schoolExperience: [
    ],
    notes: {
      items: [
      ]
    },
    workHistory: {
      answer: 'yes',
      items: [
        {
          category: 'job',
          role: 'Sales assistant',
          org: 'Birmingham Superstore',
          type: 'Part time',
          relevantToTeaching: 'No',
          startDate: '2017-07-14',
          endDate: '2017-08-06',
          isStartDateApproximate: false,
          isEndDateApproximate: false
        },
        {
          category: 'job',
          role: 'Teaching assistant',
          org: 'Birmingham High School',
          type: 'Full time',
          relevantToTeaching: 'Yes',
          startDate: '2017-09-14',
          endDate: false,
          isStartDateApproximate: false,
          isEndDateApproximate: false
        }
      ]
    },
    safeguarding: {
      response: false
    },
    interviewNeeds: {
      response: false
    },
    disability: {
      response: false
    },
    personalStatement: {
      vocation: "TODO",
      subjectKnowledge: "TODO"
    },
    "offer": {
      "provider": "The University of Warwick",
      "course": "French and German (MJOT)",
      "courseCode": "MJOT",
      "location": {
        "id": "6220db19-815a-4314-a2c4-c89ff69ed27b",
        "name": "Main site",
        "address": {
          "address1": "123 Main Street",
          "town": "Some town",
          "postcode": "AB1 2CD"
        },
        "organisation": {
          "id": "c908772c-81b1-4bdb-8f8c-fea1465b8f74",
          "name": "Oxford University"
        }
      },
      "studyMode": "Full time",
      "accreditedBody": "The University of Warwick",
      "fundingType": "Fee paying",
      "qualifications": [
        "QTS"
      ],
      "madeDate": "2022-06-13T14:50:44.481+01:00",
      "acceptedDate": "2022-06-14T14:50:44.481+01:00",
      "standardConditions": [
        {
          "id": "b6928343-d052-4fb0-8f95-3e2fc853fed3",
          "description": "Fitness to train to teach check",
          "status": "Met"
        },
        {
          "id": "32960a3a-eb2f-4acf-8a9e-3dc89bfa4685",
          "description": "Disclosure and Barring Service (DBS) check",
          "status": "Met"
        },
        {
          "id": "532d135e-b3b8-4a7e-94de-7702a5fca587",
          "description": "Two references",
          "status": "Pending"
        }
      ],
      "withdrawalDate": null,
      "withdrawalReasons": null
    },
  }))



//   applications.push(generateFakeApplication({
//     status: 'Interviewing',
//     cycle: CycleHelper.CURRENT_CYCLE.code
//   }))
//
//   applications.push(generateFakeApplication({
//     status: 'Conditions pending',
//     cycle: CycleHelper.CURRENT_CYCLE.code
//   }))
//
//   applications.push(generateFakeApplication({
//     status: 'Conditions pending',
//     cycle: CycleHelper.CURRENT_CYCLE.code
//   }))

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
