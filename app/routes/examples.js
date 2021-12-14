module.exports = router => {

  router.get('/examples', (req, res) => {
    res.render('_examples/index', {

    })
  })

  router.get('/examples/courses', (req, res) => {
    const courses = require('../data/courses')
    courses.sort((a,b) => {
      return a.name.localeCompare(b.name)
    })

    res.render('_examples/courses/index', {
      courses
    })
  })

  router.get('/examples/qualifications', (req, res) => {
    res.render('_examples/qualifications/index', {

    })
  })

  router.get('/examples/qualifications/degrees', (req, res) => {
    res.render('_examples/qualifications/degree', {

    })
  })

  router.get('/examples/qualifications/english', (req, res) => {
    res.render('_examples/qualifications/english', {

    })
  })

  router.get('/examples/qualifications/gcse', (req, res) => {
    res.render('_examples/qualifications/gcse', {

    })
  })
}
