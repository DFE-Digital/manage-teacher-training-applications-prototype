const { fakerEN_GB: faker } = require('@faker-js/faker')

const { DateTime } = require('luxon')
const weighted = require('weighted')

module.exports = (params) => {

  const currentYear = DateTime.now().year

  // To create qaulification year add n years after date of birth
  let year = DateTime.fromISO(params.dateOfBirth).toObject().year
  year += faker.helpers.arrayElement([18,19,20,21,22])

  if (year > currentYear) {
    year = currentYear
  }

  const type = faker.helpers.arrayElement([
    'IELTS',
    'TOEFL',
    'Other'
  ])

  const reason = faker.helpers.arrayElement([
    'I have booked to take an IELTS test next month',
    'I am taking a TOEFL test next month',
    'I will take a Pearson English test',
    'I’m taking the Cambridge IGCSE English as a Second Language test next month'
  ])

  let grade
  let gradeLabel
  let reference
  let referenceLabel

  if (type === 'IELTS') {
    grade = '7.5'
    gradeLabel = 'Overall band score'
    reference = '02GB0674SOOM599A'
    referenceLabel = 'Test report form (TRF) number'
  } else if (type === 'TOEFL') {
    grade = '92'
    gradeLabel = 'Total score'
    reference = '0000 0000 2500 2147'
    referenceLabel = 'TOEFL registration number'
  } else {
    grade = 'B'
    gradeLabel = 'Score or grade'
    reference = faker.helpers.arrayElement([
      'Pearson Test of English (Academic)',
      'Cambridge IGCSE English as a Second Language'
    ])
    referenceLabel = 'Assessment name'
  }

  const hasQualificationOptions = {
    yes: 'Yes',
    no: 'No',
    not_needed: 'Not needed'
  }

  const selectedOption = weighted.select({
    yes: 0.5,
    no: 0.25,
    not_needed: 0.25
  })

  let hasQualification = hasQualificationOptions[selectedOption]

  // Override the qualification choice to correlate with English GCSE answers
  if (params.englishGcseQualification.missing) {
    if (params.englishGcseQualification.missing.isStudying === 'Yes') {
      hasQualification = 'No'
    }
    if (params.englishGcseQualification.missing.otherReason
      && params.englishGcseQualification.missing.otherReason.includes('I am a native English speaker')) {
      hasQualification = 'Not needed'
    }
  }

  let data

  if (hasQualification === 'Yes') {
    data = {
      hasQualification,
      status: 'Yes',
      type,
      grade,
      gradeLabel,
      reference,
      referenceLabel,
      year
    }
  } else if (hasQualification === 'No') {
    data = {
      hasQualification,
      status: 'No, I have not done an English as a foreign language assessment',
      reason
    }
  } else {
    data = {
      hasQualification,
      status: 'No, English is not a foreign language to me'
    }
  }

  return data
}
