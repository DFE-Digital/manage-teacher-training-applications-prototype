const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {

  let notes = {
    items: []
  }

  var message = faker.helpers.randomize([
    'Waiting on candidate to send information about teaching skills aquired during their Saturday job.',
    'Waiting on academic tutor to confirm availability before scheduling an interview.',
    'Waiting on interview dates from candidate before scheduling interview.',
    'Waiting on tutor to set their interview schedule.',
    faker.lorem.sentence()
  ])

  if(faker.helpers.randomize([true, false])) {
    notes.items = [{
      id: faker.datatype.uuid(),
      message: message,
      sender: faker.name.findName(),
      date: faker.date.past()
    }]
  }

  return notes

}
