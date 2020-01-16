const { DateTime } = require('luxon')

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

  filters.status = (status, type) => {
    let id, title
    switch (true) {
      case ('rejected' in status):
        id = 'rejected'
        title = 'Rejected'
        break
      case ('offered' in status) && ('declined' in status):
        id = 'declined'
        title = 'Declined'
        break
      case ('conditions-met' in status):
        id = 'conditions-met'
        title = 'Conditions met'
        break
      case ('offered' in status) && ('accepted' in status):
        id = 'accepted'
        title = 'Accepted'
        break
      case ('offered' in status):
        id = 'offered'
        title = 'Offered'
        break
      default:
        id = 'new'
        title = 'New'
    }
    if (type === 'title') {
      return title
    }

    return id
  }

  /**
   * Convert object to array
   * @type {Object} obj
   */
  filters.filterByStatus = (arr, status) => {
    arr.forEach(a => {
      switch (true) {
        case ('rejected' in a.status):
          a.stage = 'rejected'
          break
        case ('offer' in a.status) && ('declined' in a.status):
          a.stage = 'declined'
          break
        case ('offer' in a.status) && ('accepted' in a.status):
          a.stage = 'accepted'
          break
        case ('offer' in a.status):
          a.stage = 'offer'
          break
        default:
          a.stage = 'new'
      }
    })
    return arr.filter(i => i.stage === status)
  }

  return filters
}
