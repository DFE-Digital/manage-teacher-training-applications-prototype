const fs = require('fs')
const path = require('path')
const { fakerEN_GB: faker } = require('@faker-js/faker')

const generateOrganisation = require('../app/data/generators/organisation')

const universities = require('../app/data/seed/universities')

const generateFakeOrganisation = (params = {}) => {
  return generateOrganisation(params)
}

const generateFakeOrganisations = (count) => {
  const organisations = []
//
//   // ---------------------------------------------------------------------------
//   // Higher education instutions / universities
//   // ---------------------------------------------------------------------------
//
//   universities.forEach((university, i) => {
//     organisations.push(generateFakeOrganisation({
//       name: university.name,
//       isAccreditedBody: university.isAccreditedBody,
//       domain: university.domain
//     }))
//   })
//
//   // ---------------------------------------------------------------------------
//   // Used for prototype default
//   // ---------------------------------------------------------------------------
//   organisations.push(generateFakeOrganisation({
//     name: "Wren Academy",
//     isAccreditedBody: false,
//     domain: "wrenacademy.co.uk"
//   }))
//
//   // ---------------------------------------------------------------------------
//   // Others
//   // ---------------------------------------------------------------------------
//
//   organisations.push(generateFakeOrganisation({
//     name: "The University of Warwick",
//     isAccreditedBody: true,
//     domain: "warwick.ac.uk",
//     locations: [{
//       name: 'Main site',
//       address: {
//         address1: '123 Main Street',
//         // address2: '',
//         // address3: '',
//         town: 'Some town',
//         postcode: 'AB1 2CD'
//       }
//     }]
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Oxford University",
//     isAccreditedBody: false,
//     domain: "education.ox.ac.uk",
//     locations: [{
//       name: 'Main site',
//       address: {
//         address1: '123 Main Street',
//         // address2: '',
//         // address3: '',
//         town: 'Some town',
//         postcode: 'AB1 2CD'
//       }
//     }]
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Goldsmiths, University of London",
//     isAccreditedBody: true,
//     domain: "@gold.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "North Wiltshire SCITT",
//     isAccreditedBody: true,
//     domain: "@nwscitt.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Blue Kite Academy Trust",
//     isAccreditedBody: false,
//     domain: "@bkat.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Pickwick Learning",
//     isAccreditedBody: false,
//     domain: "@pl.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Cambridge Training School Network, CTSN SCITT",
//     isAccreditedBody: true,
//     domain: "@camteach.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "The Lark Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "@lark.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Barrow CEVC Primary School",
//     isAccreditedBody: false,
//     domain: "@barrow.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "The Cambridge Training School Network Partnership, CTSN",
//     isAccreditedBody: false,
//     domain: "@ctsn.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Anglian Gateway Teaching Schools Alliance",
//     isAccreditedBody: false,
//     domain: "@anglian.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Morris Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "@morris.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Cambridge & Suffolk Schools Alliance (CASSA)",
//     isAccreditedBody: false,
//     domain: "@cands.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Catalyst Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "@ctsa.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Unity Teaching School Hub",
//     isAccreditedBody: false,
//     domain: "@utsh.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Saffron Walden County High School",
//     isAccreditedBody: false,
//     domain: "@swchs.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Yorkshire and Humber Teacher Training",
//     isAccreditedBody: true,
//     domain: "yhtt.co.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Active Teacher Training",
//     isAccreditedBody: false,
//     domain: "cromwellcc.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "National Online Teacher Training",
//     isAccreditedBody: false,
//     domain: "nott.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Yorkshire and Humber School Direct",
//     isAccreditedBody: false,
//     domain: "yahsd.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Ilkley All Saints' Teacher Training Partnership",
//     isAccreditedBody: false,
//     domain: "iasttp.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "University of Sussex",
//     isAccreditedBody: true,
//     domain: "universityofsussex.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "University of Chichester",
//     isAccreditedBody: true,
//     domain: "universityofchichester.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Coventry University",
//     isAccreditedBody: true,
//     domain: "conventryuniversity.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "University of Brighton",
//     isAccreditedBody: true,
//     domain: "universityofbrighton.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Partnership London SCITT",
//     isAccreditedBody: true,
//     domain: "sydneyrussellschool.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Sydney Russell Teacher Training Centre",
//     isAccreditedBody: false,
//     domain: "sydneyrussellschool.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "St Angela's Teacher Training Centre",
//     isAccreditedBody: false,
//     domain: "sydneyrussellschool.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "St. Edward’s Teacher Training Partnership",
//     isAccreditedBody: false,
//     domain: "sydneyrussellschool.com"
//   }))
//
//
//   organisations.push(generateFakeOrganisation({
//     name: "Hillingdon SCITT",
//     isAccreditedBody: true,
//     domain: "bishopramsey.school"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Bishop Ramsey CE School",
//     isAccreditedBody: false,
//     domain: "bishopramsey.school"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Castlebar School",
//     isAccreditedBody: false,
//     domain: "bishopramsey.school"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Teach West London Teaching School Hub",
//     isAccreditedBody: false,
//     domain: "bishopramsey.school"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Harrow First",
//     isAccreditedBody: false,
//     domain: "bishopramsey.school"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Cranford Community College",
//     isAccreditedBody: false,
//     domain: "bishopramsey.school"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Woodfield School",
//     isAccreditedBody: false,
//     domain: "bishopramsey.school"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Hillingdon Primary School (The Elliot Foundation Teaching School)",
//     isAccreditedBody: false,
//     domain: "bishopramsey.school"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Astra SCITT",
//     isAccreditedBody: true,
//     domain: "astra-alliance.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Astra Marlow Hub",
//     isAccreditedBody: false,
//     domain: "astra-marlow.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Astra Amersham Hub",
//     isAccreditedBody: false,
//     domain: "astra-amersham.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "Astra Aylesbury Hub",
//     isAccreditedBody: false,
//     domain: "astra-aylesbury.com"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "The Compton School",
//     isAccreditedBody: false,
//     domain: "thecompton.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Beal High School (NELTA)",
//     isAccreditedBody: false,
//     domain: "bealhighschool.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Waltham Forest Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "willowfield-school.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Kingston School Direct",
//     isAccreditedBody: false,
//     domain: "coombe.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Ashlawn Teaching School",
//     isAccreditedBody: false,
//     domain: "ashlawn.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Beauchamp Lionheart Training Partnership",
//     isAccreditedBody: false,
//     domain: "beauchampteach.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "President Kennedy Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "@pks.coventry.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Southam Teaching Alliance",
//     isAccreditedBody: false,
//     domain: "stowevalley.com",
//     locations: [{
//       name: 'Main site',
//       address: {
//         address1: '123 Main Street',
//         // address2: '',
//         // address3: '',
//         town: 'Some town',
//         postcode: 'AB1 2CD'
//       }
//     }, {
//       name: 'Queen’s campus',
//       address: {
//         address1: 'Amory Building',
//         address2: 'Rennes Drive',
//         // address3: '',
//         town: 'Big City',
//         postcode: 'SW1A 4AA'
//       }
//     }]
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Springbank SCITT",
//     isAccreditedBody: true,
//     domain: "springbank.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Gorse SCITT",
//     isAccreditedBody: true,
//     domain: "gorsescitt.org"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Construct SCITT",
//     isAccreditedBody: true,
//     domain: "constructscitt.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Royal Borough Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "royalboroughteachingschool.org"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "WGSPschoolsdirect",
//     isAccreditedBody: false,
//     domain: "wgsp.education"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Odyssey Learning Alliance",
//     isAccreditedBody: false,
//     domain: "odysseyts.org"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Cotswold Teaching School Partnership",
//     isAccreditedBody: false,
//     domain: "cotswoldteachingschoolpartnership.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Mead Academy Trust",
//     isAccreditedBody: false,
//     domain: "themeadtrust.org"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Cleeve School",
//     isAccreditedBody: false,
//     domain: "cleeveschool.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Co-op Academies Trust School Direct - Primary",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Diocese of Leeds BKCAT Alliance",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Dixons Multi-Academy Trust (DMAT)",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "East One Partnership",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Ilkley All Saints’ Teacher Training Partnership",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Nicholas Postgate Catholic Academy Trust",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "North Star",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Rodillian",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "St Anthony’s Primary Learning Partnership",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "St Bede’s Deanery Teaching Alliance",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "St. Mary’s TSA",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Beckfoot School Direct Partnership",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Catholic Schools Partnership Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Yorkshire Rose Teaching Alliance",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Waterton Academy Trust",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "White Rose Alliance",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Yorkshire Schools Alliance",
//     isAccreditedBody: false,
//     domain: "example.net"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Academies Enterprise Trust: London",
//     isAccreditedBody: false,
//     domain: "academiesenterprisetrust.org"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Aspire Education Alliance",
//     isAccreditedBody: false,
//     domain: "warrenjunior.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Catholic Schools’ Partnership",
//     isAccreditedBody: false,
//     domain: "catholicteachingalliance.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Ealing Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "teachwestlondon.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Future Stars TSA",
//     isAccreditedBody: false,
//     domain: "queensbridge.hackney.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Grey Court Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "greycourt.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Halstow Primary School",
//     isAccreditedBody: false,
//     domain: "compass-partnership.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Inspire Partnership",
//     isAccreditedBody: false,
//     domain: "inspirepartnership.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "John Donne Primary School",
//     isAccreditedBody: false,
//     domain: "jdacademy.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "North London New River Teaching Alliance",
//     isAccreditedBody: false,
//     domain: "nrta.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Redriff Primary School",
//     isAccreditedBody: false,
//     domain: "redriff.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "South Thames Early Education Partnership & Goldsmiths University (STEEPtsa)",
//     isAccreditedBody: false,
//     domain: "gold.ac.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "TESLA, Bohunt School",
//     isAccreditedBody: false,
//     domain: "bohunt.hants.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Bridge London TSA",
//     isAccreditedBody: false,
//     domain: "thebridgelondon.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Royal Greenwich Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "rgtsa.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "United Teaching National SCITT",
//     isAccreditedBody: false,
//     domain: "unitedlearning.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Vita London",
//     isAccreditedBody: false,
//     domain: "st-marys-coe.waltham.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Wandle Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "wandletsa.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Greenwood Academies Trust",
//     isAccreditedBody: false,
//     domain: "greenwoodacademies.org"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Lion Alliance",
//     isAccreditedBody: false,
//     domain: "finhampark.co.uk",
//     locations: [{
//       name: 'Limbrick Wood Primary School',
//       address: {
//         address1: 'Bush Close',
//         // address2: '',
//         // address3: '',
//         town: 'Coventry',
//         postcode: 'CV4 9QT'
//       }
//     }, {
//       name: 'Mount Nod Primary School campus',
//       address: {
//         address1: 'Greenleaf Close',
//         address2: 'Rennes Drive',
//         // address3: '',
//         town: 'Coventry',
//         postcode: 'CV5 7BG'
//       }
//     }]
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Millais Alliance",
//     isAccreditedBody: false,
//     domain: "millais.org.uk"
//   }))
//
//   organisations.push(generateFakeOrganisation({
//     name: "ATT Partnership",
//     isAccreditedBody: false,
//     domain: "mildenhall.attrust.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Biddenham Upper School and Sports College",
//     isAccreditedBody: false,
//     domain: "biddenham.beds.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Castle Newnham Partnership",
//     isAccreditedBody: false,
//     domain: "castlenewnham.school"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Fenland Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "lionelwalden.cambs.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Goldington Academy",
//     isAccreditedBody: false,
//     domain: "goldington.beds.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Luton Futures",
//     isAccreditedBody: false,
//     domain: "lutonfutures.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Middlefield Primary Academy",
//     isAccreditedBody: false,
//     domain: "diamondtsa.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Nene and Ramnoth",
//     isAccreditedBody: false,
//     domain: "nenerjs.org"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Redborne Upper School And Community College",
//     isAccreditedBody: false,
//     domain: "redborne.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Thorndown Primary School",
//     isAccreditedBody: false,
//     domain: "thorndown.cambs.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "South West Teacher Training",
//     isAccreditedBody: true,
//     domain: "westexe.devon.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Exeter Consortium",
//     isAccreditedBody: false,
//     domain: "exeterconsortium.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Essex Teacher Training",
//     isAccreditedBody: true,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Academies Enterprise Trust: Eastern",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Eastwood Park Academy Trust",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Endeavour TSA",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Harlow Teacher Training Partnership",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Merrylands Teacher Training Partnership",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "ORTU Trust (Gable Hall)",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Paradigm Trust: Old Ford Primary Academy and Ipswich Academy",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Romford Teacher Training Partnership (formerly Parklands Infants)",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "St Thomas More’s Catholic Primary School, Colchester",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Woodside Academy",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Zengage Teacher Training Essex",
//     isAccreditedBody: false,
//     domain: "essexteachertraining.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Tes Institute",
//     isAccreditedBody: true,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Plume Community Teaching Partnership",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Teach in Kent",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Havering Train2Teach",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "London East Teacher Training Alliance",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Benfleet Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "TTSA (St. Clere’s)",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Essex School Direct",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Haberdashers’ Aske’s Federation",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Teach London South East",
//     isAccreditedBody: false,
//     domain: "tes.com"
//   }))
//   // Thomas Estley Community College and partners
//   organisations.push(generateFakeOrganisation({
//     name: "Thomas Estley Community College",
//     isAccreditedBody: false,
//     domain: "thomasestley.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Leicestershire Secondary SCITT",
//     isAccreditedBody: true,
//     domain: "thomasestley.org.uk"
//   }))
//   // Riverly Primary School
//   organisations.push(generateFakeOrganisation({
//     name: "Riverley Primary School",
//     isAccreditedBody: false,
//     domain: "griffinschoolstrust.org."
//   }))
//   // Teach Kent and Sussex SCITT
//   organisations.push(generateFakeOrganisation({
//     name: "Teach Kent and Sussex SCITT",
//     isAccreditedBody: true,
//     domain: "bennett.kent.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Bennett Memorial Diocesan School",
//     isAccreditedBody: true,
//     domain: "bennett.kent.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Claremont Primary School",
//     isAccreditedBody: true,
//     domain: "bennett.kent.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Eastbourne Area School Direct Alliance",
//     isAccreditedBody: true,
//     domain: "bennett.kent.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Wealden Partnership",
//     isAccreditedBody: true,
//     domain: "bennett.kent.sch.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Chiltern Training Group",
//     isAccreditedBody: true,
//     domain: "ctg.ac.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Chiltern Training Group part of the Chiltern Learning trust",
//     isAccreditedBody: false,
//     domain: "ctg.ac.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Acorn Teaching School",
//     isAccreditedBody: false,
//     domain: "ctg.ac.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Eastgate Academy",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Hampton Hargate Primary School",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Humber Teaching School",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Positive Regard Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Queen Elizabeth’s Grammar School, Horncastle",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Stamford ITE Cluster",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "St Francis School",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "St Mary’s School Direct Partnership Programme",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Tall Oaks Academy Trust",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Teach North: Nottinghamshire & North Lincolnshire",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Bardney Church Of England And Methodist Primary School",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Forge Trust",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The Nottingham Catholic Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Trent Valley Teaching School Alliance",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Mercia Learning Alliance",
//     isAccreditedBody: false,
//     domain: "example.com"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Ignite Teaching School",
//     isAccreditedBody: false,
//     domain: "ormistonventureacademy.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The OAKS Norfolk",
//     isAccreditedBody: false,
//     domain: "theoaks.org.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "The OAKS (Ormiston and Keele SCITT)",
//     isAccreditedBody: true,
//     domain: "ormistonventureacademy.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Suffolk and Norfolk Secondary SCITT",
//     isAccreditedBody: true,
//     domain: "ormistonventureacademy.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Suffolk and Norfolk Primary SCITT",
//     isAccreditedBody: true,
//     domain: "ormistonventureacademy.co.uk"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "GLF School’s Teacher Training",
//     isAccreditedBody: true,
//     domain: "glfschools.org"
//   }))
//   organisations.push(generateFakeOrganisation({
//     name: "Glyn School",
//     isAccreditedBody: false,
//     domain: "glfschools.org"
//   }))


  organisations.push(generateFakeOrganisation({
    name: "Birmingham SCITT",
    isAccreditedBody: true,
    domain: "birminghamscitt.org.uk"
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
