module.exports = (faker) => {

  const defaults = {
    actions: 'No',
    'application-quality': 'No',
    'missing-qualifications': 'No',
    'interview-performance': 'No',
    'course-full': 'No',
    'other-offer': 'No',
    honesty: 'No',
    safeguarding: 'No',
    'other-feedback': 'No',
    'future-applications': 'No'
  }

  const behaviour = {
    actions: 'Yes',
    'actions-reasons': [
      'Didn’t reply to our interview offer',
      'Other'
    ],
    'actions-reasons-other': 'Another reason goes here',
    'actions-reasons-other-improve': 'Ways to improve goes here'
  }

  const quality = {
    'application-quality': 'Yes',
    'application-quality-reasons': [
      'Personal statement',
      'Subject knowledge',
      'Other'
    ],
    'application-quality-reasons-personal-statement': 'Lack of passion',
    'application-quality-reasons-subject-knowledge': 'Didn’t know enough about maths',
    'application-quality-reasons-other-improve': 'Ways to improve goes here'
    'application-quality-reasons-other': 'Spelling wasn’t great'
  }

  const qualifications = {
    'missing-qualifications': 'Yes',
    'missing-qualifications-reasons': [
      'No Maths GCSE grade 4 (C) or above, or valid equivalent',
      'No English GCSE grade 4 (C) or above, or valid equivalent',
      'Other'
    ],
    'missing-qualifications-reasons-other': 'Another reason goes here'
  }

  const interviewPerformance = {
    'interview-performance': 'Yes',
    'interview-performance-advice': 'Advice goes here'
  }

  const course = {
    'course-full': 'Yes'
  }

  const offeredOther = {
    'other-offer': 'Yes',
    'other-offer-details': 'Other course details go here'
  }

  const honesty = {
    honesty: 'Yes',
    'honesty-reasons': [
      'Information given on application form false or inaccurate',
      'Evidence of plagiarism in personal statement or elsewhere',
      'References didn’t support application',
      'Other'
    ],
    'honesty-reasons-false-information': 'False information detail goes here',
    'honesty-reasons-plagiarism': 'Plagiarism detail goes here',
    'honesty-reasons-reference-information': 'Reference information goes here',
    'honesty-reasons-other': 'Another reason goes here'
  }

  const safeguarding = {
    safeguarding: 'Yes',
    'safeguarding-reasons': [
      'Information revealed by our vetting process makes the candidate unsuitable to work with children'
    ],
    'safeguarding-reasons-vetting-information': 'Reasons the candidate unsuitable to work with children'
  }

  const additionalFeedback = {
    'other-feedback': 'Yes',
    'other-feedback-details': 'Additional feedback goes here'
  }

  const futureApplications = {
    'future-applications': 'Yes',
    'future-applications-details': 'Be happy to consider again'
  }

  // Rejection scenarios
  const scenario1 = {...defaults, ...behaviour, ...quality, ...qualifications, interviewPerformance, ...course, ...offeredOther, ...honesty, ...safeguarding}
  const scenario2 = {...defaults, ...behaviour}
  const scenario3 = {...defaults, ...safeguarding}
  const scenario4 = {...defaults, ...quality, ...additionalFeedback}
  const scenario5 = {...defaults, ...interviewPerformance}
  const scenario6 = {...defaults, ...course}
  const scenario7 = {...defaults, ...additionalFeedback, ...futureApplications}
  const scenario8 = {...defaults, ...futureApplications}

  return faker.helpers.randomize([scenario1, scenario2, scenario3, scenario4, scenario5, scenario6, scenario7, scenario8])
}
