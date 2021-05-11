const { DateTime } = require('luxon')

exports.now = () => {
  return DateTime.now().set({
    hour: 0,
    minute: 0
  })
}
