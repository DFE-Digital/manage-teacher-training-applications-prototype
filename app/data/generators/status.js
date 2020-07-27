module.exports = (faker, cycle) => {

  if (cycle.includes('Next')) {
    return faker.helpers.randomize([
      'Deferred'
    ])
  } else {
    return faker.helpers.randomize([
      'Declined',
      'Offer withdrawn',
      'Rejected',
      'Application withdrawn',
      'Conditions not met'
    ])
  }
}
