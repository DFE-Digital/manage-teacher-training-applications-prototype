const { DateTime } = require('luxon')

const now = DateTime.now()

const CYCLES = {
  2019: {
    code: '2018 to 2019',
    shortDesc: '2018 to 2019',
    longDesc: '2018 to 2019 (starts 2019)',
    findOpens: DateTime.fromISO('2018-10-06T09:00:00').toJSDate(),
    applyOpens: DateTime.fromISO('2018-10-13T09:00:00').toJSDate(),
    apply1Deadline: DateTime.fromISO('2019-08-24T18:00:00').toJSDate(),
    apply2Deadline: DateTime.fromISO('2019-09-18T18:00:00').toJSDate(),
    rejectByDefault: DateTime.fromISO('2021-09-29T23:59:59').toJSDate(),
    findCloses: DateTime.fromISO('2019-10-03T23:59:59').toJSDate(),
    ageCalculationDate: DateTime.fromISO('2019-08-31T23:59:59').toJSDate()
  },
  2020: {
    code: '2019 to 2020',
    shortDesc: '2019 to 2020',
    longDesc: '2019 to 2020 (starts 2020)',
    findOpens: DateTime.fromISO('2019-10-06T09:00:00').toJSDate(),
    applyOpens: DateTime.fromISO('2019-10-13T09:00:00').toJSDate(),
    showDeadlineBanner: DateTime.fromISO('2020-08-01T09:00:00').toJSDate(),
    apply1Deadline: DateTime.fromISO('2020-08-24T18:00:00').toJSDate(),
    apply2Deadline: DateTime.fromISO('2020-09-18T18:00:00').toJSDate(),
    rejectByDefault: DateTime.fromISO('2021-09-29T23:59:59').toJSDate(),
    findCloses: DateTime.fromISO('2020-10-03T23:59:59').toJSDate(),
    ageCalculationDate: DateTime.fromISO('2020-08-31T23:59:59').toJSDate()
  },
  2021: {
    code: '2020 to 2021',
    shortDesc: '2020 to 2021',
    longDesc: '2020 to 2021 (starts 2021)',
    findOpens: DateTime.fromISO('2020-10-06T09:00:00').toJSDate(),
    applyOpens: DateTime.fromISO('2020-10-13T09:00:00').toJSDate(),
    showDeadlineBanner: DateTime.fromISO('2021-08-01T09:00:00').toJSDate(),
    apply1Deadline: DateTime.fromISO('2021-09-07T18:00:00').toJSDate(),
    apply2Deadline: DateTime.fromISO('2021-09-21T18:00:00').toJSDate(),
    rejectByDefault: DateTime.fromISO('2021-09-29T23:59:59').toJSDate(),
    findCloses: DateTime.fromISO('2021-10-04T23:59:59').toJSDate(),
    ageCalculationDate: DateTime.fromISO('2021-08-31T23:59:59').toJSDate()
  },
  2022: {
    code: '2021 to 2022',
    shortDesc: '2021 to 2022',
    longDesc: '2021 to 2022 (starts 2022)',
    findOpens: DateTime.fromISO('2021-10-05T09:00:00').toJSDate(),
    applyOpens: DateTime.fromISO('2021-10-12T09:00:00').toJSDate(),
    showDeadlineBanner: DateTime.fromISO('2022-08-01T09:00:00').toJSDate(),
    apply1Deadline: DateTime.fromISO('2022-09-07T18:00:00').toJSDate(),
    apply2Deadline: DateTime.fromISO('2022-09-21T18:00:00').toJSDate(),
    rejectByDefault: DateTime.fromISO('2022-09-29T23:59:59').toJSDate(),
    findCloses: DateTime.fromISO('2022-10-04T23:59:59').toJSDate(),
    ageCalculationDate: DateTime.fromISO('2022-08-31T23:59:59').toJSDate()
  },
  2023: {
    code: '2022 to 2023',
    shortDesc: '2022 to 2023',
    longDesc: '2022 to 2023 (starts 2023)',
    findOpens: DateTime.fromISO('2022-10-05T09:00:00').toJSDate(),
    applyOpens: DateTime.fromISO('2022-10-12T09:00:00').toJSDate(),
    showDeadlineBanner: DateTime.fromISO('2023-08-01T09:00:00').toJSDate(),
    apply1Deadline: DateTime.fromISO('2023-09-07T18:00:00').toJSDate(),
    apply2Deadline: DateTime.fromISO('2023-09-21T18:00:00').toJSDate(),
    rejectByDefault: DateTime.fromISO('2023-09-29T23:59:59').toJSDate(),
    findCloses: DateTime.fromISO('2023-10-04T23:59:59').toJSDate(),
    ageCalculationDate: DateTime.fromISO('2023-08-31T23:59:59').toJSDate()
  }
}

