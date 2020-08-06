module.exports = (faker, params = {}) => {

  if(params.status === 'Submitted') {
    return 'Current cycle (2020 to 2021)'
  } else {
    return faker.helpers.randomize([
      'Previous cycle (2019 to 2020)',
      'Current cycle (2020 to 2021)'
    ])
  }

}
