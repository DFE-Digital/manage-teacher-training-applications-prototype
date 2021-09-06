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

  // Equality and diversity
  const diversityQuestionnaireAnswered = faker.helpers.randomize(["Yes", "Yes", "No"])

  const sexInteger = faker.helpers.randomize([0, 1])

  let sex
  let disabled
  let disabilities
  let ethnicGroup
  let ethnicGroupDescription

  let ethnicGroups = [
    {
      name: "Asian or Asian British",
      descriptions: [
        "Bangladeshi",
        "Chinese",
        "Indian",
        "Pakistani",
        // "Any other Asian background",
        "Prefer not to say"
      ]
    },
    {
      name: "Black, African, Black British or Caribbean",
      descriptions: [
        "African",
        "Caribbean",
        // "Any other Black, African or Caribbean background",
        "Prefer not to say"
      ]
    },
    {
      name: "Mixed or multiple ethnic groups",
      descriptions: [
        "Asian and White",
        "Black African and White",
        "Black Caribbean and White",
        // "Any other Mixed or Multiple ethnic background",
        "Prefer not to say"
      ]
    },
    {
      name: "White",
      descriptions: [
        "British, English, Northern Irish, Scottish, or Welsh",
        "Irish",
        "Irish Traveller or Gypsy",
        // "Any other White background",
        "Prefer not to say"
      ]
    },
    {
      name: "Another ethnic group",
      descriptions: [
        "Arab",
        // "Any other ethnic background",
        "Prefer not to say"
      ]
    },
    {
      name: "Prefer not to say"
    }
  ]

  if (diversityQuestionnaireAnswered === "Yes") {

    sex = { 0: "Male", 1: "Female", 2: "Intersex" }[sexInteger]

    disabled = faker.helpers.randomize(["Yes", "No", "Prefer not to say"])

    let disabilityCount = faker.datatype.number(3); // up to 3 disabilities

    let disabilityChoices = [
      "Blind",
      "Deaf",
      "Learning difficulty",
      "Long-standing illness",
      "Mental health condition",
      "Physical disability or mobility issue",
      "Social or communication impairment",
      "Other",
      "Prefer not to say"
    ]
    let shuffledDisabilities = disabilityChoices.sort(() => 0.5 - Math.random());

    if (disabled == "Yes" && disabilityCount){
      disabilities = shuffledDisabilities.slice(0, disabilityCount).sort();
    }

    ethnicGroup = faker.helpers.randomize(ethnicGroups)
    if(ethnicGroup.descriptions) {
      ethnicGroupDescription = faker.helpers.randomize(ethnicGroup.descriptions)
    }
    ethnicGroup = ethnicGroup.name

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
    ethnicGroupDescription
  }
}
