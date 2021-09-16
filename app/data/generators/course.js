const faker = require('faker')
faker.locale = 'en_GB'
const weighted = require('weighted')

const arrayToList = (array, join = ', ', final = ' and ') => {
  const arr = array.slice(0)

  const last = arr.pop()

  if (array.length > 1) {
    return arr.join(join) + final + last
  }

  return last
}

module.exports = (params = {}) => {

  // ---------------------------------------------------------------------------
  // Subject level
  // ---------------------------------------------------------------------------
  const subjectLevelOptions = {
    primary: 'Primary',
    secondary: 'Secondary',
    further: 'Further education'
  }

  const selectedSubjectLevel = weighted.select({
    primary: 0.158,
    secondary: 0.839,
    further: 0.003
  })

  const subjectLevel = subjectLevelOptions[selectedSubjectLevel]

  // ---------------------------------------------------------------------------
  // Subjects
  // ---------------------------------------------------------------------------
  const subjectOptions = {
    primary: {
      P01: { code: '00', name: 'Primary' },
      P02: { code: '01', name: 'Primary with English' },
      P03: { code: '02', name: 'Primary with geography and history' },
      P04: { code: '03', name: 'Primary with mathematics' },
      P05: { code: '04', name: 'Primary with modern languages' },
      P06: { code: '06', name: 'Primary with physical education' },
      P07: { code: '07', name: 'Primary with science' }
    },
    secondary: {
      S01: { code: 'W1', name: 'Art and design' },
      S02: { code: 'C1', name: 'Biology' },
      S03: { code: '08', name: 'Business studies' },
      S04: { code: 'F1', name: 'Chemistry' },
      S05: { code: '09', name: 'Citizenship' },
      S06: { code: 'Q8', name: 'Classics' },
      S07: { code: 'P3', name: 'Communications and media studies' },
      S08: { code: '11', name: 'Computing' },
      S09: { code: '12', name: 'Dance' },
      S10: { code: 'DT', name: 'Design and technology' },
      S11: { code: 'Q3', name: 'Drama' },
      S12: { code: 'L1', name: 'Economics' },
      S13: { code: '13', name: 'English' },
      S14: { code: '16', name: 'English as a second or other language' },
      S15: { code: '15', name: 'French' },
      S16: { code: 'F8', name: 'Geography' },
      S17: { code: '17', name: 'German' },
      S18: { code: 'L5', name: 'Health and social care' },
      S19: { code: 'V1', name: 'History' },
      S20: { code: '18', name: 'Italian' },
      S21: { code: '19', name: 'Japanese' },
      S22: { code: '20', name: 'Mandarin' },
      S23: { code: 'G1', name: 'Mathematics' },
      S24: { code: '24', name: 'Modern languages (other)' },
      S25: { code: 'W3', name: 'Music' },
      S26: { code: 'P1', name: 'Philosophy' },
      S27: { code: 'C6', name: 'Physical education' },
      S28: { code: 'F3', name: 'Physics' },
      S29: { code: 'C8', name: 'Psychology' },
      S30: { code: 'V6', name: 'Religious education' },
      S31: { code: '21', name: 'Russian' },
      S32: { code: 'F0', name: 'Science' },
      S33: { code: '14', name: 'Social sciences' },
      S34: { code: '22', name: 'Spanish' }
    },
    further: {
      F01: { code: '41', name: 'Further education'}
    }
  }

  const selectedSubject = {
    primary: weighted.select({
      P01: 0.871,
      P02: 0.007,
      P03: 0.006,
      P04: 0.084,
      P05: 0.006,
      P06: 0.018,
      P07: 0.008
    }),
    secondary: weighted.select({
      S01: 0.042,
      S02: 0.066,
      S03: 0.025,
      S04: 0.07,
      S05: 0.003,
      S06: 0.003,
      S07: 0.004,
      S08: 0.052,
      S09: 0.007,
      S10: 0.052,
      S11: 0.03,
      S12: 0.004,
      S13: 0.082,
      S14: 0,
      S15: 0.038,
      S16: 0.062,
      S17: 0.02,
      S18: 0.004,
      S19: 0.058,
      S20: 0.001,
      S21: 0,
      S22: 0.002,
      S23: 0.083,
      S24: 0.031,
      S25: 0.037,
      S26: 0,
      S27: 0.048,
      S28: 0.074,
      S29: 0.011,
      S30: 0.044,
      S31: 0,
      S32: 0.003,
      S33: 0.011,
      S34: 0.033
    }),
    further: weighted.select({
      F01: 1
    })
  }

  const subjects = []

  // Primary -------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  if (subjectLevel === 'Primary') {
    subjects.push(subjectOptions.primary[selectedSubject.primary])
  }

  // Secondary -----------------------------------------------------------------
  // ---------------------------------------------------------------------------
  if (subjectLevel === 'Secondary') {
    const subject = subjectOptions.secondary[selectedSubject.secondary]
    subjects.push(subject)

    if (subject.name === 'Business studies') {
      subjects.push({ code: 'L1', name: 'Economics' })
    }

    if (subject.name === 'Drama') {
      const additionalSubjectOptions = {
        a: null,
        b: { code: '12', name: 'Dance' },
        c: { code: '13', name: 'English' },
        d: { code: 'W3', name: 'Music' }
      }

      const selectedSubject = weighted.select({
        a: 0.6,
        b: 0.2,
        c: 0.2,
        d: 0.2
      })

      const subject = additionalSubjectOptions[selectedSubject]

      if (subject) {
        subjects.push(subject)
      }
    }

    if (subject.name === 'Geography') {
      const additionalSubjectOptions = {
        a: null,
        b: { code: 'V1', name: 'History' }
      }

      const selectedSubject = weighted.select({
        a: 0.8,
        b: 0.2
      })

      const subject = additionalSubjectOptions[selectedSubject]

      if (subject) {
        subjects.push(subject)
      }
    }

    if (subject.name === 'Psychology') {
      const additionalSubjectOptions = {
        a: null,
        b: { code: 'C1', name: 'Biology' }
      }

      const selectedSubject = weighted.select({
        a: 0.8,
        b: 0.2
      })

      const subject = additionalSubjectOptions[selectedSubject]

      if (subject) {
        subjects.push(subject)
      }
    }

    if (subject.name === 'Physical education') {
      const additionalSubjectOptions = {
        a: null,
        b: { code: 'C1', name: 'Biology' }
      }

      const selectedSubject = weighted.select({
        a: 0.75,
        b: 0.25
      })

      const subject = additionalSubjectOptions[selectedSubject]

      if (subject) {
        subjects.push(subject)
      }
    }

    if (['French','German','Italian','Spanish'].includes(subject.name)) {
      const languageCount = faker.datatype.number({ 'min': 1, 'max': 2 })

      const languageChoices = [
        { code: '15', name: 'French' },
        { code: '17', name: 'German' },
        { code: '18', name: 'Italian' },
        { code: '22', name: 'Spanish' }
      ]

      const shuffledLanguages = languageChoices.sort(() => 0.5 - Math.random())

      const languages = shuffledLanguages.slice(0, languageCount).sort()

      languages.forEach((language, i) => {
        if (!subjects.filter( subject => subject.name === language.name ).length) {
          subjects.push(language)
        }
      })
    }

    if (['Japanese','Mandarin','Russian'].includes(subject.name)) {
      const languageCount = faker.datatype.number({ 'min': 1, 'max': 2 })

      const languageChoices = [
        { code: '19', name: 'Japanese' },
        { code: '20', name: 'Mandarin' },
        { code: '21', name: 'Russian' }
      ]

      const shuffledLanguages = languageChoices.sort(() => 0.5 - Math.random())

      const languages = shuffledLanguages.slice(0, languageCount).sort()

      languages.forEach((language, i) => {
        if (!subjects.filter( subject => subject.name === language.name ).length) {
          subjects.push(language)
        }
      })
    }

    if (['Biology','Chemistry','Physics'].includes(subject.name)) {
      const scienceCount = faker.datatype.number({ 'min': 1, 'max': 2 })

      const scienceChoices = [
        { code: 'C1', name: 'Biology' },
        { code: 'F1', name: 'Chemistry' },
        { code: 'F3', name: 'Physics' }
      ]

      const shuffledSciences = scienceChoices.sort(() => 0.5 - Math.random())

      const sciences = shuffledSciences.slice(0, scienceCount).sort()

      sciences.forEach((science, i) => {
        if (!subjects.filter( subject => subject.name === science.name ).length) {
          subjects.push(science)
        }
      })
    }
  }

  // Further education ---------------------------------------------------------
  // ---------------------------------------------------------------------------
  if (subjectLevel === 'Further education') {
    subjects.push(subjectOptions.further[selectedSubject.further])
  }

  // ---------------------------------------------------------------------------
  // Funding type
  // ---------------------------------------------------------------------------
  const fundingTypeOptions = {
    fee: 'Fee paying',
    salary: 'Salaried',
    apprenticeship: 'Apprenticeship'
  }

  const selectedFundingType = weighted.select({
    fee: 0.855,
    salary: 0.026,
    apprenticeship: 0.119
  })

  const fundingType = fundingTypeOptions[selectedFundingType]

  // ---------------------------------------------------------------------------
  // Programme type
  // ---------------------------------------------------------------------------
  // TODO: programme type based on provider type and funding type

  const programmeTypeOptions = {
    ss: { code: 'SS', name: 'School direct salaried training programme' },
    ta: { code: 'TA', name: 'Teaching apprenticeship' },
    he: { code: 'HE', name: 'Higher education programme' },
    sc: { code: 'SC', name: 'SCITT programme' },
    sd: { code: 'SD', name: 'School direct training programme' }
  }

  const selectedProgrammeType = weighted.select({
    ss: 0.119,
    ta: 0.026,
    he: 0.087,
    sc: 0.154,
    sd: 0.613
  })

  const programmeType = programmeTypeOptions[selectedProgrammeType]

  // ---------------------------------------------------------------------------
  // Study mode
  // ---------------------------------------------------------------------------
  const studyModeOptions = {
    full: ['Full time'],
    part: ['Part time'],
    both: ['Full time','Part time']
  }

  const selectedStudyMode = weighted.select({
    full: 0.935,
    part: 0.024,
    both: 0.041
  })

  const studyModes = studyModeOptions[selectedStudyMode]

  // ---------------------------------------------------------------------------
  // Financial support
  // ---------------------------------------------------------------------------
  const financialSupportOptions = {
    yes: 'Yes',
    no: 'No'
  }

  const selectedFinancialSupport = weighted.select({
    yes: 0.01,
    no: 0.99
  })

  const financialSupport = financialSupportOptions[selectedFinancialSupport]

  // ---------------------------------------------------------------------------
  // Course length
  // ---------------------------------------------------------------------------
  const courseLengthOptions = {
    one: 'One year',
    two: 'Two years'
  }

  const selectedCourseLength = weighted.select({
    one: 0.95,
    two: 0.05
  })

  let courseLength = courseLengthOptions[selectedCourseLength]

  // Override the course length if the course is only full time
  if (studyModes[0] === 'Full time') {
    courseLength === courseLengthOptions.one
  }

  // ---------------------------------------------------------------------------
  // Qualifications
  // ---------------------------------------------------------------------------
  const qualificationOptions = {
    pgce: ['PGCE'],
    pgde: ['PGDE'],
    qts: ['QTS'],
    qts_pgce: ['PGCE','QTS'],
    qts_pgde: ['PGDE','QTS']
  }

  const selectedQualification = weighted.select({
    pgce: 0.002,
    pgde: 0.001,
    qts: 0.195,
    qts_pgce: 0.791,
    qts_pgde: 0.011
  })

  const qualifications = qualificationOptions[selectedQualification]

  // ---------------------------------------------------------------------------
  // Age range
  // ---------------------------------------------------------------------------
  const ageRangeOptions = {
    primary: {
      r3_to_7: '3 to 7',
      r3_to_11: '3 to 11',
      r5_to_11: '5 to 11'
    },
    secondary: {
      r7_to_14: '7 to 14',
      r11_to_16: '11 to 16',
      r11_to_18: '11 to 18',
      r11_to_19: '11 to 19',
      r14_to_19: '14 to 19'
    }
  }

  const selectedAgeRange = {
    primary: weighted.select({
      r3_to_7: 0.177,
      r3_to_11: 0.089,
      r5_to_11: 0.734
    }),
    secondary: weighted.select({
      r7_to_14: 0.004,
      r11_to_16: 0.607,
      r11_to_18: 0.356,
      r11_to_19: 0.005,
      r14_to_19: 0.028
    })
  }

  let ageRange

  switch (subjectLevel) {
    case 'Primary':
      ageRange = ageRangeOptions.primary[selectedAgeRange.primary]
      break
    case 'Secondary':
      ageRange = ageRangeOptions.secondary[selectedAgeRange.secondary]
      break
    case 'Further education':
      ageRange = '14 to 19'
      break
  }

  // ---------------------------------------------------------------------------
  // Training provider
  // ---------------------------------------------------------------------------
  const trainingProvider = {}
  trainingProvider.id = params.trainingProvider.id
  trainingProvider.name = params.trainingProvider.name

  // ---------------------------------------------------------------------------
  // Accredited body
  // ---------------------------------------------------------------------------
  const accreditedBody = {}
  accreditedBody.id = params.accreditedBody.id
  accreditedBody.name = params.accreditedBody.name

  // ---------------------------------------------------------------------------
  // Locations
  // ---------------------------------------------------------------------------
  const locationCount = faker.datatype.number({ 'min': 1, 'max': 2 })

  const locationChoices = [{
    name: 'Main site',
    address: {
      address1: '123 Main Street',
      address2: '',
      address3: '',
      town: 'Some town',
      postcode: 'AB1 2CD'
    }
  }, {
    name: 'Queen’s campus',
    address: {
      address1: 'Amory Building',
      address2: 'Rennes Drive',
      address3: '',
      town: 'Big City',
      postcode: 'SW1A 4AA'
    }
  }, {
    name: 'Malet Place',
    address: {
      address1: 'Gordon Square',
      address2: '',
      address3: '',
      town: 'Small City',
      postcode: 'BA2 3DC'
    }
  }]

  const shuffledLocations = locationChoices.sort(() => 0.5 - Math.random())

  const locations = shuffledLocations.slice(0, locationCount).sort()

  // ---------------------------------------------------------------------------
  // Course name
  // ---------------------------------------------------------------------------
  let subjectNames = subjects.map(subject => { return subject.name })
  subjectNames.sort((a, b) => a.localeCompare(b))

  let courseName = arrayToList(subjectNames)

  if (subjectNames.includes('Geography') && subjectNames.includes('History')) {
    const courseNameOptions = {
      a: 'Geography and History',
      b: 'Humanities (Geography and History)'
    }

    const selectedCourseName = weighted.select({
      a: 0.9,
      b: 0.1
    })

    courseName = courseNameOptions[selectedCourseName]
  }

  if (subjectNames.includes('Primary')) {
    courseName += ` (${ageRange})`
  }

  if (subjectNames.includes('Communications and media studies')) {
    const courseNameOptions = {
      a: 'Media Studies',
      b: 'Communications and Media Studies'
    }

    const selectedCourseName = weighted.select({
      a: 0.9,
      b: 0.1
    })

    courseName = courseNameOptions[selectedCourseName]
  }

  if (subjectNames.includes('Modern languages (other)')) {
    courseName = 'Modern Languages'
  }

  if (subjectNames.includes('Psychology') && subjectNames.includes('Social sciences')) {
    courseName = 'Sociology and Psychology'
  }

  if (subjectNames.length === 1 && subjectNames.includes('Social sciences')) {
    const courseNameOptions = {
      a: 'Social Sciences',
      b: 'Sociology'
    }

    const selectedCourseName = weighted.select({
      a: 0.9,
      b: 0.1
    })

    courseName = courseNameOptions[selectedCourseName]
  }

  if (subjectNames.length === 1 && subjectNames.includes('Design and technology')) {
    const courseNameOptions = {
      a: 'Design and Technology',
      b: 'Design and Technology (Food)',
      c: 'Design and Technology (Product Design)'
    }

    const selectedCourseName = weighted.select({
      a: 0.830,
      b: 0.085,
      c: 0.085
    })

    courseName = courseNameOptions[selectedCourseName]
  }

  // ---------------------------------------------------------------------------
  // Course details
  // ---------------------------------------------------------------------------
  const course = {}

  course.code = faker.random.alphaNumeric(4).toUpperCase()
  course.name = courseName

  course.subjects = subjects
  course.subjectLevel = subjectLevel
  course.fundingType = fundingType
  course.studyModes = studyModes
  course.financialSupport = financialSupport
  course.courseLength = courseLength
  course.qualifications = qualifications
  // course.programmeType = programmeType
  course.ageRange = ageRange

  course.trainingProvider = trainingProvider
  course.accreditedBody = accreditedBody
  course.locations = locations

  return course
}
