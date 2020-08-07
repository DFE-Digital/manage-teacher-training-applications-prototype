const { DateTime } = require('luxon')
const moment = require('moment')
const pluralize = require('pluralize')

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
   * GOV.UK style dates
   * @type {String} str
   */
  filters.govukDate = date => {
    return moment(date).format('D MMMM YYYY')
  }

  filters.govukDateAtTime = date => {
    const govukDate = filters.govukDate(date)
    const time = filters.time(date)
  return govukDate + " at " + time
  }


  filters.time = (str) => {
    var m = moment(str)
    if (m.minutes() > 0) {
      return m.format('h:mma')
    } else {
      return m.format('ha')
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
    switch (status) {
      case 'Deferred':
        return 'govuk-tag--yellow'
      case 'Offer withdrawn':
        return 'app-tag--orange'
      case 'Application withdrawn':
        return 'app-tag--red'
      case 'Declined':
        return 'app-tag--red'
      case 'Rejected':
        return 'app-tag--orange'
      case 'Conditions not met':
        return 'app-tag--red'
      case 'Accepted':
        return 'app-tag--blue'
      case 'Conditions met':
        return 'app-tag--green'
      case 'Offered':
        return 'app-tag--turquoise'
      case 'Submitted':
        return 'app-tag--purple'
      case 'Note added':
        return 'govuk-tag--pink'
    }
  }


  filters.numbersToWords = (number) =>{
    let numbers = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten"
    ]

    if (number > 10) return number
    else return numbers[number -1]
  }

  // Pluralise content

  // Pass in string and count
  // {{ "carrot" | pluralise(4) }} --> carrots

  // https://www.npmjs.com/package/pluralize
  filters.pluralise = (content, ...args) => {
    pluralize.addPluralRule(/correspondence$/i, 'correspondence')
    return pluralize(content, ...args)
  }


  return filters
}
