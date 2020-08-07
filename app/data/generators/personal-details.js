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
  const diversityQuestionnaireAnswered=faker.helpers.randomize([true, true, false])

  let diversityQuestionnaire

  const sexInteger = faker.helpers.randomize([0, 1])

  let sex
  let ethnicGroup
  let disabledAnswer
  let disabilities

  if (diversityQuestionnaireAnswered){

    sex = { 0: "Male", 1: "Female" }[sexInteger]

    ethnicGroup = faker.helpers.randomize([
      "Asian or Asian British",
      "Black, African, Black British or Caribbean",
      "Mixed or multiple ethnic groups",
      "White",
      "Another ethnic group",
      "Prefer not to say"
    ])

    disabledAnswer = faker.helpers.randomize(["Yes", "No", "Prefer not to say"])

    disabilityCount = faker.random.number(3); // up to 3 disabilities

    let disabilityChoices = [
      "Blind",
      "Deaf",
      "Learning difficulty",
      "Long-standing illness",
      "Mental health condition",
      "Physical disability or mobility issue",
      "Social or communication impairment",
      "Other"
    ]
    let shuffledDisabilities = disabilityChoices.sort(() => 0.5 - Math.random());

    if ((disabledAnswer=="Yes") && disabilityCount){
      disabilities = shuffledDisabilities.slice(0, disabilityCount).sort();
    }

  }




  return {
    givenName: faker.name.firstName(sexInteger),
    familyName: faker.name.lastName(sexInteger),
    dateOfBirth: faker.date.between('1958-01-01', '1998-01-01'),
    nationality,
    residency,
    isInternationalCandidate,
    diversityQuestionnaireAnswered,
    sex,
    ethnicGroup,
    disabledAnswer,
    disabilities

  }
}
