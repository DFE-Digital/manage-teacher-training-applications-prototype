const { DateTime } = require('luxon')

exports.now = () => {
  return DateTime.now()
}
