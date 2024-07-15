const { fakerUK: faker } = require('@faker-js/faker')
const { DateTime } = require('luxon')
let generateWithdrawal = require('./withdrawal')

module.exports = (params) => {
  let status = params.status
  let submittedDate = params.submittedDate
  let madeDate = DateTime.fromISO(submittedDate).plus({ days: faker.number.int({ min: 3, max: 19 }) }).toISO()

  let conditionStatus = 'Pending'
  if (status === 'Recruited') {
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
    withdrawalDate = DateTime.fromISO(madeDate).plus({ days: faker.number.int({ min: 1, max: 5 })}).toISO()
    withdrawalReasons = generateWithdrawal()
  }

  let acceptedDate = null
  if(status === 'Conditions pending' || status === 'Recruited' || status === 'Conditions not met' || status === 'Deferred') {
    acceptedDate = DateTime.fromISO(madeDate).plus({ days: faker.number.int({ min: 1, max: 3 })}).toISO()
  }

  let standardConditions
  let conditions

  if(params.status == 'Deferred' || params.status == 'Conditions pending' || faker.helpers.arrayElement([true, false])) {
    standardConditions = [{
      id: faker.string.uuid(),
      description: 'Fitness to train to teach check',
      status: 'Met'
    }, {
      id: faker.string.uuid(),
      description: 'Disclosure and Barring Service (DBS) check',
      status: 'Met'
    },
    {
      id: faker.string.uuid(),
      description: '2 references',
      status: 'Pending'
    }
    ]

  }

  return {
    provider: params.provider,
    course: params.course,
    courseCode: params.courseCode,
    location: params.location,
    studyMode: params.studyMode,
    accreditedBody: params.accreditedBody,
    fundingType: params.fundingType,
    qualifications: params.qualifications,
    madeDate,
    acceptedDate,
    standardConditions,
    conditions,
    withdrawalDate,
    withdrawalReasons
  }
}
