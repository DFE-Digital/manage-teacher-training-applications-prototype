const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

function statusClass (status) {
    switch (status) {
      case 'Deferred':
        return 'govuk-tag--yellow'
      case 'Offer withdrawn':
        return 'govuk-tag--orange'
      case 'Application withdrawn':
        return 'app-tag--red'
      case 'Declined':
        return 'app-tag--red'
      case 'Rejected':
        return 'app-tag--orange'
      case 'Conditions not met':
        return 'app-tag--red'
      case 'Conditions pending':
        return 'govuk-tag--blue'
      case 'Recruited':
        return 'govuk-tag--green'
      case 'Offered':
        return 'govuk-tag--turquoise'
      case 'Received':
        return 'govuk-tag--purple'
      case 'Interviewing':
        return 'govuk-tag--yellow'
      case 'Closed':
        return 'app-tag--red'
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

// TODO: refactor to using a plugin
function govukDateAtTime (input) {
  return input
}
addFilter('govukDateAtTime', govukDateAtTime)
