exports.getConditions = (application) => {
  let conditions = [];
  if(application['standard-conditions']) {
    application['standard-conditions'].map((item) => {
      return {
        text: item.description
      }
    }).forEach((item) => {
      conditions.push(item)
    });
  }
  if(application.conditions) {
    application.conditions.map((item) => {
      return {
        text: item.description
      }
    }).forEach((item) => {
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
