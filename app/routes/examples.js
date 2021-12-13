module.exports = router => {
  router.get('/examples/courses', (req, res) => {
    const courses = require('../data/courses')
    res.render('_examples/courses/index', {
      courses
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
