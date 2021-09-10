const fs = require('fs')
const path = require('path')

const generateCourse = require('../app/data/generators/course')

const generateFakeCourse = (params = {}) => {
  return generateCourse(params)
}

const generateFakeCourses = (count) => {
  const courses = []

  for (let i = 0; i < count; i++) {
    const course = generateFakeCourse({

    })
    courses.push(course)
  }

  return courses
}

const generateCoursesFile = (filePath, count) => {
  const courses = generateFakeCourses(count)
  const filedata = JSON.stringify(courses, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Course data generated: ${filePath}`)
    }
  )
}

generateCoursesFile(path.join(__dirname, '../app/data/courses.json'), 25)
