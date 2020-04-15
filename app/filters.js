const { DateTime } = require('luxon')
const moment = require('moment')

module.exports = (env) => {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  /**
   * Format date string
   * @type {String} str
   */
  filters.date = (str, format = 'yyyy-LL-dd') => {
    if (str) {
      const date = (str === 'now') ? DateTime.local() : str

      const datetime = DateTime.fromISO(date, {
        locale: 'en-GB'
      }).toFormat(format)

      return datetime
    }
  }

  filters.time = (str) => {
    var m = moment(str);
    if(m.minutes() > 0) {
      return m.format('h:mma');
    } else {
      return m.format('ha');
    }
  }

  /**
   * Add days to a date
   * @type {String} str
   */
  filters.addDays = (date, days) => {
    return DateTime.fromISO(date).plus({ days }).toISODate()
  }

  /**
   * Get number of days from today’s date
   * @type {String} str
   */
  filters.daysFromNow = (start) => {
    start = DateTime.fromISO(start)

    const diff = start.diffNow('days').toObject()

    return Math.round(diff.days)
  }

  /**
   * Convert object to array
   * @type {Object} obj
   */
  filters.toArray = (obj) => {
    if (obj) {
      const arr = []
      for (const [key, value] of Object.entries(obj)) {
        value.id = key
        if (value !== '') {
          arr.push(value)
        }
      }

      return arr
    }
  }

  filters.statusClass = (status) => {
    switch(status) {
      case "Offer withdrawn":
        return 'app-tag--red'
      case "Application withdrawn":
        return 'app-tag--orange'
      case "Declined":
        return 'app-tag--orange'
      case "Rejected":
        return 'app-tag--red'
      case "Conditions not met":
        return 'app-tag--red'
      case "Accepted":
        return 'app-tag--blue'
      case "Conditions met":
        return 'app-tag--green'
      case "Offered":
        return 'app-tag--turquoise'
      case "New":
        return 'app-tag--purple'
      case "Enrolled":
        return 'app-tag--blue'
    }
  }

  return filters
}
