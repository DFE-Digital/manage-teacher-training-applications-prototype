// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const _ = require('lodash')
const { DateTime, Info } = require("luxon")

// Leave this filters line
const filters = {}

/*
  ====================================================================
  arrayToDateObject
  --------------------------------------------------------------------
  Convert array to javascript date object
  ====================================================================

  Usage:

  {{ [1,2,2020] | arrayToDateObject }}

  = 2020-02-01T00:00:00.000Z

*/

filters.arrayToDateObject = (array) => {
  return new Date(array[2], array[1] -1, array[0])
}

// Output date array - for use in design system macros
filters.toDateArray = (date) => {
  if (!date) return []
  if (_.isArray(date)) return date
  else {
    return [DateTime.fromISO(date).day, DateTime.fromISO(date).month, DateTime.fromISO(date).year]
  }
}
/*
  ====================================================================
  today
  --------------------------------------------------------------------
  Today's date as javascript date object
  ====================================================================

  Usage:

    {{ "" | today }}

  = 2020-02-01T00:00:00.000Z

*/

filters.today = () => {
  return new Date()
}

/*
  ====================================================================
  todayGovuk
  --------------------------------------------------------------------
  Today's date GOV.UK formatted
  ====================================================================

  Usage:

    {{ "" | todayGovuk }}

  = 19 March 2020

*/

filters.todayGovuk = () => {
  return DateTime.local().toFormat('d MMMM yyyy')
}

/*
  ====================================================================
  dateToGovukDate
  --------------------------------------------------------------------
  Convert date object to govuk date (1 February 2020)
  ====================================================================

  Usage:

  {{ date | dateToGovukDate }}

  = 1 February 2020

*/

filters.dateToGovukDate = (date) => {
  if (date) {
    let theDate = DateTime.fromISO(date)
    if (theDate.isValid) {
      return theDate.toFormat('d MMMM yyyy')
    }
  }
  return ''
}

filters.govukDate = (date) => {
  if (_.isArray(date)) {
    return filters.arrayToGovukDate(date)
  } else {
    return filters.dateToGovukDate(date)
  }
}

filters.govukExampleHintDate = (date) => {
  return DateTime.fromISO(date).toFormat('d M yyyy')
}

filters.minusDays = (date, days) => {
  return DateTime.fromISO(date).minus({
    days: days
  })
}



/*
  ====================================================================
  arrayToGovukDate
  --------------------------------------------------------------------
  Convert array to govuk date
  ====================================================================

  Usage:

  {{ [1, 2, 2020] | arrayToGovukDate }}

  = 1 February 2020

*/

filters.arrayToGovukDate = (array) => {
  let dateObject = filters.arrayToDateObject(array)
  let govukDate = filters.dateToGovukDate(dateObject.toISOString())
  return govukDate
}

/*
  ====================================================================
  prettyMonth
  --------------------------------------------------------------------
  Return month names from numbers.
  ====================================================================

  Usage:

  {{ 1 | prettyMonth }}

  = January

*/

filters.prettyMonth = (monthNumber) => {
  if (monthNumber) {
    return Info.months()[(monthNumber-1)]
  } else {
    return null
  }
}

/*
  ====================================================================
  sortDateArrays
  --------------------------------------------------------------------
  Add support for sorting by date arrays
  ====================================================================
  Copied from https://github.com/mozilla/nunjucks/blob/master/nunjucks/src/filters.js#L425

  Requires positional args, no named args
*/

//
filters.sortDateArrays = (arr, reversed, attr) => {
  let array = _.map(arr, v => v)

  array.sort((a, b) => {
    let x = (attr) ? a[attr] : a
    let y = (attr) ? b[attr] : b

    // Convert arrays of 3 to date objects
    x = (_.isArray(x) && (x.length == 3)) ? filters.arrayToDateObject(x) : x
    y = (_.isArray(y) && (y.length == 3)) ? filters.arrayToDateObject(y) : y

    if (x < y) {
      return reversed ? 1 : -1
    } else if (x > y) {
      return reversed ? -1 : 1
    } else {
      return 0
    }
  })

  return array
}

// https://momentjs.com/docs/#/displaying/format/
filters.formatDate = (date, format, dateFormat) => {

  let returnDate
  // No date provided.
  if (!date) {
    // console.log('error for', date, 'format', format)
    return null
    // throw "Error in formatDate: no date provided"
  }
  // Check for valid date
  else if (_.isString(dateFormat) && DateTime.fromISO(date).isValid) {
    // returnDate = moment(date, dateFormat)
    returnDate = DateTime.fromISO(date).toFormat(dateFormat)
  }
  else if ( DateTime.fromISO(date).isValid ) {
    returnDate = DateTime.fromISO(date)
  }
  // Invalid date
  else {
    throw "Error in formatDate: invalid date"
  }

  switch (format) {
    // 2018-03-21
    case 'dashDate':
      return returnDate.toFormat('yyyy-MM-dd')

    // 2018/03/21
    case 'slashDate':
      return returnDate.toFormat('yyyy/MM/dd')

    // 2018/03
    case 'yearMonth':
      return returnDate.toFormat('yyyy/MM')

    // 2018-03-21T00:00:00.000Z
    case 'iso8601':
      return returnDate.toISODate()

    // 2 days ago, in 1 day
    case 'relative':
      return returnDate.toRelative()

    // 21 March 2018
    case 'pretty':
      return returnDate.toFormat('d MMMM yyyy')

    // 21 March 2018 at 12:00am
    case 'full':
      return returnDate.toFormat("d MMMM yyyy 'at' h:mma")

    // Default
    default:
      return _.isString(format) ? returnDate.toFormat(format) : returnDate.toString()
  }

}

// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
