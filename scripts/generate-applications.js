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

  if(!params.otherQualifications) {
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
    course: 'Mathematics (MA14)',
    subject: [
      {
        "code": "M1",
        "name": "Mathematics"
      }
    ],
    personalDetails: {
      givenName: 'Jane',
      familyName: 'Smith',
      sex: 'Female',
      dateOfBirth: '1994-01-03',
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
            grade: 'A'
          }
        ],
        year: 2009
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
        year: 2009
      },
      science: {
        hasQualification: 'Yes',
        type: 'GCSE',
        subject: 'Double Science',
        country: 'United Kingdom',
        grade: [
          {
            exam: 'English',
            grade: 'BB'
          }
        ],
        year: 2009
      }
    },
    degree: [
      {
        type: 'BSc',
        subject: 'Mathematics',
        institution: 'University of Central Lancashire',
        country: 'United Kingdom',
        grade: '2:1',
        predicted: false,
        startYear: '2011',
        graduationYear: '2015'
      }
    ],
    otherQualifications: [
      {
        "type": "A level",
        "subject": "Mathematics",
        "country": "United Kingdom",
        "grade": "A",
        "year": "2011"
      }
    ],
    workHistory: {
      answer: 'yes',
      items: [
        {
          category: 'job',
          role: 'Librarian',
          org: 'Lancashire libraries service',
          type: 'Full time',
          relevantToTeaching: 'No',
          startDate: '2015-07-14',
          endDate: '2018-12-06',
          isStartDateApproximate: false,
          isEndDateApproximate: false
        },
        {
          category: 'job',
          role: 'Researcher',
          org: 'University of Lancashire',
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
      vocation: "During my school days it was my maths teacher who inspired and taught me to love maths. I discovered that through good teaching methods and stirring up a student’s love and passion for learning anything is possible. I learned from this teacher that mathematics is fun and not as horrible as I thought, the hatred for mathematics was replaced by love and interest to study and practice. This inspired and made me develop an interest in teaching to help students who might be having similar issues.\n\n When I studied maths at university, I discovered that with the right teaching methods, love, patience, understanding, and helping the students develop love and interest in learning, there is virtually no student that can’t learn mathematics. Sound knowledge of the concepts by the teacher builds his/her confidence and also builds the student's trust in the teacher which in turn motivates them to learn.\n\n From working at a university (although I was a researcher) I learned that a lot is expected from teachers as students look up to them as role models and mentors and as such, it is expected that the teacher should be a person of integrity. Because of this I try and model the right attitudes and virtues to every student I have come in contact with at my job.\n\n From being both a librarian and researcher, I have also discovered that learning is not limited to the four walls of the classroom and learning can take place anywhere and anytime. Students tend to retain information or ideas learned during fun or personal discovery for a longer period, so extracurricular activities also help to produce a balanced student and I believe it is an important aspect of learning.\n\n The education system and curriculum should have the well-being and development of the child at their centre. The interest and wholesome development of the child should be the goal of educational policies and the curriculum. Having children who are developed in all areas will eventually result in an organised and a developed society.\n\n I strongly believe that obtaining the Qualified Teachers Status certificate will boost and increase my chances of working and impacting the lives of students.",
      subjectKnowledge: "I studied mathematics at the university. This helped to sharpen my critical thinking skills and also aided my reasoning. I naturally appreciate numbers and possess a strong affinity for patterns and logic.\n\n I am familiar with the curriculum and I have prepared my own children for their own maths exams. I have also informally helped students at the university with their lessons and mathematical concepts. These experiences have enabled me to acquire the necessary skills to excel as a teacher. Having good communication skills and being an adept listener have given me room for mutual understanding and improved student-teacher relationships.\n\n I enjoy working with students in my current role as a university researcher. I believe that this stage of their life is crucial in making career decisions, and I love to see that they do not allow their former hatred for mathematics to stop them from pursuing their careers."
    },
    safeguarding: {
      response: false
    },
    assignedUsers: [],
    cycle: CycleHelper.CURRENT_CYCLE.code
  }))


  applications.push(generateFakeApplication({
    course: 'Mathematics (MA14)',
    courseCode: 'HIS1',
    studyMode: 'Full time',
    provider: user.organisation.name,
    id: '63633',
    status: 'Received',
    assignedUsers: [],
    cycle: CycleHelper.CURRENT_CYCLE.code,
    subject: [
      {
        "code": "M1",
        "name": "Mathematics"
      }
    ],
    personalDetails: {
      givenName: 'Tommy',
      familyName: 'Doyle',
      sex: 'Male',
      dateOfBirth: '1996-01-03',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false
    },
    degree: [
      {
        type: 'BSc',
        subject: 'Mathematics',
        institution: 'University of Leeds',
        country: 'United Kingdom',
        grade: '2:1',
        predicted: false,
        startYear: '2018',
        graduationYear: '2021'
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
            grade: 'A'
          }
        ],
        year: 2016
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
        year: 2016
      }
    },
    otherQualifications: [
      {
        "type": "A level",
        "subject": "Mathematics",
        "country": "United Kingdom",
        "grade": "A",
        "year": "2018"
      },
      {
        "type": "A level",
        "subject": "Statistics",
        "country": "United Kingdom",
        "grade": "B",
        "year": "2018"
      },
      {
        "type": "A level",
        "subject": "Economics",
        "country": "United Kingdom",
        "grade": "C",
        "year": "2018"
      }
    ],
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
          org: 'Red Lion pub',
          type: 'Full time',
          relevantToTeaching: 'No',
          startDate: '2021-07-14',
          endDate: false,
          isStartDateApproximate: false,
          isEndDateApproximate: false
        }
      ]
    },
    schoolExperience: [
    ],
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
      vocation: "My primary motivation for wanting to become a teacher is that I love working with children and supporting them in developing as individuals and reaching their full potential. I believe teaching would be an enjoyable and rewarding career for me and one to which I am well-suited.\n\n I received advice from a Teaching Advisor that becoming a teacher would be the best way to pursue a career in education and one that was open to me as a holder of a Mathematics degree. After reflection on this advice I came to the conclusion that this was something I was interested in.\n\n My first experience of working with children was as a support worker at a community centre in my area. During my time at the centre I had the privilege to work with a wide range of students and learned a huge amount about working with young people.\n\n My work as a support worker (both with adults and children) has required me to support people in accessing their communities and taking part in outings and activities of a wide variety. I also have led after school and lunchtime clubs related to my own interests, including maths and music. I believe this experience would be invaluable in contributing to a school inside and outside the classroom.\n\n In addition, my experience as a performer has helped me build the confidence to stand in front of a classroom. I have also received extensive training in safeguarding and behaviour support having worked with adults and children with SEND for many years. I believe it is paramount to the development of healthy and happy young people that the professionals working with them are good role-models, and that with vigilance, dedication and compassion a teacher can make a huge difference to their lives. It would be an enormous honour to be given the opportunity to become a teacher.",
      subjectKnowledge: "Mathematics has always been one of my strongest subjects and I chose to study this subject at A-Level and for my degree because of the satisfaction I gained from working through complex problems. I am already confident with the curriculum so I feel I am well placed to teach it.\n\n I studied a BSc in Maths at Leeds University and I found the subjects I studied fascinating and this knowledge of high-level Mathematics would be beneficial when working with students who have the ability and inclination to take their study of the subject further.\n\n I also have experience of organising and delivering a study clubs to groups of SEND students at a community centre in my area. This was enormously rewarding, particularly in the way I saw the students develop and begin to enjoy the practice over many months.\n\n I have had a lifelong interest in music. I have played and sung in various different groups over the years in front of many audiences, and this has helped me build confidence in public speaking and presentation. I am always keen to inspire and encourage a love for music in young people and would welcome any opportunities a career in teaching presented me with to do this."
    }
  }))



  applications.push(generateFakeApplication({
    course: 'Mathematics (MA14)',
    courseCode: 'HIS1',
    studyMode: 'Full time',
    provider: user.organisation.name,
    id: '618451',
    status: 'Received',
    assignedUsers: [],
    cycle: CycleHelper.CURRENT_CYCLE.code,
    subject: [
      {
        "code": "M1",
        "name": "Mathematics"
      }
    ],
    personalDetails: {
      givenName: 'Aisha',
      familyName: 'Fadel',
      sex: 'Female',
      dateOfBirth: '1996-01-03',
      nationalities: [
        'British'
      ],
      isInternationalCandidate: false
    },
    degree: [
      {
        type: 'BSc',
        subject: 'Economics',
        institution: 'University of Central Lancashire',
        country: 'United Kingdom',
        grade: '2:1',
        predicted: false,
        startYear: '2018',
        graduationYear: '2021'
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
        year: 2016
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
        year: 2016
      }
    },
    otherQualifications: [
      {
        "type": "A level",
        "subject": "Economics",
        "country": "United Kingdom",
        "grade": "A",
        "year": "2018"
      },
      {
        "type": "A level",
        "subject": "Mathematics",
        "country": "United Kingdom",
        "grade": "B",
        "year": "2018"
      },
      {
        "type": "A level",
        "subject": "Chemistry",
        "country": "United Kingdom",
        "grade": "C",
        "year": "2018"
      }
    ],
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
          role: 'Business Analyst',
          org: 'Department for Work and Pensions',
          type: 'Full time',
          relevantToTeaching: 'No',
          startDate: '2021-07-14',
          endDate: false,
          isStartDateApproximate: false,
          isEndDateApproximate: false
        }
      ]
    },
    schoolExperience: [
    ],
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
      vocation: "I want to become a teacher because I’m passionate about learning, I love working with youth groups and I want to have a positive impact on the future of humanity. I believe education has the power to transform and empower the world. Our children are our most valuable asset and education is the key by which their true value can be realised.\n\n My teachers played a pivotal role in educating, inspiring, and shaping my life, and now I aspire to do the same for my students. For me, contributing to children's education, growth and development is exciting, meaningful, and satisfying. This is also a way for me to give back to society, what I have been privileged to receive, which brings me joy.\n\n Every teacher has a different personality but teachers who were my role models had some common traits, which I deem to be essential for being a good teacher. They were always trustworthy, understood their students, relationship builders, and excellent presenters and listeners. In my short career, I have worked on weaving these traits into my job.",
      subjectKnowledge: "My educational background includes A levels in Maths, Chemistry and Economics, and a degree in Economics. I believe these credentials will enable me to teach the curriculum to students as I know the subject matter very well because I am familiar with the curriculum having only finished my A levels 3 years ago.\n\n I am also currently volunteering as an exam invigilator at local schools in my area. I am responsible for ensuring that exam rules are being followed and that students are being supervised in an appropriate manner. I have performed my invigilator duties with utmost responsibility and am good at managing special and/or unforeseen circumstances such as a student feeling sick or a fire alarm going off. This experience has helped me see how things are run at a school and has helped me form good relationships with other teachers."
    }
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
