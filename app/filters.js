const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

function statusClass (status) {
    switch (status) {
      case 'New':
        return 'govuk-tag--blue'
      case 'In review':
        return 'govuk-tag--yellow'
      case 'Shortlisted':
        return 'govuk-tag--green'
      case 'Deferred':
        return 'govuk-tag--orange'
      case 'Offer withdrawn':
        return 'govuk-tag--red'
      case 'Application withdrawn':
        return 'govuk-tag--red'
      case 'Declined':
        return 'govuk-tag--red'
      case 'Rejected':
        return 'govuk-tag--red'
      case 'Conditions not met':
        return 'govuk-tag--red'
      case 'Conditions pending':
        return 'govuk-tag--orange'
      case 'Recruited':
        return 'govuk-tag--green'
      case 'Offered':
        return 'govuk-tag--green'
      case 'Received':
        return 'govuk-tag--purple'
      case 'Interviewing':
        return 'govuk-tag--yellow'
      case 'Closed':
        return 'govuk-tag--red'
    }
  }

addFilter('statusClass', statusClass)

function numbersToWords (number) {
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
addFilter('numbersToWords', numbersToWords)


// Ordinal numbers
// Spell out first to ninth. After that use 10th, 11th and so on.
// In tables, use numerals throughout.
// https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#ordinal-numbers
function ordinal (number) {
  if (!number) {
    return null
  }

  const ordinals = [ 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth' ];
  let ordinal = number

  if (number >= 1 && number <= 9) {
    ordinal = ordinals[number-1]
  }

  return ordinal
}
addFilter('ordinal', ordinal)


function falsify (input) {
  // let truthyValues = ['yes','true']
  // let falsyValues = ['no', 'false']
  // if (truthyValues.includes(input.toLowerCase())) return true
  // else if (falsyValues.includes(input.toLowerCase())) return false
  return true
}
addFilter('falsify', falsify)

function arrayToList (array, join = ', ', final = ' and ') {
  const arr = array.slice(0)

  const last = arr.pop()

  if (array.length > 1) {
    return arr.join(join) + final + last
  }

  return last
}
addFilter('arrayToList', arrayToList)

function includes (array, string) {
  return array.includes(string)
}
addFilter('includes', includes)


function dayFromDate (string) {
  return new Date(string).getDate()
}
addFilter('dayFromDate', dayFromDate)

function monthFromDate (string) {
  return new Date(string).getMonth()
}
addFilter('monthFromDate', monthFromDate)

function yearFromDate (string) {
  return new Date(string).getFullYear()
}
addFilter('yearFromDate', yearFromDate)


function daysAgo (string) {

  const datetime = new Date(string)
  const dateNow = new Date()
  const millisecondsBetweenDates = dateNow.getTime() - datetime.getTime();

  return Math.ceil(millisecondsBetweenDates / (1000 * 3600 * 24));
}
addFilter('daysAgo', daysAgo)
