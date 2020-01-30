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
