const faker = require('faker')
faker.locale = 'en_GB'

module.exports = () => {

  let qualifications = []

  if(faker.helpers.randomize([true])) {
    qualifications.push({
      type: 'GCSE',
      subject: 'Resistant Materials',
      org: 'Marshfield High School',
      provenance: 'domestic',
      country: 'United Kingdom',
      grade: 'B',
      year: '2012'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'GCSE',
      subject: 'Graphics',
      org: 'Marshfield High School',
      provenance: 'domestic',
      country: 'France',
      grade: 'A',
      year: '2012'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'GCSE',
      subject: 'Religious Studies',
      org: 'Marshfield High School',
      provenance: 'domestic',
      country: 'United Kingdom',
      grade: 'A',
      year: '2012'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'AS level',
      subject: 'Maths',
      org: 'Marshfield High School',
      provenance: 'domestic',
      country: 'United Kingdom',
      grade: 'B',
      year: '2013'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'A level',
      subject: 'French',
      org: 'Marshfield High School',
      provenance: 'domestic',
      country: 'United Kingdom',
      grade: 'A',
      year: '2014'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'A level',
      subject: 'Religious Studies',
      org: 'Marshfield High School',
      provenance: 'domestic',
      country: 'United Kingdom',
      grade: 'A',
      year: '2014'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'A level',
      subject: 'English',
      org: 'Marshfield High School',
      provenance: 'domestic',
      country: 'United Kingdom',
      grade: 'A',
      year: '2014'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'ABRSM',
      subject: 'Music Theory',
      org: '',
      provenance: 'domestic',
      country: 'United Kingdom',
      grade: '5',
      year: '2010'
    })
  }

  if(faker.helpers.randomize([true, false])) {
    qualifications.push({
      type: 'ABRSM',
      subject: 'Piano (practical)',
      org: '',
      provenance: 'domestic',
      country: 'United Kingdom',
      grade: '8',
      year: '2015'
    })
  }

  return faker.helpers.randomize([qualifications,qualifications, qualifications, qualifications, qualifications, qualifications, null])

}
