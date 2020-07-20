module.exports = (faker, status) => {
  let conditionStatus = 'Pending'
  if (status === 'Conditions met') {
    conditionStatus = 'Met'
  }
  if (status === 'Conditions not met') {
    conditionStatus = 'Not met'
  }
  if (status === 'Deferred') {
    conditionStatus = 'Met'
  }

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
