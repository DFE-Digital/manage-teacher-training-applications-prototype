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
          role: 'School placement experience',
          org: 'Bishop Vesey Grammar School',
          type: 'Full time',
          relevantToTeaching: 'Yes',
          startDate: '2022-09-14',
          endDate: '2022-10-14',
          isStartDateApproximate: false,
          isEndDateApproximate: false
        },
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
      vocation: "I feel I’m well placed to teach French having grown up in a french speaking family and being fluent in the language. Sharing my knowledge of this wonderful language and leading the way has always been one of my dreams for a long time. Teaching can be both very rewarding and challenging, which I have experienced through going to Bishop Vesey Grammar School on a 1 month school experience program to observe how teachers operate. Education is not the process of filling a bucket. It’s the experience of helping someone achieve whatever they want. Being part of that process and helping to shape young people’s future is what I’m passionate about.",
      subjectKnowledge: "Thinking about my own experience in education, I appreciate the incredible impact my teachers had on my life. I know that teachers provide skills and knowledge used by young people throughout life. My greatest aim as a teacher is to be a role model. I want to cultivate open minds and help pupils believe in their own capacity to make positive contributions to society."
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
      dateOfBirth: '1994-01-03',
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
