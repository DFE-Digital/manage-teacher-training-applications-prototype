const faker = require('faker')
faker.locale = 'en_GB'
const { DateTime } = require('luxon')
let generateWithdrawal = require('./withdrawal')

module.exports = (params) => {
  let status = params.status
  let submittedDate = params.submittedDate
  let madeDate = DateTime.fromISO(submittedDate).plus({ days: faker.datatype.number({ min: 3, max: 19 }) }).toISO()

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
    withdrawalDate = DateTime.fromISO(madeDate).plus({ days: faker.datatype.number({ min: 1, max: 5 })}).toISO()
    withdrawalReasons = generateWithdrawal()
  }

  let acceptedDate = null
  if(status === 'Conditions pending' || status === 'Recruited' || status === 'Conditions not met' || status === 'Deferred') {
    acceptedDate = DateTime.fromISO(madeDate).plus({ days: faker.datatype.number({ min: 1, max: 3 })}).toISO()
  }

  let standardConditions
  let conditions

  if(params.status == 'Deferred' || params.status == 'Conditions pending' || faker.helpers.randomize([true, false])) {
    standardConditions = [{
      id: faker.datatype.uuid(),
      description: 'Fitness to teach check',
      status: conditionStatus
    }, {
      id: faker.datatype.uuid(),
      description: 'Disclosure and barring service check',
      status: conditionStatus
    }]

    conditions =  [{
      id: faker.datatype.uuid(),
      description: 'You need to take English speaking course',
      status: conditionStatus
    }]
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
