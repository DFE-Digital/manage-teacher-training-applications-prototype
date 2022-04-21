const SystemHelper = require('../helpers/system');
const faker = require('faker')
faker.locale = 'en_GB'

module.exports = (params) => {
  let submittedDate

  if(params.status == "Offered") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 60, 'max': 70 })
    })
  } else if(params.status == "Offer withdrawn") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Rejected") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Recruited") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Conditions not met") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 20, 'max': 180 })
    })
  } else if(params.status == "Declined") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Application withdrawn") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Conditions pending") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 60, 'max': 180 })
    })
  } else if(params.status == "Interviewing") {
    submittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 5, 'max': 35 })
    })
  } else {
    let randomSubmittedDate = SystemHelper.now().minus({
      days: faker.datatype.number({ 'min': 0, 'max': 40 })
    })
    .plus({ hours: faker.datatype.number({ 'min': 8, 'max': 16 }) })
    .plus({ minutes: faker.datatype.number({ 'min': 1, 'max': 59 }) })

    submittedDate = faker.helpers.randomize([SystemHelper.now(), randomSubmittedDate, randomSubmittedDate])
  }

  return submittedDate.toISO()
}
