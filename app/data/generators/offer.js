module.exports = (faker, status) => {
  if(!["Offered", "Accepted", "Conditions met", "Declined", "Offer withdrawn", "Conditions not met", "Deferred"].includes(status)) {
    return null;
  }

  const conditionStatus = faker.helpers.randomize([
    'Pending',
    'Met',
    'Not met'
  ])

  return {
    madeDate: faker.date.past(),
    acceptedDate: faker.date.past(),
    standardConditions: [{
      id: faker.random.uuid(),
      description: 'Fitness to teach check',
      status: conditionStatus
    }, {
      id: faker.random.uuid(),
      description: 'Disclosure and barring service check',
      status: conditionStatus
    }],
    conditions: [{
      id: faker.random.uuid(),
      description: 'You need to take English speaking course',
      status: conditionStatus
    }]
  }
}
