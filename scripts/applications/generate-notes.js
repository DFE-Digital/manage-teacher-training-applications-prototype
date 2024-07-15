const faker = require('@faker-js/faker').faker;

const { EVENTS } = require('./constants');

const { NOTE_ADDED } = EVENTS;

exports.generateNotes = (applications) => applications.map((application) => {
  const notes = [];

  if(application.events){
    application.events = application.events.map((event) => {

      if(event.title === NOTE_ADDED){

        const { date } = event;
        const newNote = {
          id: faker.string.uuid(),
          message: faker.helpers.arrayElement([
            'Waiting on candidate to send information about teaching skills aquired during their Saturday job.',
            'Waiting on academic tutor to confirm availability before scheduling an interview'
          ]),
          sender: faker.name.findName(),
          date,
        }

        notes.push(newNote);

        return {
          ...event,
          ...newNote
        };
      }

      return event;
    })
  }

  if(notes.length){
    application.notes = notes.reverse();
  }

  return application;
});
