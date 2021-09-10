// [
//   {
//     "name": "Business studies with economics",
//     "code": "B123",
//     "providerId": "B25",
//     "subjects": [
//       {
//         "name": "Business studies",
//         "code": "B234"
//       },
//       {
//         "name": "Economics",
//         "code": "E345"
//       }
//     ],
//     "level": "secondary",
//     "fundingType": "salaried",
//     "studyMode": "full_time",
//     "courseLength": "one_year",
//     "ageRange": "11-18",
//     "qualifications": ["qts","pgce"]
//     "locations": [
//       {
//         "name": "Main site",
//         "address": {
//           "address_1": "123 Main Street",
//           "address_2": "",
//           "address_3": "",
//           "town": "Some town",
//           "postcode": "AB1 2CD"
//         }
//       }
//     ]
//   }
// ]


const faker = require('faker')
faker.locale = 'en_GB'
const weighted = require('weighted')

module.exports = () => {

  const course = {}

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
  // const subjects = require('../subjects.json')

  const subjectOptions = {
    primary: {
      P01: { code: "00", name: "Primary" },
      P02: { code: "01", name: "Primary with English" },
      P03: { code: "02", name: "Primary with geography and history" },
      P04: { code: "03", name: "Primary with mathematics" },
      P05: { code: "04", name: "Primary with modern languages" },
      P06: { code: "06", name: "Primary with physical education" },
      P07: { code: "07", name: "Primary with science" }
    },
    secondary: {
      S01: { code: "W1", name: "Art and design" },
      S02: { code: "C1", name: "Biology" },
      S03: { code: "08", name: "Business studies" },
      S04: { code: "F1", name: "Chemistry" },
      S05: { code: "09", name: "Citizenship" },
      S06: { code: "Q8", name: "Classics" },
      S07: { code: "P3", name: "Communications and media studies" },
      S08: { code: "11", name: "Computer science" },
      S09: { code: "12", name: "Dance" },
      S10: { code: "DT", name: "Design and technology" },
      S11: { code: "Q3", name: "Drama" },
      S12: { code: "L1", name: "Economics" },
      S13: { code: "13", name: "English" },
      S14: { code: "16", name: "English as a second or other language" },
      S15: { code: "15", name: "French" },
      S16: { code: "F8", name: "Geography" },
      S17: { code: "17", name: "German" },
      S18: { code: "L5", name: "Health and social care" },
      S19: { code: "V1", name: "History" },
      S20: { code: "18", name: "Italian" },
      S21: { code: "19", name: "Japanese" },
      S22: { code: "20", name: "Mandarin" },
      S23: { code: "G1", name: "Mathematics" },
      S24: { code: "24", name: "Modern languages" },
      S25: { code: "W3", name: "Music" },
      S26: { code: "C6", name: "Physical education" },
      S27: { code: "F3", name: "Physics" },
      S28: { code: "C8", name: "Psychology" },
      S29: { code: "V6", name: "Religious education" },
      S30: { code: "21", name: "Russian" },
      S31: { code: "F0", name: "Science" },
      S32: { code: "14", name: "Social sciences" },
      S33: { code: "22", name: "Spanish" }
    },
    further: {
      F01: { code: '41', name: 'Further education'}
    }
  }

  const selectedSubject = {
    primary: weighted.select({
      P01: 0.16,
      P02: 0.14,
      P03: 0.14,
      P04: 0.14,
      P05: 0.14,
      P06: 0.14,
      P07: 0.14
    }),
    secondary: weighted.select({
      S01: 0.04,
      S02: 0.03,
      S03: 0.03,
      S04: 0.03,
      S05: 0.03,
      S06: 0.03,
      S07: 0.03,
      S08: 0.03,
      S09: 0.03,
      S10: 0.03,
      S11: 0.03,
      S12: 0.03,
      S13: 0.03,
      S14: 0.03,
      S15: 0.03,
      S16: 0.03,
      S17: 0.03,
      S18: 0.03,
      S19: 0.03,
      S20: 0.03,
      S21: 0.03,
      S22: 0.03,
      S23: 0.03,
      S24: 0.03,
      S25: 0.03,
      S26: 0.03,
      S27: 0.03,
      S28: 0.03,
      S29: 0.03,
      S30: 0.03,
      S31: 0.03,
      S32: 0.03,
      S33: 0.03
    }),
    further: weighted.select({
      F01: 1
    })
  }

  const subjects = []

  switch (subjectLevel) {
    case 'Primary':
      subjects.push(subjectOptions.primary[selectedSubject.primary])
      break
    case 'Secondary':
      subjects.push(subjectOptions.secondary[selectedSubject.secondary])
      break
    case 'Further education':
      subjects.push(subjectOptions.further[selectedSubject.further])
      break
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

  const studyMode = studyModeOptions[selectedStudyMode]

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

  const courseLength = courseLengthOptions[selectedCourseLength]

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
  // Course details
  // ---------------------------------------------------------------------------
  course.code = faker.random.alphaNumeric(4).toUpperCase()
  course.name = subjects[0].name

  course.subjects = subjects
  course.fundingType = fundingType
  course.studyMode = studyMode
  course.financialSupport = financialSupport
  course.courseLength = courseLength
  course.qualifications = qualifications
  // course.programmeType = programmeType
  course.ageRange = ageRange

  return course
}
