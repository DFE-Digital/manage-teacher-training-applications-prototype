const faker = require('faker')
faker.locale = 'en_GB'

function buildReasons(params) {

  let o = {
    categories: []
  }

  if(params.qualifications) {
    o.categories.push('Qualifications')

    o['qualifications-reasons'] = [
      'No English GCSE grade 4 (C) or above, or accepted equivalent',
      'Degree does not meet course requirements',
      'Other'
    ]

    if(o['qualifications-reasons'].find(item => 'Degree does not meet course requirements')) {
      o['qualifications-reasons-degree-does-not-meet-course-requirements'] = faker.lorem.paragraph(1)
    }


    if(o['qualifications-reasons'].find(item => 'Other')) {
      o['qualifications-reasons-other'] = faker.lorem.paragraph(1)
    }

  }

  if(params.personalStatement) {
    o.categories.push('Personal statement')

    o['personal-statement-reasons'] = [
      'Quality of writing',
      'Other'
    ]

    if(o['personal-statement-reasons'].find(item => 'Quality of writing')) {
      o['personal-statement-reasons-quality-of-writing'] = faker.lorem.paragraph(1)
    }

    if(o['personal-statement-reasons'].find(item => 'Other')) {
      o['personal-statement-reasons-other'] = faker.lorem.paragraph(1)
    }

  }

  return o;

}

module.exports = () => {

  let qualifications = buildReasons({
    qualifications: true
  })

  let personalStatement = buildReasons({
    personalStatement: true
  })

  let all = buildReasons({
    qualifications: true,
    personalStatement: true
  })

  return faker.helpers.randomize([all, qualifications, personalStatement, null])


}
