exports.getConditions = (application) => {
  let conditions = [];
  if(application.offer && application.offer.standardConditions) {
    application.offer.standardConditions.forEach((item) => {
      conditions.push(item)
    });
  }
  if(application.offer && application.offer.conditions) {
    application.offer.conditions.forEach((item) => {
      conditions.push(item)
    });
  }
  return conditions;
};

exports.getFlashMessage = (options) => {
  if(options.overrideValue) {
    return options.overrideValue;
  }

  if(options.flash && options.map) {
    for (let key in options.map){
      if(options.map.hasOwnProperty(key) && options.flash[0] == key) {
        return options.map[key];
      }
    }
  }
};

exports.getTimeline = (application) => {
  let timeline = [];

  if(application.submittedDate) {
    timeline.push({
      label: {
        text:  "Application submitted"
      },
      datetime: {
        timestamp: application.submittedDate,
        type: "datetime"
      },
      byline: {
        text: "candidate"
      }
    })
  }

  if(application.offer && application.offer.madeDate) {
    timeline.push({
      label: {
        text:  "Offer made"
      },
      datetime: {
        timestamp: application.offer.madeDate,
        type: "datetime"
      },
      byline: {
        text: "Alex Renato (Alliance Academy)"
      }
    })
  }

  if(application.offer && application.offer.declinedDate) {
    timeline.push({
      label: {
        text:  "Offer declined"
      },
      datetime: {
        timestamp: application.offer.declinedDate,
        type: "datetime"
      },
      byline: {
        text: "candidate"
      }
    })
  }

  if(application.rejectedDate) {
    timeline.push({
      label: {
        text:  "Application rejected"
      },
      datetime: {
        timestamp: application.rejectedDate,
        type: "datetime"
      },
      byline: {
        text: "Alex Renato (Alliance Academy)"
      }
    })
  }

  if(application.withdrawnDate) {
    timeline.push({
      label: {
        text:  "Application withdrawn"
      },
      datetime: {
        timestamp: application.withdrawnDate,
        type: "datetime"
      },
      byline: {
        text: "candidate"
      }
    })
  }

  if(application.offer && application.offer.acceptedDate) {
    timeline.push({
      label: {
        text:  "Offer accepted"
      },
      datetime: {
        timestamp: application.offer.acceptedDate,
        type: "datetime"
      },
      byline: {
        text: "candidate"
      }
    })
  }

  if(application.offer && application.offer.conditionsMetDate) {
    timeline.push({
      label: {
        text:  "Conditions met"
      },
      datetime: {
        timestamp: application.offer.conditionsMetDate,
        type: "datetime"
      },
      byline: {
        text: "Alex Renato (Alliance Academy)"
      }
    })
  }

  if(application.offer && application.offer.conditionsNotMetDate) {
    timeline.push({
      label: {
        text:  "Conditions not met"
      },
      datetime: {
        timestamp: application.offer.conditionsNotMetDate,
        type: "datetime"
      },
      byline: {
        text: "Alex Renato (Alliance Academy)"
      }
    })
  }

  if(application.offer && application.offer.withdrawnDate) {
    timeline.push({
      label: {
        text:  "Offer withdrawn"
      },
      datetime: {
        timestamp: application.offer.withdrawnDate,
        type: "datetime"
      },
      byline: {
        text: "Alex Renato (Alliance Academy)"
      }
    })
  }

  if(application.offer && application.offer.enrolledDate) {
    timeline.push({
      label: {
        text:  "Enrolled"
      },
      datetime: {
        timestamp: application.offer.enrolledDate,
        type: "datetime"
      },
      byline: {
        text: "Alex Renato (Alliance Academy)"
      }
    })
  }
  return timeline.reverse();
};
