module.exports = (faker) => {
  const courseName = faker.helpers.randomize([
    'Primary',
    'Primary with English',
    'Primary with geography and history',
    'Primary with mathematics',
    'Primary with modern languages',
    'Primary with physical education',
    'Primary with science',
    'Art and design',
    'Biology',
    'Business studies',
    'Chemistry',
    'Citizenship',
    'Classics',
    'Communications and media studies',
    'Computing',
    'Dance',
    'Design and technology',
    'Drama',
    'Economics',
    'English',
    'Geography',
    'Health and social care',
    'History',
    'Mathematics',
    'Music',
    'Physical education',
    'Physics',
    'Psychology',
    'Religious education',
    'Science',
    'Social sciences',
    'English as a second or other language',
    'French',
    'German',
    'Italian',
    'Japanese',
    'Mandarin',
    'Modern languages (other)',
    'Russian',
    'Spanish'
  ])
  const courseCode = faker.random.alphaNumeric(4).toUpperCase()
  return `${courseName} (${courseCode})`
}

// 'Primary (3-7)',
// 'Primary (5-11)'
