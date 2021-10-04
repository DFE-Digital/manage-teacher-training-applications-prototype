const path = require('path')
const fs = require('fs')
const { DateTime } = require('luxon')
const _ = require('lodash')
const System = require('./system')

const dataDirectoryPath = path.join(__dirname, '../statistics')

exports.getStatusData = (fileName) => {
  if (!fileName) {
    return null
  }
  const filePath = dataDirectoryPath + '/status/' + fileName + '.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  return data
}

exports.getAttritionData = (fileName) => {
  if (!fileName) {
    return null
  }
  const filePath = dataDirectoryPath + '/attrition/' + fileName + '.json'
  const rawData = fs.readFileSync(filePath)
  const data = JSON.parse(rawData)
  return data
}

exports.getEthnicityData = (applications) => {
  const ethnicGroups = [
    {
      name: 'Asian or Asian British',
      items: ['Bangladeshi', 'Chinese', 'Indian', 'Pakistani', 'Any other Asian background', 'Prefer not to say']
    },
    {
      name: 'Black, African, Black British or Caribbean',
      items: ['African', 'Caribbean', 'Any other Black, African or Caribbean background', 'Prefer not to say']
    },
    {
      name: 'Mixed or multiple ethnic groups',
      items: ['Asian and White', 'Black African and White', 'Black Caribbean and White', 'Any other Mixed or Multiple ethnic background', 'Prefer not to say']
    },
    {
      name: 'White',
      items: ['British, English, Northern Irish, Scottish, or Welsh', 'Irish', 'Irish Traveller or Gypsy', 'Any other White background', 'Prefer not to say']
    },
    {
      name: 'Another ethnic group',
      items: ['Arab', 'Any other ethnic group', 'Prefer not to say']
    },
    {
      name: 'Prefer not to say'
    }
  ]

  const status = 'Recruited'
  const data = []

  const apps = applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes')

  ethnicGroups.forEach((group, i) => {
    const parent = {}
    parent.title = group.name
    parent.counts = {}
    parent.items = []

    parent.counts.received = apps.filter(app => app.personalDetails.ethnicGroup === group.name).length
    parent.counts.recruited = apps.filter(app => app.personalDetails.ethnicGroup === group.name
        && app.status === status).length


    if (group.items !== undefined) {
      group.items.forEach((item, i) => {
        const child = {}
        child.title = item
        child.counts = {}

        child.counts.received = apps.filter(app => app.personalDetails.ethnicGroup === group.name
          && app.personalDetails.ethnicBackground === item).length

        child.counts.recruited = apps.filter(app => app.personalDetails.ethnicGroup === group.name
          && app.personalDetails.ethnicBackground === item
          && app.status === status).length

        parent.items.push(child)
      })
    }

    data.push(parent)
  })

  return data
}

exports.getSexData = (applications) => {
  const options = ['Female','Male','Intersex','Prefer not to say']
  const status = 'Recruited'
  const data = []

  const apps = applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes'
    && app.personalDetails.sex !== undefined)

  options.forEach((option, i) => {
    const item = {}
    item.title = option
    item.counts = {}
    item.counts.received = apps.filter(app => app.personalDetails.sex === option).length
    item.counts.recruited = apps.filter(app => app.personalDetails.sex === option
      && app.status === status).length
    data.push(item)
  })

  return data
}

exports.getDisabilityQuestionResponseCounts = (applications) => {
  const status = 'Recruited'
  const apps = applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes')

  return [
    {
      title: 'Yes',
      counts: {
        received: apps.filter(app => app.personalDetails.disabled === 'Yes').length,
        recruited: apps.filter(app => app.personalDetails.disabled === 'Yes'
          && app.status === status).length
      }
    },
    {
      title: 'No',
      counts: {
        received: apps.filter(app => app.personalDetails.disabled === 'No').length,
        recruited: apps.filter(app => app.personalDetails.disabled === 'No'
          && app.status === status).length
      }
    },
    {
      title: 'Prefer not to say',
      counts: {
        received: apps.filter(app => app.personalDetails.disabled === 'Prefer not to say').length,
        recruited: apps.filter(app => app.personalDetails.disabled === 'Prefer not to say'
          && app.status === status).length
      }
    }
  ]
}

