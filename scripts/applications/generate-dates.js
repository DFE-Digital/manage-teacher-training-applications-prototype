const { STATUS } = require('./constants');
const { randomDate, generateDatesFrom, randomDateFrom } = require('./helpers')

exports.generateDates = (skeleton) => skeleton.map((application) => {
    const { metadata, events, status } = application;

    if(events){
      application.date = randomDate(1, 15);

      if (status === STATUS.REJECTED && metadata.isAutomaticRejection) {
        const totalEvents = events.length;
        const dates = generateDatesFrom({ startDate: application.date, days: 40, totalDates: totalEvents });

        events.forEach((event, index) => {
          event.date = dates[index];
        });
      } else {
        events.forEach((event, index) => {
          const prevousDate = index === 0 ? application.date : events[index - 1].date;
          event.date = randomDateFrom(prevousDate, 1, 10);
        })
      }
    }

    return application;
  })
