const weighted = require('weighted')

module.exports = faker => {
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
  const rightToWorkStudy = faker.helpers.randomize([
    'Yes',
    'Not yet',
    'Do not know'
  ])

  const residency = isInternationalCandidate ? {
    rightToWorkStudy,
    details: (rightToWorkStudy === 'Yes') ? 'I have EU settled status' : false
  } : false

  // Equality and diversity
  const diversityQuestionnaireAnswered=faker.helpers.randomize([true, false])

  let diversityQuestionnaire

  const sex = faker.helpers.randomize([0, 1])

  if (diversityQuestionnaireAnswered){
    diversityQuestionnaire = {}

    diversityQuestionnaire['sex'] = { 0: "Male", 1: "Female" }[sex]

    diversityQuestionnaire['ethnicGroup'] = faker.helpers.randomize([
      "Asian or Asian British",
      "Black, African, Black British or Caribbean",
      "Mixed or multiple ethnic groups",
      "White",
      "Another ethnic group",
      "Prefer not to say"
    ])

    diversityQuestionnaire['disabled'] = faker.helpers.randomize(["Yes", "No"])
  }




  return {
    givenName: faker.name.firstName(sex),
    familyName: faker.name.lastName(sex),
    dateOfBirth: faker.date.between('1958-01-01', '1998-01-01'),
    nationality,
    residency,
    isInternationalCandidate,
    diversityQuestionnaire
  }
}

    // sex: { 0: "Male", 1: "Female" }[sex],
    // ethnicGroup,
    // disabled
