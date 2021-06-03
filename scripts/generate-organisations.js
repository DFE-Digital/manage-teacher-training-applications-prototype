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
    name: "University of Bedfordshire",
    isAccreditedBody: true,
    domain: "beds.ac.uk"
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
    name: "Leeds Trinity University",
    isAccreditedBody: true,
    domain: "leedstrinity.ac.uk"
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
  organisations.push(generateFakeOrganisation({
    name: "Co-op Academies Trust School Direct - Primary",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Diocese of Leeds BKCAT Alliance",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Dixons Multi-Academy Trust (DMAT)",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "East One Partnership",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Ilkley All Saints’ Teacher Training Partnership",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Nicholas Postgate Catholic Academy Trust",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "North Star",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Rodillian",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "St Anthony’s Primary Learning Partnership",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "St Bede’s Deanery Teaching Alliance",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "St. Mary’s TSA",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Beckfoot School Direct Partnership",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Catholic Schools Partnership Teaching School Alliance",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Yorkshire Rose Teaching Alliance",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Waterton Academy Trust",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "White Rose Alliance",
    isAccreditedBody: false,
    domain: "example.net"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Yorkshire Schools Alliance",
    isAccreditedBody: false,
    domain: "example.net"
  }))

  organisations.push(generateFakeOrganisation({
    name: "Goldsmiths, University of London",
    isAccreditedBody: true,
    domain: "gold.ac.uk"
  }))

  organisations.push(generateFakeOrganisation({
    name: "Coventry University",
    isAccreditedBody: true,
    domain: "coventry.ac.uk"
  }))

  organisations.push(generateFakeOrganisation({
    name: "Academies Enterprise Trust: London",
    isAccreditedBody: false,
    domain: "academiesenterprisetrust.org"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Aspire Education Alliance",
    isAccreditedBody: false,
    domain: "warrenjunior.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Catholic Schools’ Partnership",
    isAccreditedBody: false,
    domain: "catholicteachingalliance.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Ealing Teaching School Alliance",
    isAccreditedBody: false,
    domain: "teachwestlondon.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Future Stars TSA",
    isAccreditedBody: false,
    domain: "queensbridge.hackney.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Grey Court Teaching School Alliance",
    isAccreditedBody: false,
    domain: "greycourt.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Halstow Primary School",
    isAccreditedBody: false,
    domain: "compass-partnership.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Inspire Partnership",
    isAccreditedBody: false,
    domain: "inspirepartnership.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "John Donne Primary School",
    isAccreditedBody: false,
    domain: "jdacademy.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "North London New River Teaching Alliance",
    isAccreditedBody: false,
    domain: "nrta.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Redriff Primary School",
    isAccreditedBody: false,
    domain: "redriff.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "South Thames Early Education Partnership & Goldsmiths University (STEEPtsa)",
    isAccreditedBody: false,
    domain: "gold.ac.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "TESLA, Bohunt School",
    isAccreditedBody: false,
    domain: "bohunt.hants.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Bridge London TSA",
    isAccreditedBody: false,
    domain: "thebridgelondon.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Royal Greenwich Teaching School Alliance",
    isAccreditedBody: false,
    domain: "rgtsa.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "United Teaching National SCITT",
    isAccreditedBody: false,
    domain: "unitedlearning.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Vita London",
    isAccreditedBody: false,
    domain: "st-marys-coe.waltham.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Wandle Teaching School Alliance",
    isAccreditedBody: false,
    domain: "wandletsa.com"
  }))

  organisations.push(generateFakeOrganisation({
    name: "Greenwood Academies Trust",
    isAccreditedBody: false,
    domain: "greenwoodacademies.org"
  }))

  organisations.push(generateFakeOrganisation({
    name: "Greenwood Academies Trust",
    isAccreditedBody: false,
    domain: "greenwoodacademies.org"
  }))

  organisations.push(generateFakeOrganisation({
    name: "The Lion Alliance",
    isAccreditedBody: false,
    domain: "finhampark.co.uk"
  }))

  organisations.push(generateFakeOrganisation({
    name: "The Millais Alliance",
    isAccreditedBody: false,
    domain: "millais.org.uk"
  }))

  organisations.push(generateFakeOrganisation({
    name: "Active Teacher Training",
    isAccreditedBody: false,
    domain: "cromwellcc.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "ATT Partnership",
    isAccreditedBody: false,
    domain: "mildenhall.attrust.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Biddenham Upper School and Sports College",
    isAccreditedBody: false,
    domain: "biddenham.beds.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Castle Newnham Partnership",
    isAccreditedBody: false,
    domain: "castlenewnham.school"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Fenland Teaching School Alliance",
    isAccreditedBody: false,
    domain: "lionelwalden.cambs.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Goldington Academy",
    isAccreditedBody: false,
    domain: "goldington.beds.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Luton Futures",
    isAccreditedBody: false,
    domain: "lutonfutures.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Middlefield Primary Academy",
    isAccreditedBody: false,
    domain: "diamondtsa.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Nene and Ramnoth",
    isAccreditedBody: false,
    domain: "nenerjs.org"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Redborne Upper School And Community College",
    isAccreditedBody: false,
    domain: "redborne.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Thorndown Primary School",
    isAccreditedBody: false,
    domain: "thorndown.cambs.sch.uk"
  }))

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
