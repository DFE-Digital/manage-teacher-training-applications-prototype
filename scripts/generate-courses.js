const faker = require('faker')
faker.locale = 'en_GB'
const fs = require('fs')
const path = require('path')

const OrgHelper = require('../app/data/helpers/organisation')
const user = require('../app/data/user')
const partners = user.relationships.map(relationship => relationship.org2)
const generateCourse = require('../app/data/generators/course')

const generateFakeCourse = (params = {}) => {
  return generateCourse(params)
}

const generateFakeCourses = (count) => {
  const courses = []

  let user_org = user.organisation

  let historyCourse = generateFakeCourse({ trainingProvider: user_org, accreditedBody: user_org })
  historyCourse.name = 'History'
  historyCourse.code = 'HIS1'

  let englishCourse = generateFakeCourse({ trainingProvider: user_org, accreditedBody: user_org })
  englishCourse.name = 'English'
  englishCourse.code = 'E15P'


  courses.push(historyCourse)
  courses.push(englishCourse)

  return courses
}

const generateCoursesFile = (filePath, count) => {
  const courses = generateFakeCourses(count)
  const fileData = JSON.stringify(courses, null, 2)
  fs.writeFile(
    filePath,
    fileData,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Course data generated: ${filePath}`)
    }
  )
}

// faker.datatype.number({ 'min': 10, 'max': 25 })

generateCoursesFile(path.join(__dirname, '../app/data/courses.json'), 25)
