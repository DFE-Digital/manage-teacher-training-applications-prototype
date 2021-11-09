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
  let type = (year <= 1988) ? 'O level' : weighted.select({
    GCSE: 0.9,
    'Scottish National 5': 0.1
  })

  if (isInternationCandidate) {
    type = 'Baccalauréat Général'
  }

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
  let scienceGrade

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

    scienceGrade = scienceGradeOptions[selectedScienceGrade]
  }

  // ---------------------------------------------------------------------------
  // Has missing qualification
  // ---------------------------------------------------------------------------
  let hasEnglishQualification
  let hasMathsQualification
  let hasScienceQualification

  // Missing English GCSE
  const hasEnglishQualificationOptions = {
    yes: 'Yes',
    no: 'I don’t have an English qualification yet'
  }

  const selectedEnglishQualification = weighted.select({
    yes: 0.8,
    no: 0.2
  })

  hasEnglishQualification = hasEnglishQualificationOptions[selectedEnglishQualification]

  // Missing maths GCSE
  const hasMathsQualificationOptions = {
    yes: 'Yes',
    no: 'I don’t have an maths qualification yet'
  }

  const selectedMathsQualification = weighted.select({
    yes: 0.8,
    no: 0.2
  })

  hasMathsQualification = hasMathsQualificationOptions[selectedMathsQualification]

  // Missing science GCSE
  if (subjectLevel === 'Primary') {
    const hasScienceQualificationOptions = {
      yes: 'Yes',
      no: 'I don’t have a science qualification yet'
    }

    const selectedScienceQualification = weighted.select({
      yes: 0.8,
      no: 0.2
    })

    hasScienceQualification = hasScienceQualificationOptions[selectedScienceQualification]
  }

  // ---------------------------------------------------------------------------
  // Missing reason
  // ---------------------------------------------------------------------------
  let missingEnglishReasonOptions
  let missingMathsReasonOptions
  let missingScienceReasonOptions

  let missingEnglishReason
  let missingMathsReason
  let missingScienceReason

  if (isInternationCandidate) {
    missingEnglishReasonOptions = [
      'I am planning to take an English equivalency test',
      'I am a native English speaker, I would prefer to demonstrate the required skills',
      'I have a certificate confirming that the medium of instruction and examination at undergraduate was in English'
    ]

    missingMathsReasonOptions = [
      'I am planning to take a maths equivalency test',
      'I applied to NARIC for the equivalent',
      'I have a high school transcript for maths'
    ]

    if (subjectLevel === 'Primary') {
      missingScienceReasonOptions = [
        'I am planning to take a science equivalency test',
        'I completed the International Baccalaureate programme and studied science',
        'I completed my High School Certificate in biology, chemistry and physics'
      ]
    }
  } else {
    missingEnglishReasonOptions = [
      'I have key skills level 2 in English',
      'I will be undertaking equivalency tests within the next few months',
      'I studied at degree level, worked as teaching assistant for 6 years'
    ]

    missingMathsReasonOptions = [
      'I am planning to take a maths equivalency test',
      'I have a functional skills level 2 in maths however I am willing to take an equivalent exam',
      'I will be studying towards attaining my equivalency once I have been accepted on the programme'
    ]

    if (subjectLevel === 'Primary') {
      missingScienceReasonOptions = [
        'I am planning to take a science equivalency test',
        'I am currently looking for a course',
        'I completed my Access To Higher Education Diploma (equivalent to A-Levels) in Social Science'
      ]
    }
  }

  if (hasEnglishQualification !== 'Yes') {
    missingEnglishReason = faker.helpers.randomize(missingEnglishReasonOptions)
  }

  if (hasMathsQualification !== 'Yes') {
    missingMathsReason = faker.helpers.randomize(missingMathsReasonOptions)
  }

  if (subjectLevel === 'Primary') {
    if (hasScienceQualification !== 'Yes') {
      missingScienceReason = faker.helpers.randomize(missingScienceReasonOptions)
    }

  }

  // ---------------------------------------------------------------------------
  // GCSE details
  // ---------------------------------------------------------------------------
  let english
  let maths
  let science

  if (isInternationCandidate) {

    if (hasEnglishQualification === 'Yes') {
      english = {
        type,
        subject: 'English',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [{
          grade: faker.datatype.number({ min: 10, max: 20 })
        }],
        year
      }
    } else {
      english = {
        type,
        subject: 'English',
        country: 'France',
        missing: missingEnglishReason,
        year
      }
    }

    if (hasMathsQualification === 'Yes') {
      maths = {
        type,
        subject: 'Maths',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE grades A*-C/9-4'
        },
        grade: [{
          grade: faker.datatype.number({ min: 10, max: 20 })
        }],
        year
      }
    } else {
      maths = {
        type,
        subject: 'Maths',
        country: 'France',
        missing: missingMathsReason,
        year
      }
    }

    if (subjectLevel === 'Primary') {
      if (hasScienceQualification === 'Yes') {
        science = {
          type,
          subject: 'Science',
          country: 'France',
          naric: {
            reference: '4000228363',
            comparable: 'GCSE (grades A*-C / 9-4)'
          },
          grade: [{
            grade: faker.datatype.number({ min: 10, max: 20 })
          }],
          year
        }
      } else {
        science = {
          type,
          subject: 'Science',
          country: 'France',
          missing: missingScienceReason,
          year
        }
      }
    }

  } else {

    if (hasEnglishQualification === 'Yes') {
      english = {
        type,
        subject: 'English',
        country: 'United Kingdom',
        grade: englishGrade,
        year
      }
    } else {
      english = {
        type,
        subject: 'English',
        country: 'United Kingdom',
        missing: missingEnglishReason,
        year
      }
    }

    if (hasMathsQualification === 'Yes') {
      maths = {
        type,
        subject: 'Maths',
        country: 'United Kingdom',
        grade: mathsGrade,
        year
      }
    } else {
      maths = {
        type,
        subject: 'Maths',
        country: 'United Kingdom',
        missing: missingMathsReason,
        year
      }
    }

    if (subjectLevel === 'Primary') {
      if (hasScienceQualification === 'Yes') {
        science = {
          type,
          subject: 'Science',
          country: 'United Kingdom',
          grade: scienceGrade,
          year
        }
      } else {
        science = {
          type,
          subject: 'Science',
          country: 'United Kingdom',
          missing: missingScienceReason,
          year
        }
      }
    }

  }

  return {
    english,
    maths,
    science
  }
}
