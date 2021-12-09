const { DateTime } = require('luxon')

// TODO: refactor to create a date time during working hours

exports.getFutureDate = function(date, min = 1, max = 5) {
  const dt = DateTime.fromISO(date)
  const num = Math.floor(Math.random() * (max - min) + min)
  return dt.plus({ days: num, hours: num, minutes: num }).toISO()
}

exports.getPastDate = function(date, min = 1, max = 5) {
  const dt = DateTime.fromISO(date)
  const num = Math.floor(Math.random() * (max - min) + min)
  return dt.minus({ days: num, hours: num, minutes: num }).toISO()
}
