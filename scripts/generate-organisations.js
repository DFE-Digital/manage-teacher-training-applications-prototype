const fs = require('fs')
const path = require('path')
const faker = require('faker')
faker.locale = 'en_GB'

const generateOrganisation = require('../app/data/generators/organisation')

const universities = require('../app/data/seed/universities')

const generateFakeOrganisation = (params = {}) => {
  return generateOrganisation(params)
}

const generateFakeOrganisations = (count) => {
  const organisations = []

  // ---------------------------------------------------------------------------
  // Higher education instutions / universities
  // ---------------------------------------------------------------------------

  universities.forEach((university, i) => {
    organisations.push(generateFakeOrganisation({
      name: university.name,
      isAccreditedBody: university.isAccreditedBody,
      domain: university.domain
    }))
  })

  // ---------------------------------------------------------------------------
  // Others
  // ---------------------------------------------------------------------------
  organisations.push(generateFakeOrganisation({
    name: "The Compton School",
    isAccreditedBody: false,
    domain: "thecompton.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Beal High School (NELTA)",
    isAccreditedBody: false,
    domain: "bealhighschool.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Waltham Forest Teaching School Alliance",
    isAccreditedBody: false,
    domain: "willowfield-school.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Kingston School Direct",
    isAccreditedBody: false,
    domain: "coombe.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Ashlawn Teaching School",
    isAccreditedBody: false,
    domain: "ashlawn.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Beauchamp Lionheart Training Partnership",
    isAccreditedBody: false,
    domain: "beauchampteach.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "President Kennedy Teaching School Alliance",
    isAccreditedBody: false,
    domain: "@pks.coventry.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Southam Teaching Alliance",
    isAccreditedBody: false,
    domain: "stowevalley.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Springbank SCITT",
    isAccreditedBody: true,
    domain: "springbank.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Gorse SCITT",
    isAccreditedBody: true,
    domain: "gorsescitt.org"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Construct SCITT",
    isAccreditedBody: true,
    domain: "constructscitt.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Leeds Trinity University",
    isAccreditedBody: true,
    domain: "leedstrinity.ac.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Wren Academy",
    isAccreditedBody: false,
    domain: "wrenacademy.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Royal Borough Teaching School Alliance",
    isAccreditedBody: false,
    domain: "royalboroughteachingschool.org"
  }))
  organisations.push(generateFakeOrganisation({
    name: "WGSPschoolsdirect",
    isAccreditedBody: false,
    domain: "wgsp.education"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Odyssey Learning Alliance",
    isAccreditedBody: false,
    domain: "odysseyts.org"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Cotswold Teaching School Partnership",
    isAccreditedBody: false,
    domain: "cotswoldteachingschoolpartnership.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "The Mead Academy Trust",
    isAccreditedBody: false,
    domain: "themeadtrust.org"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Cleeve School",
    isAccreditedBody: false,
    domain: "cleeveschool.net"
  }))
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
  organisations.push(generateFakeOrganisation({
    name: "South West Teacher Training",
    isAccreditedBody: true,
    domain: "westexe.devon.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Exeter Consortium",
    isAccreditedBody: false,
    domain: "exeterconsortium.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Essex Teacher Training",
    isAccreditedBody: true,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Academies Enterprise Trust: Eastern",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Eastwood Park Academy Trust",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Endeavour TSA",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Harlow Teacher Training Partnership",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Merrylands Teacher Training Partnership",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "ORTU Trust (Gable Hall)",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Paradigm Trust: Old Ford Primary Academy and Ipswich Academy",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Romford Teacher Training Partnership (formerly Parklands Infants)",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "St Thomas More’s Catholic Primary School, Colchester",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Woodside Academy",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Zengage Teacher Training Essex",
    isAccreditedBody: false,
    domain: "essexteachertraining.co.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Tes Institute",
    isAccreditedBody: true,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Plume Community Teaching Partnership",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Teach in Kent",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Havering Train2Teach",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "London East Teacher Training Alliance",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Benfleet Teaching School Alliance",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "TTSA (St. Clere’s)",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Essex School Direct",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Haberdashers’ Aske’s Federation",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Teach London South East",
    isAccreditedBody: false,
    domain: "tes.com"
  }))
  // Thomas Estley Community College and partners
  organisations.push(generateFakeOrganisation({
    name: "Thomas Estley Community College",
    isAccreditedBody: false,
    domain: "thomasestley.org.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Leicestershire Secondary SCITT",
    isAccreditedBody: true,
    domain: "thomasestley.org.uk"
  }))
  // Riverly Primary School
  organisations.push(generateFakeOrganisation({
    name: "Riverley Primary School",
    isAccreditedBody: false,
    domain: "griffinschoolstrust.org."
  }))
  // Teach Kent and Sussex SCITT
  organisations.push(generateFakeOrganisation({
    name: "Teach Kent and Sussex SCITT",
    isAccreditedBody: true,
    domain: "bennett.kent.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Bennett Memorial Diocesan School",
    isAccreditedBody: true,
    domain: "bennett.kent.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Claremont Primary School",
    isAccreditedBody: true,
    domain: "bennett.kent.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Eastbourne Area School Direct Alliance",
    isAccreditedBody: true,
    domain: "bennett.kent.sch.uk"
  }))
  organisations.push(generateFakeOrganisation({
    name: "Wealden Partnership",
    isAccreditedBody: true,
    domain: "bennett.kent.sch.uk"
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
