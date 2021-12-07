const Utils = require('./utils')

const locations = require('../locations')
const courses = require('../courses')

exports.getCourses = (selectedItem) => {
  const items = []

  courses.forEach((course, i) => {
    const item = {}

    item.text = course.name
    item.text += ' (' + course.code + ')'
    item.value = course.code
    item.id = course.code
    item.checked = (selectedItem && selectedItem.includes(course.code)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = Utils.arrayToList(
        array = course.qualifications,
        join = ', ',
        final = ' with '
      )
    item.hint.text += ' - ' + course.accreditedBody.name

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getCourse = (courseId) => {
  return courses.find(course => course.code === courseId)
}

exports.getCourseStudyModes = (courseId, selectedItem) => {
  const items = []
  const course = courses.find(course => course.code === courseId)

  course.studyModes.forEach((studyMode, i) => {
    const item = {}

    item.text = studyMode
    item.value = studyMode
    item.id = studyMode
    item.checked = (selectedItem && selectedItem.includes(studyMode)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getCourseLocations = (courseId, selectedItem) => {
  const items = []
  const course = courses.find(course => course.code === courseId)

  course.locations.forEach((location, i) => {
    const item = {}

    item.text = location.name
    item.value = location.id
    item.id = location.id
    item.checked = (selectedItem && selectedItem.includes(location.id)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = Utils.arrayToList(
        array = Object.values(location.address),
        join = ', ',
        final = ', '
      )

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  return items
}

exports.getCourseLocation = (locationId) => {
  return locations.find(location => location.id === locationId)
}
