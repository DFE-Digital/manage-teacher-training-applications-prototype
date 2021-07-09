const OrgHelper = require('./helpers/organisation')
const relationships = []
const userOrg = OrgHelper.findOrg("Goldsmiths, University of London")

const partners = [
  'Academies Enterprise Trust: London',
  'Aspire Education Alliance',
  'Catholic Schools’ Partnership',
  'Ealing Teaching School Alliance',
  'Future Stars TSA',
  'Grey Court Teaching School Alliance',
  'Halstow Primary School',
  'Inspire Partnership',
  'John Donne Primary School',
  'North London New River Teaching Alliance',
  'Redriff Primary School',
  'South Thames Early Education Partnership & Goldsmiths University (STEEPtsa)',
  'TESLA, Bohunt School',
  'The Bridge London TSA',
  'The Royal Greenwich Teaching School Alliance',
  'United Teaching National SCITT',
  'Vita London',
  'Wandle Teaching School Alliance'
]

partners.forEach((partner, i) => {
  relationships.push({
    id: i,
    org1: userOrg,
    org1Permissions: {
      makeDecisions: true,
      viewSafeguardingInformation: true,
      viewDiversityInformation: true
    },
    org2: OrgHelper.findOrg(partner),
    org2Permissions: {
      makeDecisions: true,
      viewSafeguardingInformation: true,
      viewDiversityInformation: true
    }
  })
})

module.exports = relationships
