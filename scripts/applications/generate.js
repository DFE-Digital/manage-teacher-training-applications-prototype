const { generateSkeleton } = require('./generate-skeleton');
const { generateDates } = require('./generate-dates');

const args = process.argv.slice(2);

const skeleton = generateSkeleton();

if( args.includes('--skeleton')){
  console.log( JSON.stringify( skeleton, null, 2 ) );
}

const withDates = generateDates(skeleton);

if( !args.includes('--no-final-output') ){
  console.log( JSON.stringify( withDates, null, 2 ) );
}
