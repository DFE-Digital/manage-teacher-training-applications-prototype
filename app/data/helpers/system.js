const { DateTime } = require('luxon')

exports.now = () => {
  return DateTime.now().set({
    hour: 1,
    minute: 0
  })
}
