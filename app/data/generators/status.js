module.exports = (faker) => {
  return faker.helpers.randomize([
    'Deferred',
    'Submitted',
    'Interviewing',
    'Accepted',
    'Declined',
    'Offer withdrawn',
    'Rejected',
    'Application withdrawn',
    'Conditions not met'
  ])
}
