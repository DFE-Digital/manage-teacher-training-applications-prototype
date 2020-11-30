module.exports = (faker) => {
  return faker.helpers.randomize([
    'Accepted',
    'Application withdrawn',
    'Awaiting decision',
    'Conditions not',
    'Conditions not met',
    'Declined',
    'Deferred',
    'Interviewing',
    'Offered',
    'Offer withdrawn',
    'Received',
    'Rejected'
  ])
}
