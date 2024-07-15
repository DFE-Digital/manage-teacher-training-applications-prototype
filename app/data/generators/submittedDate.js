const SystemHelper = require('../helpers/system');
const { fakerUK: faker } = require('@faker-js/faker')

module.exports = (params) => {
  let submittedDate

  if(params.status == "Offered") {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 60, 'max': 70 })
    })
  } else if(params.status == "Offer withdrawn") {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Rejected") {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Recruited") {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Conditions not met") {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 20, 'max': 180 })
    })
  } else if(params.status == "Offer declined") {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Application withdrawn") {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Offer accepted") {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 60, 'max': 180 })
    })
  } else {
    submittedDate = SystemHelper.now().minus({
      days: faker.number.int({ 'min': 0, 'max': 40 })
    })
    .plus({ hours: faker.number.int({ 'min': 8, 'max': 16 }) })
    .plus({ minutes: faker.number.int({ 'min': 1, 'max': 59 }) })
  }

  return submittedDate.toISO()
}
