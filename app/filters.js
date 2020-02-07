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
      case "Accepted":
        return 'app-tag--blue'
      case "Conditions met":
        return 'app-tag--green'
      case "Offered":
        return 'app-tag--turquoise'
      case "New":
        return 'app-tag--purple'
    }
  },

  filters.status = (status, type) => {
    let id, title

    if('enrolled' in status) {
      id = 'enrolled'
      title = 'Enrolled'
    } else if('withdrawn-by-us' in status) {
      id = 'withdrawn-by-us'
      title = 'Offer withdrawn'
    } else if('withdrawn-by-candidate' in status) {
      id = 'withdrawn-by-candidate'
      title = 'Application withdrawn'
    } else if('rejected' in status) {
      id = 'rejected'
        title = 'Rejected'
    } else if('declined' in status) {
      id = 'declined'
      title = 'Declined'
    } else if('conditions-met' in status) {
      id = 'conditions-met'
      title = 'Conditions met'
    } else if('conditions-not-met' in status) {
      id = 'conditions-not-met'
      title = 'Conditions not met'
    } else if('accepted' in status) {
      id = 'accepted'
      title = 'Accepted'
    } else if('offered' in status) {
      id = 'offered'
      title = 'Offered'
    } else {
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
