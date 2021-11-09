const faker = require('faker')
faker.locale = 'en_GB'

const weighted = require('weighted')
const gcseData = require('../gcse')

module.exports = (isInternationCandidate, subjectLevel) => {

  // ---------------------------------------------------------------------------
  // Qualification year
  // ---------------------------------------------------------------------------
  let year = faker.date.between('1970', '2016')
  year = year.getFullYear()

  // ---------------------------------------------------------------------------
  // Qualification type
  // GCSEs were only awarded from 1988 onwards
  // ---------------------------------------------------------------------------
  const type = (year <= 1988) ? 'O level' : weighted.select({
    GCSE: 0.9,
    'Scottish National 5': 0.1
  })

  // ---------------------------------------------------------------------------
  // Grades
  // GCSE grade values changed to numbers after 2017
  // ---------------------------------------------------------------------------
  const singleGrades = (type === 'GCSE' && year >= 2017) ? gcseData().singleGrades2017 : gcseData().singleGrades
  const doubleGrades = (type === 'GCSE' && year >= 2017) ? gcseData().doubleGrades2017 : gcseData().doubleGrades

  // ---------------------------------------------------------------------------
  // English
  // ---------------------------------------------------------------------------
  const englishGradeOptions = {
    singleAwardEnglish: [{
      exam: 'English Language',
      grade: faker.helpers.randomize(singleGrades)
    }],
    doubleAwardEnglish: [{
      exam: 'English',
      grade: faker.helpers.randomize(doubleGrades)
    }],
    separateEnglish1: [{
      exam: 'English Language',
      grade: faker.helpers.randomize(singleGrades)
    }, {
      exam: 'English Literature',
      grade: faker.helpers.randomize(singleGrades)
    }],
    separateEnglish2: [{
      exam: 'English Language',
      grade: faker.helpers.randomize(singleGrades)
    }, {
      exam: 'English Studies',
      grade: faker.helpers.randomize(singleGrades)
    }]
  }

  const selectedEnglishGrade = weighted.select({
    singleAwardEnglish: 0.3,
    doubleAwardEnglish: 0.3,
    separateEnglish1: 0.2,
    separateEnglish2: 0.2
  })

  const englishGrade = englishGradeOptions[selectedEnglishGrade]

  // ---------------------------------------------------------------------------
  // Maths
  // ---------------------------------------------------------------------------
  const mathsGrade = [{
    grade: faker.helpers.randomize(singleGrades)
  }]

  // ---------------------------------------------------------------------------
  // Science
  // ---------------------------------------------------------------------------
  if (subjectLevel === 'Primary') {
    const scienceGradeOptions = {
      singleAwardScience: [{
        exam: 'Single award',
        grade: faker.helpers.randomize(singleGrades)
      }],
      doubleAwardScience: [{
        exam: 'Double award',
        grade: faker.helpers.randomize(doubleGrades)
      }],
      tripleAwardScience: [{
        exam: 'Biology',
        grade: faker.helpers.randomize(singleGrades)
      }, {
        exam: 'Chemistry',
        grade: faker.helpers.randomize(singleGrades)
      }, {
        exam: 'Physics',
        grade: faker.helpers.randomize(singleGrades)
      }]
    }

    const selectedScienceGrade = weighted.select({
      singleAwardScience: 0.2,
      doubleAwardScience: 0.6,
      tripleAwardScience: 0.2
    })

    const scienceGrade = scienceGradeOptions[selectedScienceGrade]
  }

  // ---------------------------------------------------------------------------
  // Missing reason
  // ---------------------------------------------------------------------------
  let missingEnglishReasons
  let missingMathsReasons
  let missingScienceReasons

  if (isInternationCandidate) {
    missingEnglishReasons = [
      'I am planning to take an English equivalency test',
      'I am a native English speaker, I would prefer to demonstrate the required skills',
      'I have a certificate confirming that the medium of instruction and examination at undergraduate was in English',
      'I plan to come to England to learn English for six months before starting to train',
      'I am going to do an English as a foreign language assessment to validate my level of English'
    ]

    missingMathsReasons = []

    if (subjectLevel === 'Primary') {
      missingScienceReasons = []
    }
  } else {
    missingEnglishReasons = [
      'I have key skills level 2 in English',
      'I will be undertaking equivalency tests within the next few months',
      'I am going to sit an equivalency test to prove my skills in English',
      'I studied at degree level, worked as teaching assistant for 6 years'
    ]

    missingMathsReasons = []

    if (subjectLevel === 'Primary') {
      missingScienceReasons = []
    }
  }

  const missingEnglishReason = weighted.select({
    faker.helpers.randomize(missingEnglishReasons): 0.2,
    false: 0.8
  })

  const missingMathsReason = weighted.select({
    faker.helpers.randomize(missingMathsReasons): 0.2,
    false: 0.8
  })

  if (subjectLevel === 'Primary') {
    const missingScienceReason = weighted.select({
      faker.helpers.randomize(missingScienceReasons): 0.2,
      false: 0.8
    })
  }


  // ---------------------------------------------------------------------------
  // GCSE details
  // ---------------------------------------------------------------------------
  let english
  let maths
  let science

  if (isInternationCandidate) {
    english = {
      type: 'Baccalauréat Général',
      subject: 'English',
      country: 'France',
      missing: missingEnglishReason,
      naric: {
        reference: '4000228363',
        comparable: 'GCSE (grades A*-C / 9-4)'
      },
      grade: [{
        grade: faker.datatype.number({ min: 10, max: 20 })
      }],
      year
    }

    maths = {
      type: 'Baccalauréat Général',
      subject: 'Maths',
      country: 'France',
      missing: missingMathsReason,
      naric: {
        reference: '4000228363',
        comparable: 'GCSE grades A*-C/9-4'
      },
      grade: [{
        grade: faker.datatype.number({ min: 10, max: 20 })
      }],
      year
    }

    if (subjectLevel === 'Primary') {
      science = {
        type: 'Baccalauréat Général',
        subject: 'Science',
        country: 'France',
        missing: missingScienceReason,
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [{
          grade: faker.datatype.number({ min: 10, max: 20 })
        }],
        year
      }
    }
  } else {
    english = {
      type,
      subject: 'English',
      country: 'United Kingdom',
      missing: missingEnglishReason,
      grade: englishGrade,
      year
    }

    maths = {
      type,
      subject: 'Maths',
      country: 'United Kingdom',
      missing: missingMathsReason,
      grade: mathsGrade,
      year
    }

    if (subjectLevel === 'Primary') {
      science = {
        type,
        subject: 'Science',
        country: 'United Kingdom',
        missing: missingScienceReason,
        grade: scienceGrade,
        year
      }
    }
  }

  return {
    english,
    maths,
    science
  }
}
