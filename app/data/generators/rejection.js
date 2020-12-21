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
      'Did not reply to interview request',
      'Other'
    ],
    'actions-reasons-other': faker.lorem.paragraph(),
    'actions-reasons-other-improve': faker.lorem.paragraph()
  }

  const quality = {
    'application-quality': 'Yes',
    'application-quality-reasons': [
      'Personal statement',
      'Subject knowledge'
    ],
    'application-quality-reasons-personal-statement': faker.lorem.paragraph(),
    'application-quality-reasons-subject-knowledge': faker.lorem.paragraph()
  }

  const qualifications = {
    'missing-qualifications': 'Yes',
    'missing-qualifications-reasons': [
      'No maths GCSE grade 4 (C) or above, or accepted equivalent',
      'No English GCSE grade 4 (C) or above, or accepted equivalent',
      'Other'
    ],
    'missing-qualifications-reasons-other': faker.lorem.paragraph(1)
  }

  const interviewPerformance = {
    'interview-performance': 'Yes',
    'interview-performance-advice': faker.lorem.paragraph()
  }

  const course = {
    'course-full': 'Yes'
  }

  const offeredOther = {
    'other-offer': 'Yes',
    'other-offer-details': faker.lorem.paragraph()
  }

  const honesty = {
    honesty: 'Yes',
    'honesty-reasons': [
      'Inaccurate or false information in the application',
      'Evidence of plagiarism in the application',
      'Other'
    ],
    'honesty-reasons-false-information': faker.lorem.paragraph(1),
    'honesty-reasons-plagiarism': faker.lorem.paragraph(1),
    'honesty-reasons-other': faker.lorem.paragraph(2)
  }

  const safeguarding = {
    safeguarding: 'Yes',
    'safeguarding-reasons': [
      'The vetting process found information which makes the candidate unsuitable to work with children'
    ],
    'safeguarding-reasons-vetting-information': faker.lorem.paragraph()
  }

  const additionalFeedback = {
    'other-feedback': 'Yes',
    'other-feedback-details': faker.lorem.paragraph(5)
  }

  const futureApplications = {
    'future-applications': 'Yes'
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

  return faker.helpers.randomize([scenario1, scenario2, scenario3, scenario4, scenario5, scenario6, scenario7, scenario8, null])
}
