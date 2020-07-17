module.exports = (faker) => {
  const referenceType = faker.helpers.randomize([
    'Academic',
    'Professional',
    'School based',
    'Character'
  ])

  return {
    first: {
      type: referenceType,
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      tel: faker.phone.phoneNumber(),
      relationship: {
        summary: faker.lorem.sentences(1),
        validated: faker.random.boolean(),
        correction: faker.lorem.paragraphs(1)
      },
      safeguarding: {
        response: faker.helpers.randomize(['no', 'yes']),
        concerns: faker.lorem.paragraphs(1)
      },
      comments: faker.lorem.paragraphs(3, '\n\n')
    },
    second: {
      type: referenceType,
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      tel: faker.phone.phoneNumber(),
      relationship: {
        summary: faker.lorem.sentences(1),
        validated: faker.random.boolean()
      },
      safeguarding: {
        response: faker.helpers.randomize(['no', 'yes']),
        concerns: faker.lorem.paragraphs(1)
      },
      comments: faker.lorem.paragraphs(3, '\n\n')
    }
  }
}
