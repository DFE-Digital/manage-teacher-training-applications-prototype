const { DateTime } = require('luxon')

exports.now = () => {
  return DateTime.fromObject({
    day: 15,
    month: 8,
    year: 2020
  })
}
