const { generateSkeleton } = require('./generate-skeleton');
const { generateDates } = require('./generate-dates');
const { generateNotes } = require('./generate-notes');
const { generateInterviews } = require('./generate-interviews');

const args = process.argv.slice(2);

const skeleton = generateSkeleton();

if( args.includes('--skeleton')){
  console.log( JSON.stringify( skeleton, null, 2 ) );
}

const withDates = generateDates(skeleton);

if( args.includes('--dates') ){
  console.log( JSON.stringify( withDates, null, 2 ) );
}

const withNotes = generateNotes(withDates);

if( args.includes('--notes') ){
  console.log( JSON.stringify( withNotes, null, 2 ) );
}

const withInterviews = generateInterviews(withNotes);

if( !args.includes('--no-final-output') ){
  console.log( JSON.stringify( withInterviews, null, 2 ) );
}
