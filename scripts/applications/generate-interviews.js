const faker = require('faker');

const { EVENTS } = require('./constants');
const users = require('../../app/data/users.json');
const { randomNumber, randomDateTo, dateFrom, randomDate } = require('./helpers');

const { INTERVIEW_SET_UP, INTERVIEW_CANCELLED, INTERVIEW_CHANGED, OFFER_MADE } = EVENTS;
const lastUsersIndex = users.length - 1;
const { randomize } = faker.helpers;

function getAvailableIndexes(total, exclude){
  const indexes = [];

  for(let i = 0; i < total; i++ ){
    if(!exclude.includes(i)){
      indexes.push(i);
    }
  }

  return indexes;
}

exports.generateInterviews = (applications) => applications.map((application) => {

  if(application.events){
    const totalInterviews = application.events.reduce((total, ev) => ev.title === INTERVIEW_SET_UP ? total + 1 : total, 0);

    if( totalInterviews > 0 ){
      const interviews = [];
      const offerMade = application.events.find((ev) => ev.title === OFFER_MADE);
      const totalCancelled = application.events.reduce((total, ev) => ev.title === INTERVIEW_CANCELLED ? total + 1 : total, 0);
      const cancelledInterview = totalCancelled > 0 ? totalInterviews === 1 ? 0 : randomNumber(0, totalInterviews - 1) : null;
      const successfulInterview = offerMade ? totalInterviews === 1 ? 0 : randomize(getAvailableIndexes(totalInterviews, [cancelledInterview])) : null;

      for(let i = 0; i < totalInterviews; i++){
        const isSuccessful = i === successfulInterview;
        const interview = {
          id: faker.datatype.uuid(),
          details: randomize([faker.lorem.sentence(20), '']),
          location: randomize([[faker.address.streetAddress(), faker.address.city(), faker.address.zipCode()].join(', '), 'https://zoom.us/z1234/']),
          organisation: randomize(["The Royal Borough Teaching School Alliance", "Kingston University"]),
          date: isSuccessful ? dateFrom(offerMade.date, randomNumber(1,3)) : randomDateTo(randomDate(1,5), randomNumber(1, 10)),
        };

        interviews.push(interview);
      }

      let interviewIndex = 0;

      application.events = application.events.map((event) => {
        const user = users[randomNumber(0, lastUsersIndex)]

        switch(event.title){

          case INTERVIEW_SET_UP:

            return {
              ...event,
              user: [user.firstName, user.lastName].join(' '),
              meta: {
                interview: interviews[interviewIndex++]
              }
            };

          case INTERVIEW_CANCELLED:

            return {
              ...event,
              user: [user.firstName, user.lastName].join(' '),
              cancellationReason: 'We cannot interview you this week. We’ll call you to reschedule.',
              meta: {
                interview: interviews.find((ev, index) => index === cancelledInterview)
              }
            }

          case INTERVIEW_CHANGED:

            return {
              ...event,
              user: [user.firstName, user.lastName].join(' '),
              meta: {
                interview: interviews[randomize([0, totalInterviews - 1])],
              }
            }
        }

        return event;
      })

      application.interviews = interviews.reverse().filter((ev, index) => index !== cancelledInterview);
    }
  }

  return application;
});

