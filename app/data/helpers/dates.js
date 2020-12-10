const { DateTime } = require('luxon')

// TODO: refactor to create a date time during working hours

exports.getFutureDate = function(date, min = 1, max = 20) {
  const dt = DateTime.fromJSDate(date)
  const num = Math.floor(Math.random() * (max - min) + min)
  return dt.plus({ days: num, hours: num, minutes: num }).toJSDate()
}

exports.getPastDate = function(date, min = 1, max = 20) {
  const dt = DateTime.fromJSDate(date)
  const num = Math.floor(Math.random() * (max - min) + min)
  return dt.minus({ days: num, hours: num, minutes: num }).toJSDate()
}
