module.exports = (faker) => {
  return faker.helpers.randomize([
    'Deferred',
    'Submitted',
    'Accepted',
    'Declined',
    'Offer withdrawn',
    'Rejected',
    'Application withdrawn',
    'Conditions not met'
  ])
}
