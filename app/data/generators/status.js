module.exports = (faker) => {
  return faker.helpers.randomize([
    'Deferred',
    'Awaiting decision',
    'Accepted',
    'Declined',
    'Offer withdrawn',
    'Rejected',
    'Application withdrawn',
    'Conditions not met'
  ])
}
