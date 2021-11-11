const faker = require('faker')
faker.locale = 'en_GB'

const weighted = require('weighted')

module.exports = (englishGcseQualification) => {

  // console.log(englishGcseQualification);

  const type = faker.helpers.randomize([
    'IELTS',
    'TOEFL',
    'Pearson Test of English (Academic)',
    'Cambridge IGCSE English as a Second Language'
  ])

  const reason = faker.helpers.randomize([
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
    reference = false
  }

  // const hasQualification = faker.helpers.randomize([
  //   'Yes',
  //   'No', // No, I have not done an English as a foreign language assessment
  //   'Not needed' // No, English is not a foreign language to me
  // ])

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
  if (englishGcseQualification.missing) {
    if (englishGcseQualification.missing.isStudying === 'Yes') {
      hasQualification = 'No'
    }
    if (englishGcseQualification.missing.otherReason
      && englishGcseQualification.missing.otherReason.includes('I am a native English speaker')) {
      hasQualification = 'Not needed'
    }
  }

  let data

  // switch (hasQualification) {
  //   case 'Yes':
  //     data = {
  //       hasQualification,
  //       status: 'Candidate has an English as a foreign language qualification',
  //       type,
  //       grade,
  //       gradeLabel,
  //       reference,
  //       referenceLabel,
  //       year: faker.date.between('2010', '2020')
  //     }
  //   case 'No':
  //     data = {
  //       hasQualification,
  //       status: 'Candidate does not have an English as a foreign language qualification yet',
  //       missing: 'I have booked to take an IELTS test next month.'
  //     }
  //   case 'Not needed':
  //     data = {
  //       hasQualification,
  //       status: 'English is not a foreign language to the candidate'
  //     }
  // }

  if (hasQualification === 'Yes') {
    data = {
      hasQualification,
      status: 'Candidate has an English as a foreign language qualification',
      type,
      grade,
      gradeLabel,
      reference,
      referenceLabel,
      year: faker.date.between('2010', '2020')
    }
  } else if (hasQualification === 'No') {
    data = {
      hasQualification,
      status: 'Candidate does not have an English as a foreign language qualification yet',
      reason
    }
  } else {
    data = {
      hasQualification,
      status: 'English is not a foreign language to the candidate'
    }
  }

  console.log(data);

  return data
}