const getCurrentCycle = () => {
  const currentCycleYear = now.year
  let cycle = {}

  for (const [year, data] of Object.entries(CYCLES)) {

    let nextYear = parseInt(year) + 1
    let fromYear = DateTime.fromJSDate(CYCLES[year].findOpens).year
    let toYear = fromYear

    if (CYCLES[nextYear]) {
      toYear = DateTime.fromJSDate(CYCLES[nextYear].findOpens).year
    } else {
      toYear = DateTime.fromJSDate(CYCLES[year].findCloses).year
    }

    if (currentCycleYear > fromYear && currentCycleYear <= toYear) {
      cycle = data
    }

  }

  return cycle
}

exports.CURRENT_CYCLE = getCurrentCycle()

const getPreviousCycle = () => {
  const previousCycleYear = now.year - 1
  let cycle = {}

  for (const [year, data] of Object.entries(CYCLES)) {

    let nextYear = parseInt(year) + 1
    let fromYear = DateTime.fromJSDate(CYCLES[year].findOpens).year
    let toYear = fromYear

    if (CYCLES[nextYear]) {
      toYear = DateTime.fromJSDate(CYCLES[nextYear].findOpens).year
    } else {
      toYear = DateTime.fromJSDate(CYCLES[year].findCloses).year
    }

    if (previousCycleYear > fromYear && previousCycleYear <= toYear) {
      cycle = data
    }

  }

  return cycle
}

exports.PREVIOUS_CYCLE = getPreviousCycle()

const getNextCycle = () => {
  const nextCycleYear = now.year + 1
  let cycle = {}

  for (const [year, data] of Object.entries(CYCLES)) {

    let nextYear = parseInt(year) + 1
    let fromYear = DateTime.fromJSDate(CYCLES[year].findOpens).year
    let toYear = fromYear

    if (CYCLES[nextYear]) {
      toYear = DateTime.fromJSDate(CYCLES[nextYear].findOpens).year
    } else {
      toYear = DateTime.fromJSDate(CYCLES[year].findCloses).year
    }

    if (nextCycleYear > fromYear && nextCycleYear <= toYear) {
      cycle = data
    }

  }

  return cycle
}

exports.NEXT_CYCLE = getNextCycle()

exports.getCycleOptions = (selectedItems) => {
  const currentCycleYear = now.year
  const previousCycleYear = now.year - 1
  const items = []

  for (const [year, data] of Object.entries(CYCLES)) {
    const item = {}
    let nextYear = parseInt(year) + 1
    let fromYear = DateTime.fromJSDate(CYCLES[year].findOpens).year
    let toYear = fromYear

    if (CYCLES[nextYear]) {
      toYear = DateTime.fromJSDate(CYCLES[nextYear].findOpens).year
    } else {
      toYear = DateTime.fromJSDate(CYCLES[year].findCloses).year
    }

    if ((currentCycleYear > fromYear && currentCycleYear <= toYear)
      || (previousCycleYear > fromYear && previousCycleYear <= toYear)) {
      item.text = data.shortDesc
      if(data.code == getCurrentCycle().code) {
        item.text += ' - current'
      }
      item.value = data.code
      item.id = data.code
      item.checked = (selectedItems && selectedItems.includes(data.code)) ? 'checked' : ''

      items.push(item)
    }
  }

  items.sort((a,b) => {
    return b.text.localeCompare(a.text)
  })

  return items
}

exports.getCycleLabel = (code) => {
  let label = code

  for (const [year, data] of Object.entries(CYCLES)) {
    if (data.code === code) {
      label = data.shortDesc

      if(data.code == getCurrentCycle().code) {
        label += ' - current'
      }

    }
  }



  return label
}
