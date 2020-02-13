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
