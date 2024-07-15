const { fakerUK: faker } = require('@faker-js/faker')

const { DateTime } = require('luxon')
const weighted = require('weighted')
const GcseHelper = require('../helpers/gcses')

module.exports = (params) => {

  // ---------------------------------------------------------------------------
  // Qualification year
  // ---------------------------------------------------------------------------
  let year = DateTime.fromISO(params.dateOfBirth).toObject().year
  year += 16 // add 16 years to DOB for GCSE age

  // ---------------------------------------------------------------------------
  // Qualification type
  // GCSEs were only awarded from 1988 onwards
  // ---------------------------------------------------------------------------
  let type = (year <= 1988) ? 'O level' : weighted.select({
    GCSE: 0.9,
    'Scottish National 5': 0.1
  })

  if (params.isInternationalCandidate) {
    type = 'Baccalauréat Général'
  }

  // ---------------------------------------------------------------------------
  // Grades
  // GCSE grade values changed to numbers after 2017
  // ---------------------------------------------------------------------------
  const singleGrades = (type === 'GCSE' && year >= 2017) ? GcseHelper.SINGLE_GRADES_2017 : GcseHelper.SINGLE_GRADES
  const doubleGrades = (type === 'GCSE' && year >= 2017) ? GcseHelper.DOUBLE_GRADES_2017 : GcseHelper.DOUBLE_GRADES

  // ---------------------------------------------------------------------------
  // English
  // ---------------------------------------------------------------------------
  const englishGradeOptions = {
    singleAwardEnglish: [{
      exam: 'English Language',
      grade: faker.helpers.arrayElement(singleGrades)
    }],
    doubleAwardEnglish: [{
      exam: 'English',
      grade: faker.helpers.arrayElement(doubleGrades)
    }],
    separateEnglish1: [{
      exam: 'English Language',
      grade: faker.helpers.arrayElement(singleGrades)
    }, {
      exam: 'English Literature',
      grade: faker.helpers.arrayElement(singleGrades)
    }],
    separateEnglish2: [{
      exam: 'English Language',
      grade: faker.helpers.arrayElement(singleGrades)
    }, {
      exam: 'English Studies',
      grade: faker.helpers.arrayElement(singleGrades)
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
    grade: faker.helpers.arrayElement(singleGrades)
  }]

  // ---------------------------------------------------------------------------
  // Science
  // ---------------------------------------------------------------------------
  let scienceGrade

  if (params.subjectLevel === 'Primary') {
    const scienceGradeOptions = {
      singleAwardScience: [{
        exam: 'Single award',
        grade: faker.helpers.arrayElement(singleGrades)
      }],
      doubleAwardScience: [{
        exam: 'Double award',
        grade: faker.helpers.arrayElement(doubleGrades)
      }],
      tripleAwardScience: [{
        exam: 'Biology',
        grade: faker.helpers.arrayElement(singleGrades)
      }, {
        exam: 'Chemistry',
        grade: faker.helpers.arrayElement(singleGrades)
      }, {
        exam: 'Physics',
        grade: faker.helpers.arrayElement(singleGrades)
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
    no: 'I do not have a GCSE in English (or equivalent) yet'
  }

  const selectedEnglishQualification = weighted.select({
    yes: 0.8,
    no: 0.2
  })

  hasEnglishQualification = hasEnglishQualificationOptions[selectedEnglishQualification]

  // Missing maths GCSE
  const hasMathsQualificationOptions = {
    yes: 'Yes',
    no: 'I do not have a GCSE in maths (or equivalent) yet'
  }

  const selectedMathsQualification = weighted.select({
    yes: 0.8,
    no: 0.2
  })

  hasMathsQualification = hasMathsQualificationOptions[selectedMathsQualification]

  // Missing science GCSE
  if (params.subjectLevel === 'Primary') {
    const hasScienceQualificationOptions = {
      yes: 'Yes',
      no: 'I do not have a GCSE in science (or equivalent) yet'
    }

    const selectedScienceQualification = weighted.select({
      yes: 0.8,
      no: 0.2
    })

    hasScienceQualification = hasScienceQualificationOptions[selectedScienceQualification]
  }

  // ---------------------------------------------------------------------------
  // Is studying the subject
  // ---------------------------------------------------------------------------
  let isStudyingEnglish
  let isStudyingMaths
  let isStudyingScience

  // Missing English GCSE
  if (hasEnglishQualification !== 'Yes') {
    const isStudyingEnglishOptions = {
      yes: 'Yes',
      no: 'No'
    }

    const selectedStudyingEnglish = weighted.select({
      yes: 0.8,
      no: 0.2
    })

    isStudyingEnglish = isStudyingEnglishOptions[selectedStudyingEnglish]
  }

  // Missing maths GCSE
  if (hasMathsQualification !== 'Yes') {
    const isStudyingMathsOptions = {
      yes: 'Yes',
      no: 'No'
    }

    const selectedStudyingMaths = weighted.select({
      yes: 0.8,
      no: 0.2
    })

    isStudyingMaths = isStudyingMathsOptions[selectedStudyingMaths]
  }

  // Missing science GCSE
  if (params.subjectLevel === 'Primary') {
    if (hasScienceQualification !== 'Yes') {
      const isStudyingScienceOptions = {
        yes: 'Yes',
        no: 'No'
      }

      const selectedStudyingScience = weighted.select({
        yes: 0.8,
        no: 0.2
      })

      isStudyingScience = isStudyingScienceOptions[selectedStudyingScience]
    }
  }

  // ---------------------------------------------------------------------------
  // Studying details
  // ---------------------------------------------------------------------------
  let studyingEnglishDetails
  let studyingMathsDetails
  let studyingScienceDetails

  if (hasEnglishQualification !== 'Yes' && isStudyingEnglish === 'Yes') {
    studyingEnglishDetails = 'I am planning to take an English equivalency test'
  }

  if (hasMathsQualification !== 'Yes' && isStudyingMaths === 'Yes') {
    studyingMathsDetails = 'I am planning to take a maths equivalency test'
  }

  if (params.subjectLevel === 'Primary') {
    if (hasScienceQualification !== 'Yes' && isStudyingScience === 'Yes') {
      studyingScienceDetails = 'I am planning to take a science equivalency test'
    }
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

  if (params.isInternationalCandidate) {
    missingEnglishReasonOptions = [
      'I am a native English speaker, I would prefer to demonstrate the required skills',
      'I have a certificate confirming that the medium of instruction and examination at undergraduate was in English',
      'Not entered'
    ]

    missingMathsReasonOptions = [
      'I applied to NARIC for the equivalent',
      'I have a high school transcript for maths',
      'Not entered'
    ]

    if (params.subjectLevel === 'Primary') {
      missingScienceReasonOptions = [
        'I completed the International Baccalaureate programme and studied science',
        'I completed my High School Certificate in biology, chemistry and physics',
        'Not entered'
      ]
    }
  } else {
    missingEnglishReasonOptions = [
      'I have key skills level 2 in English',
      'I studied at degree level, worked as teaching assistant for 6 years',
      'Not entered'
    ]

    missingMathsReasonOptions = [
      'I have a functional skills level 2 in maths however I am willing to take an equivalent exam',
      'I will be studying towards attaining my equivalency once I have been accepted on the programme',
      'Not entered'
    ]

    if (params.subjectLevel === 'Primary') {
      missingScienceReasonOptions = [
        'I am currently looking for a course',
        'I completed my Access To Higher Education Diploma (equivalent to A-Levels) in Social Science',
        'Not entered'
      ]
    }
  }

  if (hasEnglishQualification !== 'Yes' && isStudyingEnglish !== 'Yes') {
    missingEnglishReason = faker.helpers.arrayElement(missingEnglishReasonOptions)
  }

  if (hasMathsQualification !== 'Yes' && isStudyingMaths !== 'Yes') {
    missingMathsReason = faker.helpers.arrayElement(missingMathsReasonOptions)
  }

  if (params.subjectLevel === 'Primary') {
    if (hasScienceQualification !== 'Yes' && isStudyingScience !== 'Yes') {
      missingScienceReason = faker.helpers.arrayElement(missingScienceReasonOptions)
    }
  }

  // ---------------------------------------------------------------------------
  // Missing details
  // ---------------------------------------------------------------------------
  let missingEnglish
  let missingMaths
  let missingScience

  if (hasEnglishQualification !== 'Yes') {
    missingEnglish = {}
    missingEnglish.hasQualification = hasEnglishQualification
    missingEnglish.isStudying = isStudyingEnglish

    if (studyingEnglishDetails) {
      missingEnglish.studyingDetails = studyingEnglishDetails
    }

    if (missingEnglishReason) {
      missingEnglish.otherReason = missingEnglishReason
    }
  }

  if (hasMathsQualification !== 'Yes') {
    missingMaths = {}
    missingMaths.hasQualification = hasMathsQualification
    missingMaths.isStudying = isStudyingMaths

    if (studyingMathsDetails) {
      missingMaths.studyingDetails = studyingMathsDetails
    }

    if (missingMathsReason) {
      missingMaths.otherReason = missingMathsReason
    }
  }

  if (params.subjectLevel === 'Primary' && hasScienceQualification !== 'Yes') {
    missingScience = {}
    missingScience.hasQualification = hasScienceQualification
    missingScience.isStudying = isStudyingScience

    if (studyingScienceDetails) {
      missingScience.studyingDetails = studyingScienceDetails
    }

    if (missingScienceReason) {
      missingScience.otherReason = missingScienceReason
    }
  }

  // ---------------------------------------------------------------------------
  // GCSE retakes
  // ---------------------------------------------------------------------------
  let isRetakingEnglish
  let evidenceRetakingEnglish

  const hasToRetakeEnglish = englishGrade.filter(grade => grade.grade.includes('D')
    || grade.grade.includes('E')
    || grade.grade.includes('F')).length ? true : false

  if (hasToRetakeEnglish) {
    const isRetakingEnglishOptions = {
      yes: 'Yes',
      no: 'No'
    }

    const selectedRetakingEnglish = weighted.select({
      yes: 0.85,
      no: 0.15
    })

    isRetakingEnglish = isRetakingEnglishOptions[selectedRetakingEnglish]

    const evidenceRetakingEnglishOptions = [
      'I’m planning to retake my English exam',
      'Not entered'
    ]

    if (isRetakingEnglish === 'No') {
      evidenceRetakingEnglish = faker.helpers.arrayElement(evidenceRetakingEnglishOptions)
    }
  }

  let isRetakingMaths
  let evidenceRetakingMaths

  const hasToRetakeMaths = mathsGrade.filter(grade => grade.grade.includes('D')
    || grade.grade.includes('E')
    || grade.grade.includes('F')).length ? true : false

  if (hasToRetakeMaths) {
    const isRetakingMathsOptions = {
      yes: 'Yes',
      no: 'No'
    }

    const selectedRetakingMaths = weighted.select({
      yes: 0.9,
      no: 0.1
    })

    isRetakingMaths = isRetakingMathsOptions[selectedRetakingMaths]

    const evidenceRetakingMathsOptions = [
      'I’m planning to retake my Maths exam',
      'Not entered'
    ]

    if (isRetakingMaths === 'No') {
      evidenceRetakingMaths = faker.helpers.arrayElement(evidenceRetakingMathsOptions)
    }
  }

  let hasToRetakeScience
  let isRetakingScience
  let evidenceRetakingScience

  if (params.subjectLevel === 'Primary') {
    hasToRetakeScience = scienceGrade.filter(grade => grade.grade.includes('D')
      || grade.grade.includes('E')
      || grade.grade.includes('F')).length ? true : false

    if (hasToRetakeScience) {
      const isRetakingScienceOptions = {
        yes: 'Yes',
        no: 'No'
      }

      const selectedRetakingScience = weighted.select({
        yes: 0.8,
        no: 0.2
      })

      isRetakingScience = isRetakingScienceOptions[selectedRetakingScience]

      const evidenceRetakingScienceOptions = [
        'I’m planning to retake my Science exam',
        'Not entered'
      ]

      if (isRetakingScience === 'No') {
        evidenceRetakingScience = faker.helpers.arrayElement(evidenceRetakingScienceOptions)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // GCSE details
  // ---------------------------------------------------------------------------
  let english
  let maths
  let science

  if (params.isInternationalCandidate) {

    if (hasEnglishQualification === 'Yes') {
      english = {
        hasQualification: 'Yes',
        type,
        subject: 'English',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE (grades A*-C / 9-4)'
        },
        grade: [{
          grade: faker.number.int({ min: 10, max: 20 })
        }],
        year
      }
    } else {
      english = {
        hasQualification: 'No',
        subject: 'English',
        missing: missingEnglish
      }
    }

    if (hasMathsQualification === 'Yes') {
      maths = {
        hasQualification: 'Yes',
        type,
        subject: 'Maths',
        country: 'France',
        naric: {
          reference: '4000228363',
          comparable: 'GCSE grades A*-C/9-4'
        },
        grade: [{
          grade: faker.number.int({ min: 10, max: 20 })
        }],
        year
      }
    } else {
      maths = {
        hasQualification: 'No',
        subject: 'Maths',
        missing: missingMaths
      }
    }

    if (params.subjectLevel === 'Primary') {
      if (hasScienceQualification === 'Yes') {
        science = {
          hasQualification: 'Yes',
          type,
          subject: 'Science',
          country: 'France',
          naric: {
            reference: '4000228363',
            comparable: 'GCSE (grades A*-C / 9-4)'
          },
          grade: [{
            grade: faker.number.int({ min: 10, max: 20 })
          }],
          year
        }
      } else {
        science = {
          hasQualification: 'No',
          subject: 'Science',
          missing: missingScience
        }
      }
    }

  } else {

    if (hasEnglishQualification === 'Yes') {
      english = {
        hasQualification: 'Yes',
        type,
        subject: 'English',
        country: 'United Kingdom',
        grade: englishGrade,
        year
      }

      if (hasToRetakeEnglish) {
        english.retake = {
          isRetaking: isRetakingEnglish,
          evidence: evidenceRetakingEnglish
        }
      }
    } else {
      english = {
        hasQualification: 'No',
        subject: 'English',
        missing: missingEnglish
      }
    }

    if (hasMathsQualification === 'Yes') {
      maths = {
        hasQualification: 'Yes',
        type,
        subject: 'Maths',
        country: 'United Kingdom',
        grade: mathsGrade,
        year
      }

      if (hasToRetakeMaths) {
        maths.retake = {
          isRetaking: isRetakingMaths,
          evidence: evidenceRetakingMaths
        }
      }
    } else {
      maths = {
        hasQualification: 'No',
        subject: 'Maths',
        missing: missingMaths
      }
    }

    if (params.subjectLevel === 'Primary') {
      if (hasScienceQualification === 'Yes') {
        science = {
          hasQualification: 'Yes',
          type,
          subject: 'Science',
          country: 'United Kingdom',
          grade: scienceGrade,
          year
        }

        if (hasToRetakeScience) {
          science.retake = {
            isRetaking: isRetakingScience,
            evidence: evidenceRetakingScience
          }
        }
      } else {
        science = {
          hasQualification: 'No',
          subject: 'Science',
          missing: missingScience
        }
      }
    }

  }

  let data
  if (params.subjectLevel === 'Primary') {
    data = {
      english,
      maths,
      science
    }
  } else {
    data = {
      english,
      maths
    }
  }

  return data
}
