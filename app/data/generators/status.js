module.exports = (faker, cycle) => {
  if (cycle.includes('Previous')) {
    return faker.helpers.randomize([
      'Declined',
      'Offer withdrawn',
      'Rejected',
      'Application withdrawn',
      'Deferred',
      'Conditions not met',
      'Conditions met'
    ])
  }

  if (cycle.includes('Current')) {
    return faker.helpers.randomize([
      'Submitted',
      'Offered',
      'Accepted',
      'Declined',
      'Offer withdrawn',
      'Rejected',
      'Application withdrawn',
      'Conditions not met',
      'Conditions met'
    ])
  }

  if (cycle.includes('Next')) {
    return faker.helpers.randomize([
      'Deferred'
    ])
  }
}
