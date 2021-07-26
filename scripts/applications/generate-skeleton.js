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



function checkForThreshold(events, nextEvents){
  const noteEvents = events.filter((item) => item.title === NOTE_ADDED);

  if( noteEvents.length > 1 ){
    nextEvents = nextEvents.filter((item) => item.title !== NOTE_ADDED);
  }

  return nextEvents;
}

function getNextEventList(event){
  switch(event){
    case INTERVIEW_SET_UP:
      return [SUBMITTED, INTERVIEW_SET_UP, NOTE_ADDED]

    case INTERVIEW_CHANGED:
      return [INTERVIEW_SET_UP, NOTE_ADDED];

    case INTERVIEW_CANCELLED:
      return[ INTERVIEW_CHANGED, INTERVIEW_SET_UP, NOTE_ADDED];

    case OFFER_MADE:
      return [INTERVIEW_SET_UP, INTERVIEW_CHANGED, INTERVIEW_CANCELLED, NOTE_ADDED];

    case OFFER_CHANGED:
      return [OFFER_MADE, NOTE_ADDED]

    case REJECTED:
      return [SUBMITTED, INTERVIEW_CHANGED, INTERVIEW_SET_UP, INTERVIEW_CANCELLED, NOTE_ADDED]

    case WITHDRAWN:
      return [OFFER_MADE, OFFER_CHANGED]

    case FEEDBACK_SENT:
      return [REJECTED, NOTE_ADDED]

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

function generateEvents(currentEvents, event, previousEvent){
  const nextEvents = [];

  currentEvents.push({
    title: event,
  });

  switch(event){

    case NOTE_ADDED:
      if(previousEvent){
        // Get previous event to work out next event, so the note is effectivly skipped
        const nextEventsList = getNextEventList(previousEvent).filter((item) => item !== NOTE_ADDED);
        nextEventsList && nextEvents.push(...nextEventsList);
      } else {
        nextEvents.push(SUBMITTED);
      }
      break;

    default:
      const nextEventsList = getNextEventList(event);
      if( nextEventsList ){
        nextEvents.push(...nextEventsList);
      }
      break;
  }

  const eventsToGenerate = checkForThreshold(currentEvents, nextEvents);
  eventsToGenerate.length && generateEvents(currentEvents, randomize(eventsToGenerate), event);

  return currentEvents;
}

function generateLastEvent({ metadata, status }){
  const createRootEvent = (events) => generateEvents([], randomize(events));

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
    maxNotes: randomNumber(0,3),
    numberOfConditions: randomNumber(0,2),
    numberOfStandardConditions: randomNumber(0,2)
  }
}

exports.generateSkeleton = () => FINAL_STATUS_VALUES.reduce((config, status) => {
  const totalStatusItems = randomNumber(1, 3);
  for(let i = 0; i < totalStatusItems; i++){

    const date = randomDate(1,100);
    const metadata = createMetadata(status);
    config.push({
      status,
      date,
      metadata,
      events: generateLastEvent({status, metadata})
    });
  }
  return config;
}, [])
