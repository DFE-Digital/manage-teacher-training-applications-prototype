const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {

  let qualifications = []

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'ABRSM',
      subject: 'Piano (practical)',
      country: 'United Kingdom',
      grade: '8',
      year: '2015'
    })
  }

  qualifications.push({
    type: 'GCSE',
    subject: 'Resistant Materials',
    country: 'United Kingdom',
    grade: 'B',
    year: '2012'
  })

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'GCSE',
      subject: 'Graphics',
      country: 'France',
      grade: 'A',
      year: '2012'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'GCSE',
      subject: 'Religious Studies',
      country: 'United Kingdom',
      grade: 'A',
      year: '2012'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'AS level',
      subject: 'Maths',
      country: 'United Kingdom',
      grade: 'B',
      year: '2013'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'A level',
      subject: 'French',
      country: 'United Kingdom',
      grade: 'A',
      year: '2014'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'A level',
      subject: 'Religious Studies',
      country: 'United Kingdom',
      grade: 'A',
      year: '2014'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'A level',
      subject: 'English',
      country: 'United Kingdom',
      grade: 'A',
      year: '2014'
    })
  }

  qualifications.push({
    type: 'National certificate',
    subject: 'Not entered',
    provenance: 'international',
    country: 'France',
    grade: 'A',
    year: '2014'
  })

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'ABRSM',
      subject: 'Music Theory',
      country: 'United Kingdom',
      grade: '5',
      year: '2010'
    })
  }

  qualifications.push({
    type: 'High School Diploma',
    subject: 'Design',
    country: 'United States',
    grade: 'Not entered',
    year: '2013'
  })

  return faker.helpers.randomize([qualifications, qualifications, qualifications, qualifications, qualifications, qualifications, null])
}
