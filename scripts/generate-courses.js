const faker = require('faker')
faker.locale = 'en_GB'
const fs = require('fs')
const path = require('path')

const OrgHelper = require('../app/data/helpers/organisation')

const relationships = require('../app/data/relationships-wren-academy.js')
const partners = relationships.map(relationship => relationship.org2)

const generateCourse = require('../app/data/generators/course')

const generateFakeCourse = (params = {}) => {
  return generateCourse(params)
}

const generateFakeCourses = (count) => {
  const courses = []
  const organisations = ['Wren Academy']

  organisations.forEach((organisation, i) => {
    const org = OrgHelper.findOrg(organisation)

    if (org.isAccreditedBody) {
      partners.forEach((partner) => {
        for (let i = 0; i < count; i++) {
          const course = generateFakeCourse({ trainingProvider: partner, accreditedBody: org })
          courses.push(course)
        }
      })
    } else {
      partners.forEach((partner) => {
        for (let i = 0; i < count; i++) {
          const course = generateFakeCourse({ trainingProvider: org, accreditedBody: partner })
          courses.push(course)
        }
      })

    }


  })

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
