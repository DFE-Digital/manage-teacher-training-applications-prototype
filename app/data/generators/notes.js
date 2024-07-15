const faker = require('@faker-js/faker').faker
const user = require('../user')

module.exports = () => {

  let notes = {
    items: []
  }

  var message = faker.helpers.arrayElement([
    'The candidate has appropriate qualifications. Personal statement looks good too – I think we should get them in for interview.',
    'I’d like a second opinion on the personal statement as I’m not sure they’re suitable for the course they’ve applied for.',
    'Several grammar and spelling issues in the personal statement.',
    'Some gaps in the work history to talk about if we interview them.',
    'They’ll need to do an equivalency test. We should find out whether they’ve already considered this.',
    'I checked and they should need the requirements for home funding.',
    'Graham says we should invite them in for interview. They seem like a strong candidate so we should prioritise this.',
    'Might be more suitable for a Media Studies course.',
    'Excellent work experience although there’s a 3 year gap we need to ask about.',
    'Let’s get them in for an interview, but I’m concerned about their dedication to teaching. The personal statement doesn’t say enough about why they’re interested in training to teach.',
    'Ready for review.',
    'A high quality application. We should get them in for interview as soon as possible.',
    'Find out about the gap in work history (2016 to 2019) before deciding whether to interview them.',
    'Check with Lucy which school she recommends for this one.',
    'I spoke to this candidate at an event. They seemed very keen and had done a lot of research about what’s involved in teaching.',
    'Check with Meera before making a decision about this application.',
    'Send to Leonie to see what she thinks. The candidate could be a good fit for her course.',
    'Will not meet the requirements for home funding. Make sure they realise this and are happy to proceed.',
    'Daniel and Fi agree that we should invite this candidate for interview.',
    'They don’t have a lot of relevant experience but their academic record is strong.',
    'One of the references is very positive, the other raises some red flags about the candidate’s commitment to teaching. We should ask about this if we interview them.',
    'Note that there are safeguarding concerns here. Discuss with Iain if we decide to go ahead with an interview.',
    'We rejected this candidate last year but they’ve gained some relevant experience since then. Worth a second look, I think.'
  ])

  if(faker.helpers.arrayElement([true, false])) {
    notes.items = [{
      id: faker.string.uuid(),
      message: message,
      sender: faker.helpers.arrayElement([
        faker.name.findName(),
        user.firstName + ' ' + user.lastName
      ]),
      date: faker.date.past()
    }]
  }

  return notes

}