exports.getDisabilityData = (applications) => {
  const options = [
    { title: 'Blind', description: 'Includes serious visual impairments which are not corrected by glasses' },
    { title: 'Deaf', description: 'Includes serious hearing impairments' },
    { title: 'Learning difficulty', description: 'For example, dyslexia, dyspraxia or ADHD' },
    { title: 'Long-standing illness', description: 'For example, cancer, HIV, diabetes, chronic heart disease or epilepsy' },
    { title: 'Mental health condition', description: 'For example, depression, schizophrenia or anxiety disorder' },
    { title: 'Physical disability or mobility issue', description: 'For example, impaired use of arms or legs, use of a wheelchair or crutches' },
    { title: 'Social or communication impairment', description: 'For example, Asperger’s or another autistic spectrum disorder' },
    { title: 'Other', description: '' }
  ]
  const status = 'Recruited'
  const data = []

  const apps = applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes')

  options.forEach((option, i) => {
    const item = {}
    item.title = option.title
    item.description = option.description
    item.counts = {}
    item.counts.received = apps.filter(app => app.personalDetails.disabilities !== undefined
      && app.personalDetails.disabilities.includes(option.title)).length
    item.counts.recruited = apps.filter(app => app.personalDetails.disabilities !== undefined
      && app.personalDetails.disabilities.includes(option.title)
      && app.status === status).length
    data.push(item)
  })

  // data.push({
  //   title: 'None',
  //   description: '',
  //   counts: {
  //     received: apps.filter(app => app.personalDetails.disabled !== undefined
  //       && app.personalDetails.disabled === 'No').length,
  //     recruited: apps.filter(app => app.personalDetails.disabled !== undefined
  //       && app.personalDetails.disabled === 'No'
  //       && app.status === status).length
  //   }
  // })

  return data
}

const getAgeCounts = (applications) => {
  const counts = []

  counts['18_less'] = 0
  counts['18_to_24'] = 0
  counts['25_to_34'] = 0
  counts['35_to_44'] = 0
  counts['45_to_54'] = 0
  counts['55_to_64'] = 0
  counts['65_over'] = 0

  applications.forEach((app, i) => {
    const dateOfBirth = DateTime.fromISO(app.personalDetails.dateOfBirth)
    const currentYear = DateTime.now().year
    const years = Math.round(DateTime.fromISO(currentYear + '-08-31').diff(dateOfBirth, 'years').toObject().years)

    if (years < 18) {
      counts['18_less'] += 1
    } else if (years >= 18 && years <= 24) {
      counts['18_to_24'] += 1
    } else if (years >= 25 && years <= 34) {
      counts['25_to_34'] += 1
    } else if (years >= 35 && years <= 44) {
      counts['35_to_44'] += 1
    } else if (years >= 45 && years <= 54) {
      counts['45_to_54'] += 1
    } else if (years >= 55 && years <= 64) {
      counts['55_to_64'] += 1
    } else if (years >= 65) {
      counts['65_over'] += 1
    }

  })

  return counts
}

// const getAgeCounts = (applications) => {
//   const counts = []
//
//   counts['21_under'] = 0
//   counts['22'] = 0
//   counts['23'] = 0
//   counts['24'] = 0
//   counts['25_to_29'] = 0
//   counts['30_to_34'] = 0
//   counts['35_to_39'] = 0
//   counts['40_to_44'] = 0
//   counts['45_to_49'] = 0
//   counts['50_to_54'] = 0
//   counts['55_to_59'] = 0
//   counts['60_to_64'] = 0
//   counts['65_over'] = 0
//
//   applications.forEach((app, i) => {
//     const dateOfBirth = DateTime.fromISO(app.personalDetails.dateOfBirth)
//     const currentYear = DateTime.now().year
//     const years = Math.round(DateTime.fromISO(currentYear + '-08-31').diff(dateOfBirth, 'years').toObject().years)
//
//     if (years <= 21) {
//       counts['21_under'] += 1
//     } else if (years == 22) {
//       counts['22'] += 1
//     } else if (years == 23) {
//       counts['23'] += 1
//     } else if (years == 24) {
//       counts['24'] += 1
//     } else if (years >= 25 && years <= 29) {
//       counts['25_to_29'] += 1
//     } else if (years >= 30 && years <= 34) {
//       counts['30_to_34'] += 1
//     } else if (years >= 35 && years <= 39) {
//       counts['35_to_39'] += 1
//     } else if (years >= 40 && years <= 44) {
//       counts['40_to_44'] += 1
//     } else if (years >= 45 && years <= 49) {
//       counts['45_to_49'] += 1
//     } else if (years >= 50 && years <= 54) {
//       counts['50_to_54'] += 1
//     } else if (years >= 55 && years <= 59) {
//       counts['55_to_59'] += 1
//     } else if (years >= 60 && years <= 64) {
//       counts['60_to_64'] += 1
//     } else if (years >= 65) {
//       counts['65_over'] += 1
//     }
//
//   })
//
//   return counts
// }

