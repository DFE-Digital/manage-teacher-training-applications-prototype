const faker = require('faker');

const { STATUS, EVENTS } = require('./constants');
const { randomDate, randomNumber } = require('./helpers');

const { randomize } = faker.helpers;
const FINAL_STATUS_VALUES = Object.values(STATUS).filter((value) => value !== STATUS.RECEIVED);
const {
  SUBMITTED,
  INTERVIEW_SET_UP,
  INTERVIEW_CHANGED,
  INTERVIEW_CANCELLED,
  OFFER_MADE,
  OFFER_CHANGED,
  OFFER_ACCEPTED,
  OFFER_DECLINED,
  OFFER_WITHDRAWN,
  OFFER_DEFERRED,
  OFFER_RECONFIRMED,
  CONDITIONS_MET,
  CONDITIONS_NOT_MET,
  REJECTED,
  FEEDBACK_SENT,
  WITHDRAWN,
  OFFER_CONDITIONS_UPDATED,
  NOTE_ADDED,
} = EVENTS;


function getNextEventList(event, currentEvents){
  switch(event){
    case INTERVIEW_SET_UP:
      const interviewsSetup = currentEvents.filter((ev) => ev.title === INTERVIEW_SET_UP);

      if(interviewsSetup.length === 2 || Math.random() < 0.8){ // allow a max of 2 INTERVIEW_SET_UP events, randomly reduce the chance of a second INTERVIEW_SET_UP event
        return [SUBMITTED];
      }

      return [SUBMITTED, INTERVIEW_SET_UP]

    case INTERVIEW_CHANGED:
      return [INTERVIEW_SET_UP]

    case INTERVIEW_CANCELLED:
      return[INTERVIEW_CHANGED, INTERVIEW_SET_UP]

    case OFFER_MADE:
      return [INTERVIEW_SET_UP, INTERVIEW_CHANGED, INTERVIEW_CANCELLED]

    case OFFER_CHANGED:
      return [OFFER_MADE]

    case REJECTED:
      return [SUBMITTED, INTERVIEW_CHANGED, INTERVIEW_SET_UP, INTERVIEW_CANCELLED]

    case WITHDRAWN:
      return [OFFER_MADE, OFFER_CHANGED]

    case FEEDBACK_SENT:
      return [REJECTED]

    case OFFER_CONDITIONS_UPDATED:
      return [OFFER_ACCEPTED, OFFER_CONDITIONS_UPDATED]

    case CONDITIONS_NOT_MET:
      return [OFFER_CONDITIONS_UPDATED, OFFER_ACCEPTED]

    case OFFER_ACCEPTED:
      return [OFFER_MADE, OFFER_CHANGED, NOTE_ADDED]

    case OFFER_WITHDRAWN:
      return [OFFER_MADE]

    case OFFER_DECLINED:
      return [OFFER_MADE, NOTE_ADDED]

    case OFFER_DEFERRED:
      return [OFFER_ACCEPTED, NOTE_ADDED]
  }
}

function generateEvents(currentEvents, event, metadata){

  currentEvents.push({
    title: event,
  });

  const nextEvents = getNextEventList(event, currentEvents);
  nextEvents && generateEvents(currentEvents, randomize(nextEvents), metadata);

  return currentEvents;
}

function generateLastEvent({ metadata, status }){
  const createRootEvent = (events) => generateEvents([], randomize(events), metadata);

  switch(status){
    case STATUS.REJECTED:
      return createRootEvent(metadata.isAutomaticRejection ? [
        REJECTED,
        FEEDBACK_SENT,
      ]: [REJECTED]);
    case STATUS.INTERVIEWING:
      return createRootEvent([
        INTERVIEW_SET_UP,
      ])
    case STATUS.APPLICATION_WITHDRAWN:
      return createRootEvent([WITHDRAWN]);

    case STATUS.DECLINED:
      return createRootEvent([OFFER_DECLINED])

    case STATUS.DEFERRED:
      return createRootEvent([OFFER_DEFERRED])

    case STATUS.OFFER_WITHDRAWN:
      return createRootEvent([OFFER_WITHDRAWN])
  }
}

function createMetadata(){
  return {
    isAutomaticRejection: faker.datatype.boolean(),
    isAutomaticDecline: faker.datatype.boolean(),
    numberOfConditions: randomNumber(0,2),
    numberOfStandardConditions: randomNumber(0,2)
  }
}

function addNotes(events){
  const numberOfEvents = events ? events.length : 0;
  const maxNotes = numberOfEvents < 4 ? 1 : numberOfEvents < 8 ? 2 : 3;
  const numberOfNotes = randomNumber(0,maxNotes);

  if(numberOfNotes === 0 || numberOfEvents <= 1){
    return events;
  }

  for(i = 0; i < numberOfNotes; i++){
    events.splice(randomNumber(1, events.length - 1), 0, { title: NOTE_ADDED } );
  }

  return events;
}

exports.generateSkeleton = () => FINAL_STATUS_VALUES.reduce((config, status) => {
  const totalStatusItems = randomNumber(2, 5);
  for(let i = 0; i < totalStatusItems; i++){

    const date = randomDate(1,100);
    const metadata = createMetadata(status);
    config.push({
      status,
      date,
      metadata,
      events: addNotes(generateLastEvent({status, metadata}))
    });
  }

  return config;
}, [])
