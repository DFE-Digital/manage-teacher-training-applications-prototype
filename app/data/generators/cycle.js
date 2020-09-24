module.exports = (faker, params = {}) => {

  if(params.status === 'Awaiting decision') {
    return 'Current cycle (2020 to 2021)'
  } else {
    return faker.helpers.randomize([
      'Previous cycle (2019 to 2020)',
      'Current cycle (2020 to 2021)'
    ])
  }

}
