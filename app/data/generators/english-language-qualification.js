module.exports = (faker) => {
  const type = faker.helpers.randomize([
    'IELTS',
    'TOEFL',
    'Pearson Test of English (Academic)',
    'Cambridge IGCSE English as a Second Language'
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

  const hasQualification = faker.helpers.randomize([
    'Yes',
    'No',
    'Not needed'
  ])
  switch (hasQualification) {
    case 'Yes':
      return {
        hasQualification,
        status: 'Candidate has an English as a foreign language qualification',
        type,
        grade,
        gradeLabel,
        reference,
        referenceLabel,
        year: faker.date.between('2010', '2020')
      }
    case 'No':
      return {
        hasQualification,
        status: 'Candidate does not have an English as a foreign language qualification yet',
        missing: 'I have booked to take an IELTS test next month.'
      }
    default:
      return {
        hasQualification,
        status: 'English is not a foreign language to the candidate'
      }
  }
}
