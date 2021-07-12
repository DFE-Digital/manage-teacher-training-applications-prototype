const OrgHelper = require('./helpers/organisation')
const relationships = []
const userOrg = OrgHelper.findOrg("Bishop Grosseteste University")

const partners = [
  'Eastgate Academy',
  'Greenwood Academies Trust',
  'Hampton Hargate Primary School',
  'Humber Teaching School',
  'Positive Regard Teaching School Alliance',
  'Queen Elizabeth’s Grammar School, Horncastle',
  'Stamford ITE Cluster',
  'St Francis School',
  'St Mary’s School Direct Partnership Programme',
  'Tall Oaks Academy Trust',
  'Teach North: Nottinghamshire & North Lincolnshire',
  'The Bardney Church Of England And Methodist Primary School',
  'The Forge Trust',
  'The Nottingham Catholic Teaching School Alliance',
  'Trent Valley Teaching School Alliance'
]

partners.forEach((partner, i) => {
  relationships.push({
    id: i,
    org1: userOrg,
    org1Permissions: {
      makeDecisions: true,
      viewSafeguardingInformation: false,
      viewDiversityInformation: true
    },
    org2: OrgHelper.findOrg(partner),
    org2Permissions: {
      makeDecisions: true,
      viewSafeguardingInformation: false,
      viewDiversityInformation: false
    }
  })
})

module.exports = relationships
