const SystemHelper = require('../helpers/system');
const faker = require('faker')
faker.locale = 'en_GB'

module.exports = (params) => {
  let submittedDate


  if(params.status == "Offered") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 60, 'max': 70 })
    })
  } else if(params.status == "Offer withdrawn") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Rejected") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Ready to enroll") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Conditions not met") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 20, 'max': 180 })
    })
  } else if(params.status == "Offer declined") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Application withdrawn") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Offer accepted") {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 60, 'max': 180 })
    })
  } else {
    submittedDate = SystemHelper.now().minus({
      days: faker.random.number({ 'min': 0, 'max': 40 })
    }).toISO()
  }

  return submittedDate
}
