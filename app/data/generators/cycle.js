module.exports = (faker, params = {}) => {

  if(params.status === 'Awaiting decision') {
    return '2020 to 2021'
  } else {
    return faker.helpers.randomize([
      '2019 to 2020',
      '2020 to 2021'
    ])
  }

}
