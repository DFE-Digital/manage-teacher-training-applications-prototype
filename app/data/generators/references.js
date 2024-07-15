const faker = require('@faker-js/faker').faker
faker.locale = 'en_GB'

module.exports = (status) => {

  console.log('generating reference for ' + status)

  const type = faker.helpers.randomize([
    'Academic',
    'Professional',
    'School based',
    'Character'
  ])

  const comments = faker.helpers.randomize([
    'A charismatic talented and able person. Great with people, fantastic personality and a strong communicator passionate about teaching. Great potential. Go for them!',
    'Fantastic personality. Great with people. Strong communicator. Excellent character. Passionate about teaching with great potential.',
    'A very smart young person who I have had the pleasure of working with since spring last year (2019).\n\nWe rely on bar staff to be responsible, reliable, trustworthy with stock and takings, and maintain excellent time-keeping. In all of these respects they exceeded expectations, remaining calm in difficult situations and always equally happy to work independently or as part of a team.',
    'They have great communication skills and during their time with us there have been no misunderstandings or difficulties with either with customers or staff. They managed everything to a very good standard and always went the extra mile – for example by designing and creating a social media campaign for our relaunch.',
    'Their enthusiasm and love of the subject made them an inspiration to be around.\n\nIf they’re able to bring the same patience, people skills and good humour to teaching, I believe that they will make a fantastic teacher.'
  ])

  const relationshipSummary = faker.helpers.randomize([
    'Course supervisor at university. I’ve known them for a year',
    'Was my line manager in my last job. I’ve known them for 2 years',
    'Deputy head at the school where I currently volunteer. I’ve known them for 3 years',
    'Was the head coach for my athletics club. I’ve known them for 5 years'
  ])

  const referee = (status) => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()

    let ref =  {
      type,
      name: `${firstName} ${lastName}`,
      email: faker.internet.email(firstName, lastName).toLowerCase(),
      relationship: {
        summary: relationshipSummary
      }
    }

    if (status != 'Received') {
      ref['comments'] = comments
      ref.relationship.validated = true
      ref['safeguarding'] = {
        response:  'no'
      }
    }

    return ref
  }

  let references = {}
  references['12446'] = referee(status)
  references['26436'] = referee(status)

  return references
}
