const faker = require('faker')
faker.locale = 'en_GB'
const weighted = require('weighted')
const generatorHelpers = require('../helpers/generators')

module.exports = () => {
  const nationalities = {
    british: ['British'],
    irish: ['Irish'],
    french: ['French'],
    dual: ['French', 'Swiss'],
    multiple: ['British', 'French', 'Swiss']
  }
  const selectedNationality = weighted.select({
    british: 0.65,
    irish: 0.05,
    french: 0.1,
    dual: 0.1,
    multiple: 0.1
  })
  const nationality = nationalities[selectedNationality]

  // Flag international candidate (does not have British/Irish nationality)
  const isInternationalCandidate = !(nationality.includes('British') || nationality.includes('Irish'))

  const rightToWorkStudyOptions = {
    yes: 'Yes',
    unsure: 'Not yet, or not sure'
  }
  const selectedRightToWorkStudy = weighted.select({
    yes: 0.6,
    unsure: 0.4
  })
  const rightToWorkStudy = rightToWorkStudyOptions[selectedRightToWorkStudy]

  const residency = {}
  if (isInternationalCandidate) {
    residency.rightToWorkStudy = rightToWorkStudy
    if (rightToWorkStudy === 'Yes') {
      residency.rightToWorkStudyDetails = faker.helpers.randomize([
        'I have settled status',
        'I have pre-settled status',
        'I have a permanent residence card',
        'I have a spousal visa',
        'I have a student visa'
      ])
    } else {
      residency.rightToWorkStudyDetails = 'Candidate needs to apply for permission to work and study in the UK'
    }
  } else {
    residency.rightToWorkStudy = 'Yes'
    residency.rightToWorkStudyDetails = nationality[0] === 'Irish' ? 'I am an ' : 'I am a '
    residency.rightToWorkStudyDetails += nationality[0] + ' citizen'
  }

  // ---------------------------------------------------------------------------
  // Equality and diversity
  // ---------------------------------------------------------------------------
  let sex
  let disabled
  let disabilities
  let ethnicGroup
  let ethnicBackground

  const diversityQuestionnaireAnswered = faker.helpers.randomize(['Yes', 'Yes', 'No'])

  // Candidate's sex
  const sexOptions = {
    female: 'Female',
    male: 'Male',
    intersex: 'Intersex',
    preferNotToSay: 'Prefer not to say'
  }

  const selectedSex = weighted.select({
    female: 0.4,
    male: 0.4,
    intersex: 0.01,
    preferNotToSay: 0.19
  })

  // Candidate disability
  const disabledOptions = {
    yes: 'Yes',
    no: 'No',
    preferNotToSay: 'Prefer not to say'
  }

  const selectedDisabled = weighted.select({
    yes: 0.2,
    no: 0.75,
    preferNotToSay: 0.05
  })

  // Ethnic groups
  const ethnicGroupOptions = {
    asian: 'Asian or Asian British',
    black: 'Black, African, Black British or Caribbean',
    mixed: 'Mixed or multiple ethnic groups',
    white: 'White',
    other: 'Another ethnic group',
    preferNotToSay: 'Prefer not to say'
  }

  const selectedEthnicGroup = weighted.select({
    asian: 0.15,
    black: 0.12,
    mixed: 0.03,
    white: 0.66,
    other: 0.03,
    preferNotToSay: 0.01
  })

  // Ethnic backgrounds (subset of groups)
  const ethnicBackgroundOptions = {
    asian: {
      bangladeshi: 'Bangladeshi',
      chinese: 'Chinese',
      indian: 'Indian',
      pakistani: 'Pakistani',
      other: 'Any other Asian background',
      preferNotToSay: 'Prefer not to say'
    },
    black: {
      african: 'African',
      caribbean: 'Caribbean',
      other: 'Any other Black, African or Caribbean background',
      preferNotToSay: 'Prefer not to say'
    },
    mixed: {
      asian: 'Asian and White',
      african: 'Black African and White',
      caribbean: 'Black Caribbean and White',
      other: 'Any other Mixed or Multiple ethnic background',
      preferNotToSay: 'Prefer not to say'
    },
    white: {
      british: 'British, English, Northern Irish, Scottish, or Welsh',
      irish: 'Irish',
      traveller: 'Irish Traveller or Gypsy',
      other: 'Any other White background',
      preferNotToSay: 'Prefer not to say'
    },
    other: {
      arab: 'Arab',
      other: 'Any other ethnic background',
      preferNotToSay: 'Prefer not to say'
    }
  }

  const selectedEthnicBackground = {
    asian: weighted.select({
      bangladeshi: 0.1,
      chinese: 0.05,
      indian: 0.29,
      pakistani: 0.43,
      other: 0.03,
      preferNotToSay: 0.1
    }),
    black: weighted.select({
      african: 0.8,
      caribbean: 0.16,
      other: 0.03,
      preferNotToSay: 0.01
    }),
    mixed: weighted.select({
      asian: 0.24,
      african: 0.15,
      caribbean: 0.3,
      other: 0.29,
      preferNotToSay: 0.02
    }),
    white: weighted.select({
      british: 0.9,
      irish: 0.01,
      traveller: 0,
      other: 0,
      preferNotToSay: 0.09
    }),
    other: weighted.select({
      arab: 0.45,
      other: 0.51,
      preferNotToSay: 0.04
    })
  }

  if (diversityQuestionnaireAnswered === 'Yes') {

    sex = sexOptions[selectedSex]

    disabled = disabledOptions[selectedDisabled]

    let disabilityCount = faker.datatype.number(3) // up to 3 disabilities

    let disabilityChoices = [
      'Blind',
      'Deaf',
      'Learning difficulty',
      'Long-standing illness',
      'Mental health condition',
      'Physical disability or mobility issue',
      'Social or communication impairment',
      'Other'
    ]

    let shuffledDisabilities = disabilityChoices.sort(() => 0.5 - Math.random())

    if (disabled === 'Yes' && disabilityCount) {
      disabilities = shuffledDisabilities.slice(0, disabilityCount).sort()
    }

    ethnicGroup = ethnicGroupOptions[selectedEthnicGroup]

    switch (ethnicGroup) {
      case 'Asian or Asian British':
        ethnicBackground = ethnicBackgroundOptions.asian[selectedEthnicBackground.asian]
        break
      case 'Black, African, Black British or Caribbean':
        ethnicBackground = ethnicBackgroundOptions.black[selectedEthnicBackground.black]
        break
      case 'Mixed or multiple ethnic groups':
        ethnicBackground = ethnicBackgroundOptions.mixed[selectedEthnicBackground.mixed]
        break
      case 'White':
        ethnicBackground = ethnicBackgroundOptions.white[selectedEthnicBackground.white]
        break
      case 'Another ethnic group':
        ethnicBackground = ethnicBackgroundOptions.other[selectedEthnicBackground.other]
        break
    }

  }

  return {
    givenName: generatorHelpers.firstName(sex),
    familyName: generatorHelpers.lastName(),
    dateOfBirth: faker.date.between('1958-01-01', '1998-12-31'),
    nationality,
    residency,
    isInternationalCandidate,
    diversityQuestionnaireAnswered,
    sex,
    disabled,
    disabilities,
    ethnicGroup,
    ethnicBackground
  }
}
