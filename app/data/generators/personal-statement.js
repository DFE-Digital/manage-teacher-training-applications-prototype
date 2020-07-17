module.exports = (faker) => ({
  vocation: faker.lorem.paragraphs(6, '\n\n'),
  'subject-knowledge': faker.lorem.paragraphs(4, '\n\n'),
  interview: ''
})
