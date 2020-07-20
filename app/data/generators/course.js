module.exports = (faker) => {
  const courseName = faker.helpers.randomize([
    'Primary',
    'Primary (3-7)',
    'Primary (5-11)'
  ])
  const courseCode = faker.random.alphaNumeric(4).toUpperCase()
  return `${courseName} ${courseCode}`
}
