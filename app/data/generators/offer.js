const faker = require('faker')
faker.locale = 'en_GB'
const { DateTime } = require('luxon')
let generateWithdrawal = require('./withdrawal')

module.exports = (params) => {
  let status = params.status
  let submittedDate = params.submittedDate
  let madeDate = DateTime.fromISO(submittedDate).plus({ days: faker.random.number({ min: 3, max: 19 }) }).toISO()

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

  let withdrawalDate = null;
  let withdrawalReasons = null;
  if(status === 'Offer withdrawn') {
    withdrawalDate = DateTime.fromISO(madeDate).plus({ days: faker.random.number({ min: 1, max: 5 })}).toISO()
    withdrawalReasons = generateWithdrawal()
  }

  let acceptedDate = null
  if(status === 'Accepted' || status === 'Conditions met' || status === 'Conditions not met' || status === 'Deferred') {
    acceptedDate = DateTime.fromISO(madeDate).plus({ days: faker.random.number({ min: 1, max: 3 })}).toISO()
  }

  return {
    madeDate,
    acceptedDate,
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
    }],
    withdrawalDate,
    withdrawalReasons
  }
}
