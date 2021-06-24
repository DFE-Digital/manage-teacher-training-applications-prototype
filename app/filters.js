const _ = require('lodash');
const fs = require('fs')
const path = require('path')
const pluralize = require('pluralize')
const { DateTime } = require('luxon')
const individualFiltersFolder = path.join(__dirname, './filters')
const numeral = require('numeral')

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
   * @type {Date} date
   */

  filters.govukDateAtTime = date => {
    const govukDate = filters.govukDate(date)
    const time = filters.time(date)
    return govukDate + " at " + time
  }

  /**
   * GOV.UK style times
   * @type {Date} date
   */

  filters.time = date => {
    let dt = DateTime.fromISO(date)
    if (dt.minute > 0) {
      dt = dt.toFormat('h:mma')
    } else {
      dt = dt.toFormat('ha')
    }
    return dt.toLowerCase()
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
   * Get number of days from today’s date
   * @type {String} str
   */
  filters.daysFromDate = (end, date) => {
    const a = DateTime.fromISO(date)
    const b = DateTime.fromISO(end)
    const diff = b.diff(a, 'days').toObject()
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

  filters.cycleText = (cycle) => {
    if(cycle == "2020 to 2021") {
      return "2020 to 2021 (starts 2021)"
    } else {
      return "2019 to 2020 (starts 2020)"
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
      case 'Awaiting conditions':
        return 'app-tag--blue'
      case 'Ready to enroll':
        return 'app-tag--green'
      case 'Offered':
        return 'app-tag--turquoise'
      case 'Received':
        return 'app-tag--purple'
      case 'Interviewing':
        return 'govuk-tag--yellow'
      case 'Note added':
        return 'govuk-tag--pink'
      case 'Closed':
        return 'app-tag--red'
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

filters.falsify = (input) => {
  if (_.isNumber(input)) return input
  else if (input == false) return false
  if (_.isString(input)){
    let truthyValues = ['yes','true']
    let falsyValues = ['no', 'false']
    if (truthyValues.includes(input.toLowerCase())) return true
    else if (falsyValues.includes(input.toLowerCase())) return false
  }
  return input;
}

  /* ------------------------------------------------------------------
    utility function to get an error for a component
    example: {{ errors | getErrorMessage('title') }}
    outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function (array, fieldName) {
    if (!array || !fieldName) {
      return null
    }

    const error = array.filter((obj) =>
      obj.fieldName === fieldName
    )[0]

    return error
  }

  /* ------------------------------------------------------------------
   numeral filter for use in Nunjucks
   example: {{ params.number | numeral("0,00.0") }}
   outputs: 1,000.00
  ------------------------------------------------------------------ */
  filters.numeral = (number, format) => {
   return numeral(number).format(format)
  }

  /* ------------------------------------------------------------------
  utility function to get the statistics option label
  example: {{ "cycle" | getStatisticsOptionLabel }}
  outputs: "Year received"
  ------------------------------------------------------------------ */
  filters.getStatisticsOptionLabel = (option) => {
    let label = option
    switch (option) {
      case 'cycle':
        label = 'Year received'
        break
      case 'status':
        label = 'Status'
        break
      case 'subject':
        label = 'Subject'
        break
      case 'studyMode':
        label = 'Full time or part time'
        break
      case 'fundingType':
        label = 'Fee paying or salaried'
        break
      case 'subjectLevel':
        label = 'Primary or secondary'
        break
      case 'location':
      case 'trainingLocation':
        label = 'Location'
        break
      case 'provider':
      case 'trainingProvider':
        label = 'Training provider'
        break
      case 'accreditedBody':
        label = 'Accredited body'
        break
    }
    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the course label
  this is just a trick to make courses look more like courses than subjects
  example: {{ "Art and design" | getCourseLabel }}
  outputs: "Art and design (3CGJ)"
  ------------------------------------------------------------------ */
  filters.getCourseLabel = (course) => {
    let label = course
    switch (course) {
      case 'Art and design':
        label = 'Art and Design (3CGJ)'
        break
      case 'Biology':
        label = 'Biology (32XS)'
        break
      case 'Chemistry':
        label = 'Chemistry (32XT)'
        break
      case 'Computer science':
        label = 'Computer science with IT (3CZH)'
        break
      case 'Design and technology':
        label = 'Design and Technology (33RM)'
        break
      case 'Drama':
        label = 'Drama (3CGK)'
        break
      case 'English':
        label = 'English (338J)'
        break
      case 'Primary':
        label = 'General Primary (3FN2)'
        break
      case 'Geography':
        label = 'Geography (3CGF)'
        break
      case 'History':
        label = 'History (3CJM)'
        break
      case 'Social sciences':
        label = 'Humanities and Social Sciences (PCET) (2V83)'
        break
      case 'Mathematics':
        label = 'Mathematics (3CGN)'
        break
      case 'Music':
        label = 'Music (3CGM)'
        break
      case 'Physical education':
        label = 'Physical education (3CJN)'
        break
      case 'Physics':
        label = 'Physics (32XR)'
        break
      case 'Primary with English':
        label = 'Primary with English (X110)'
        break
      case 'Primary with science':
        label = 'Primary with science (338B)'
        break
      case 'Primary with physical education':
        label = 'Primary with physical education (338C)'
        break
      case 'Primary with mathematics':
        label = 'Primary with Mathematics (3387)'
        break
      case 'Religious education':
        label = 'Religious education (3CGG)'
        break
    }
    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the course label
  this is just a trick to make courses look more like courses than subjects
  example: {{ "Art and design" | getCourseLabel }}
  outputs: "Art and design (3CGJ)"
  ------------------------------------------------------------------ */
  filters.getAssignedUsers = (assignedUsers, userOrganisationId) => {
    let users = assignedUsers.filter(user => {
      return user.organisation.id == userOrganisationId
    })

    users.sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName))

    return users
  }

  return filters
}
