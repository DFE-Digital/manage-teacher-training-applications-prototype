const { DateTime } = require('luxon')
var _ = require('lodash');
const moment = require('moment')
const pluralize = require('pluralize')
const fs = require('fs')
const path = require('path')
const individualFiltersFolder = path.join(__dirname, './filters')

module.exports = (env) => {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  // Import filters from filters folder
  if (fs.existsSync(individualFiltersFolder)) {
    var files = fs.readdirSync(individualFiltersFolder)
    files.forEach(file => {
      let fileData = require(path.join(individualFiltersFolder, file))
      // Loop through each exported function in file (likely just one)
      Object.keys(fileData).forEach((filterGroup) => {
        // Get each method from the file
        Object.keys(fileData[filterGroup]).forEach(filterName => {
          filters[filterName] = fileData[filterGroup][filterName]
        })
      })
    })
  }

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
  // filters.govukDate = date => {
  //   return moment(date).format('D MMMM YYYY')
  // }

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
      case 'Received':
        return 'app-tag--purple'
      case 'Awaiting interview':
        return 'govuk-tag--yellow'
      case 'Interviewed':
        return 'govuk-tag--green'
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

// Add name, value, id, idPrefix and checked attributes to GOVUK form inputs
// Generate the attributes based on the application ID and the section they’re in

// Copied from Apply, but modified to work with data directly

/* Usage:
{{ govukCheckboxes({
  fieldset: {
    legend: {
      text: "Nationality",
      classes: "govuk-fieldset__legend--s"
    }
  },
  items: [
    {
      text: "British"
    },
    {
      text: "Irish"
    },
    {
      text: "Other"
    }
  ]
} | decorateAttributes(data, "data.nationality"))}}

Will populate name and id, and add value and checked for each item
*/

filters.decorateAttributes = (obj, data, value) => {

  // Map dot or bracket notation to path parts
  pathParts = _.toPath(value)
  // Path parts includes the string name of data, which we don't need
  let storedValue = _.get(data, [...pathParts].splice(1) )

  // Strip data from path as autodata store auto-adds it.
  if (pathParts[0] === 'data'){
    pathParts.shift(1)
  }

  if (obj.items !== undefined) {
    obj.items = obj.items.map(item => {
      if (item.divider) return item

      var checked = storedValue ? '' : item.checked
      var selected = storedValue ? '' : item.selected
      if (typeof item.value === 'undefined') {
        item.value = item.text
      }

      // If data is an array, check it exists in the array
      if (Array.isArray(storedValue)) {
        if (storedValue.indexOf(item.value) !== -1) {
          checked = 'checked'
          selected = 'selected'
        }
      } else {
        // The data is just a simple value, check it matches
        if (storedValue === item.value) {
          checked = 'checked'
          selected = 'selected'
        }
      }

      item.checked = (item.checked !== undefined) ? item.checked : checked
      item.selected = (item.selected !== undefined) ? item.selected : selected
      return item
    })

    obj.idPrefix = pathParts.join('-')
  } else {
    // Check for undefined because the value may exist and be intentionally blank
    if (typeof obj.value === 'undefined') {
      obj.value = storedValue
    }
  }
  obj.id = (obj.id) ? obj.id : pathParts.join('-')
  obj.name = (obj.name) ? obj.name: pathParts.map(s => `[${s}]`).join('')
  return obj
}


  return filters
}
