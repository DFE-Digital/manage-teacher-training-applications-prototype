module.exports = (faker) => {
  return faker.helpers.randomize([
    'Previous cycle (2019 to 2020)',
    'Current cycle (2020 to 2021)',
    'Next cycle (2021 to 2022)'
  ])
}
