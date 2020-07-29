module.exports = (faker) => ({
  vocation: faker.lorem.paragraphs(6, '\n\n'),
  subjectKnowledge: faker.lorem.paragraphs(4, '\n\n'),
  interview: ''
})
