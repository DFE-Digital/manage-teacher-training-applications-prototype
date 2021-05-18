const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'

const generateOrganisation = require('../app/data/generators/organisation')

const generateFakeOrganisation = (params = {}) => {
  return generateOrganisation(faker, params)
}

const generateFakeOrganisations = (count) => {
  const organisations = []

  let ab1 = generateFakeOrganisation({
    name: "Springbank SCITT",
    isAccreditedBody: true,
    domain: "springbank.org.uk"
  })

  let ab2 = generateFakeOrganisation({
    name: "Kingston University",
    isAccreditedBody: true,
    domain: "kingstonuniversity.org.uk"
  })

  let ab3 = generateFakeOrganisation({
    name: "Bedford University",
    isAccreditedBody: true,
    domain: "bedforduniversity.org.uk"
  })

  let ab4 = generateFakeOrganisation({
    name: "Gorse SCITT",
    isAccreditedBody: true,
    domain: "gorsescitt.org"
  })

  let ab5 = generateFakeOrganisation({
    name: "The University of Gloucestershire",
    isAccreditedBody: true,
    domain: "glos.ac.uk"
  })

  let ab6 = generateFakeOrganisation({
    name: "Construct SCITT",
    isAccreditedBody: true,
    domain: "constructscitt.org.uk"
  })

  let ab7 = generateFakeOrganisation({
    name: "Leeds University",
    isAccreditedBody: true,
    domain: "leedsuniversity.org.uk"
  })

  let tp1 = generateFakeOrganisation({
    name: "Wren Academy",
    isAccreditedBody: false,
    domain: "wrenacademy.co.uk"
  })

  let tp2 = generateFakeOrganisation({
    name: "The Royal Borough Teaching School Alliance",
    isAccreditedBody: false,
    domain: "royalboroughteachingschool.org"
  })

  let tp3 = generateFakeOrganisation({
    name: "WGSPschoolsdirect",
    isAccreditedBody: false,
    domain: "wgsp.education"
  })

  let tp4 = generateFakeOrganisation({
    name: "Odyssey Learning Alliance",
    isAccreditedBody: false,
    domain: "odysseyts.org"
  })

  let tp5 = generateFakeOrganisation({
    name: "The Cotswold Teaching School Partnership",
    isAccreditedBody: false,
    domain: "cotswoldteachingschoolpartnership.org.uk"
  })

  let tp6 = generateFakeOrganisation({
    name: "The Mead Academy Trust",
    isAccreditedBody: false,
    domain: "themeadtrust.org"
  })

  let tp7 = generateFakeOrganisation({
    name: "Cleeve School",
    isAccreditedBody: false,
    domain: "cleeveschool.net"
  })

  organisations.push(tp1)
  organisations.push(tp2)
  organisations.push(tp3)
  organisations.push(tp4)
  organisations.push(tp5)
  organisations.push(tp6)
  organisations.push(tp7)
  organisations.push(ab1)
  organisations.push(ab2)
  organisations.push(ab3)
  organisations.push(ab4)
  organisations.push(ab5)
  organisations.push(ab6)
  organisations.push(ab7)

  return organisations
}

const generateOrganisationsFile = (filePath, count) => {
  const organisations = generateFakeOrganisations(count)
  const filedata = JSON.stringify(organisations, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Organisation data generated: ${filePath}`)
    }
  )
}

generateOrganisationsFile(path.join(__dirname, '../app/data/organisations.json'), 5)