exports.getAgeData = (applications) => {
  const receivedCounts = getAgeCounts(applications)
  const recruitedCounts = getAgeCounts(applications.filter(app => app.status === 'Recruited'))

  return [
    { title: 'Under 18', counts: { received: receivedCounts['18_less'], recruited: recruitedCounts['18_less'] } },
    { title: '18 to 24', counts: { received: receivedCounts['18_to_24'], recruited: recruitedCounts['18_to_24'] } },
    { title: '25 to 34', counts: { received: receivedCounts['25_to_34'], recruited: recruitedCounts['25_to_34'] } },
    { title: '35 to 44', counts: { received: receivedCounts['35_to_44'], recruited: recruitedCounts['35_to_44'] } },
    { title: '45 to 54', counts: { received: receivedCounts['45_to_54'], recruited: recruitedCounts['45_to_54'] } },
    { title: '55 to 64', counts: { received: receivedCounts['55_to_64'], recruited: recruitedCounts['55_to_64'] } },
    { title: '65 and over', counts: { received: receivedCounts['65_over'], recruited: recruitedCounts['65_over'] } }
  ]
}

// exports.getAgeData = (applications) => {
//   const receivedCounts = getAgeCounts(applications)
//   const recruitedCounts = getAgeCounts(applications.filter(app => app.status === 'Recruited'))
//
//   return [
//     { title: '21 and under', counts: { received: receivedCounts['21_under'], recruited: recruitedCounts['21_under'] } },
//     { title: '22', counts: { received: receivedCounts['22'], recruited: recruitedCounts['22'] } },
//     { title: '23', counts: { received: receivedCounts['23'], recruited: recruitedCounts['23'] } },
//     { title: '24', counts: { received: receivedCounts['24'], recruited: recruitedCounts['24'] } },
//     { title: '25 to 29', counts: { received: receivedCounts['25_to_29'], recruited: recruitedCounts['25_to_29'] } },
//     { title: '30 to 34', counts: { received: receivedCounts['30_to_34'], recruited: recruitedCounts['30_to_34'] } },
//     { title: '35 to 39', counts: { received: receivedCounts['35_to_39'], recruited: recruitedCounts['35_to_39'] } },
//     { title: '40 to 44', counts: { received: receivedCounts['40_to_44'], recruited: recruitedCounts['40_to_44'] } },
//     { title: '45 to 49', counts: { received: receivedCounts['45_to_49'], recruited: recruitedCounts['45_to_49'] } },
//     { title: '50 to 54', counts: { received: receivedCounts['50_to_54'], recruited: recruitedCounts['50_to_54'] } },
//     { title: '55 to 59', counts: { received: receivedCounts['55_to_59'], recruited: recruitedCounts['55_to_59'] } },
//     { title: '60 to 64', counts: { received: receivedCounts['60_to_64'], recruited: recruitedCounts['60_to_64'] } },
//     { title: '65 and over', counts: { received: receivedCounts['65_over'], recruited: recruitedCounts['65_over'] } }
//   ]
// }

exports.getDiversityQuestionnaireResponseCounts = (applications) => {
  const status = 'Recruited'
  return [
    {
      title: 'Yes',
      counts: {
        received: applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes').length,
        recruited: applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'Yes'
          && app.status === status).length
      }
    },
    {
      title: 'No',
      counts: {
        received: applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'No').length,
        recruited: applications.filter(app => app.personalDetails.diversityQuestionnaireAnswered === 'No'
          && app.status === status).length
      }
    }
  ]
}
