const { DateTime } = require('luxon')
const _ = require('lodash')
const CycleHelper = require('./cycles')

exports.getMidCycleApplications = (applications) => {
  return applications.filter(app => {
    // Remove any applications that are deferred from the previous cycle
    if (app.status === 'Deferred' && app.cycle === CycleHelper.PREVIOUS_CYCLE.code) {
      return false;
    } else {
      return true;
    }
  })
  // .filter(app => {
  //   // Remove any applications that are pending conditions from the previous cycle
  //   // Because when we're mid cycle these should have pretty much been dealt with
  //   if (app.status === 'Conditions pending' && app.cycle === CycleHelper.PREVIOUS_CYCLE.code) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // })
}

exports.getStartOfCycleApplications = (applications) => {

  let deferredPast = applications
    .filter(app => {
      return app.cycle == CycleHelper.PREVIOUS_CYCLE.code
    })
    .filter(app => {
      return app.status == 'Deferred'
    })

  let acceptedPast = applications
    .filter(app => app.cycle == CycleHelper.PREVIOUS_CYCLE.code)
    .filter(app => (app.status == 'Conditions pending'))

  let other = applications
    .filter(app => app.status !== 'Received')
    .filter(app => app.status !== 'Interviewing')
    .filter(app => app.status !== 'Deferred')
    .filter(app => app.status !== 'Offered')
    .filter(app => app.status !== 'Conditions pending')
    .filter(app => app.status !== 'Recruited')

  return deferredPast
    .concat(acceptedPast)
    .concat(other);
}

