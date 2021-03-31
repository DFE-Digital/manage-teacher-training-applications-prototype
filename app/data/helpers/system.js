const { DateTime } = require('luxon')

exports.now = (application) => {
  return DateTime.fromObject({
    day: 15,
    month: 8,
    year: 2020
  })
}
