const organisations = require('./organisations')
const applications = require('./applications')

// Filter out deferred applications
let filterApplications = {};

Object.values(applications).filter(app => {
  return app.status != "Deferred";
}).forEach(app => {
  filterApplications[app.id] = app;
});

module.exports = {
  applications: filterApplications,
  organisations: Object.values(organisations).filter(org => {
    return org.enabled;
  }),
  accreditedbodies: Object.values(organisations).filter(org => {
    return org.isaccreditedbody;
  }),

  settings: ["Only show deferred applications for current cycle"],
  cycle: "Current cycle (2020 to 2021)",
  sortby: 'most urgent',
  bare: process.env.BARE,
  flags: {
    interview_preferences: true
  }
}
