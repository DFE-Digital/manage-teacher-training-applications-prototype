var uuid = require('uuid/v4')

module.exports = {
  "GH12354": {
    id: "GH12354",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Aston Manor Academy',
    course: 'Biology (2P36)',
    submittedDate: '2019-07-15',
    status: 'Accepted',
    notes: {
      items: [{
        subject: "Talk to candidate on 15 June",
        body: "Make sure to prepare this and that ready for a chat",
        sender: "Laura Tennant",
        date: '2020-01-20'
      }]
    },
    offer: {
      madeDate: '2019-07-30',
      acceptedDate: '2019-07-30',
      standardConditions: [{ id: uuid(), description: 'Fitness to teach check', status: 'Pending' }],
      conditions: [{ id: uuid(), description: 'You need to take English speaking course', status: 'Pending' }]
    },
    'personal-details': {
      'given-name': 'Eloise',
      'family-name': 'Wells',
      'date-of-birth': '1989-11-04',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900001',
      email: 'alexandra.beckam@example.com',
      address: {
        line1: '47 Simone Weil Avenue',
        line2: '',
        level2: 'Wedhampton',
        level1: 'Wedhamptonshire',
        'postal-code': 'WH7 2RH'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Joe Bloggs',
        email: 'j.bloggs@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Manager'
        }
      },
      second: {
        status: 'pending',
        type: 'Academic',
        name: 'Jane Doe',
        email: 'jane.doe@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Degree course supervisor'
        }
      }
    }
  },
  "EW65341": {
    id: "EW65341",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Aston Manor Academy',
    course: 'Media Studies (33MP)',
    submittedDate: '2019-07-15',
    status: 'Conditions met',
    offer: {
      madeDate: '2019-08-10',
      acceptedDate: '2019-08-10',
      conditionsMetDate: '2019-09-12',
      standardConditions: [{ id: uuid(), description: 'Fitness to teach check', status: 'Met' }],
      conditions: [{ id: uuid(), description: 'You need to take English speaking course', status: 'Met' }]
    },
    'personal-details': {
      'given-name': 'Becky',
      'family-name': 'Brother',
      'date-of-birth': '1985-01-16',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900002',
      email: 'becky.brother@example.com',
      address: {
        line1: '83 Scarcroft Road',
        line2: '',
        level2: 'Bulwick',
        level1: 'Westhamptonshire',
        'postal-code': 'IV21 8JQ'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Joe Bloggs',
        email: 'j.bloggs@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Manager'
        }
      },
      second: {
        status: 'pending',
        type: 'Academic',
        name: 'Jane Doe',
        email: 'jane.doe@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Degree course supervisor'
        }
      }
    }
  },
  "RT88789": {
    id: "RT88789",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Aston Manor Academy',
    course: 'Chemistry (2P38)',
    submittedDate: '2019-07-15',
    status: 'Enrolled',
    notes: {
      items: [{
        subject: "Call Charlie 17 May",
        body: "Call about their timings for interview. Be conscious that they may be at work at this time.",
        sender: "Emma Hill-French",
        date: '2020-01-20'
      }]
    },
    offer: {
      madeDate: '2019-08-10',
      acceptedDate: '2019-08-12',
      conditionsMetDate: '2019-09-12',
      enrolledDate: '2019-09-14',
      standardConditions: [{ id: uuid(), description: 'Fitness to teach check', status: 'Met' }],
      conditions: [{ id: uuid(), description: 'You need to take English speaking course', status: 'Met' }]
    },
    'personal-details': {
      'given-name': 'Charlie',
      'family-name': 'April',
      'date-of-birth': '1995-09-10',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900003',
      email: 'charlie.april@example.com',
      address: {
        line1: '18 Argyll Road',
        line2: '',
        level2: 'Llanberis',
        level1: 'Montgomeryshire',
        'postal-code': 'LL55 8PY'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Joe Bloggs',
        email: 'j.bloggs@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Manager'
        }
      },
      second: {
        status: 'pending',
        type: 'Academic',
        name: 'Jane Doe',
        email: 'jane.doe@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Degree course supervisor'
        }
      }
    }
  },
  "ID540900": {
    id: "ID540900",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Aston Manor Academy',
    course: 'Biology (2P36)',
    submittedDate: '2019-07-15',
    status: 'Conditions not met',
    offer: {
      madeDate: '2019-07-18',
      conditionsNotMetDate: '2019-08-12',
      standardConditions: [{ id: uuid(), description: 'Fitness to teach check', status: 'Not met' }],
      conditions: [{ id: uuid(), description: 'You need to take English speaking course', status: 'Met' }]
    },

    'personal-details': {
      'given-name': 'Charlotte',
      'family-name': 'Campbel',
      'date-of-birth': '1992-03-08',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900004',
      email: 'charlotte.campbel@example.com',
      address: {
        line1: '64 Pier Road',
        line2: '',
        level2: 'Starling',
        level1: 'Starlingshire',
        'postal-code': 'CB11 8RX'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Joe Bloggs',
        email: 'j.bloggs@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Manager'
        }
      },
      second: {
        status: 'pending',
        type: 'Academic',
        name: 'Jane Doe',
        email: 'jane.doe@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Degree course supervisor'
        }
      }
    }
  },
  "PL098988": {
    id: "PL098988",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Titan Partnership Ltd',
    course: 'Mathematics (2P3K)',
    submittedDate: '2019-07-15',
    status: 'Rejected',
    rejectedDate: '2019-08-10',
    rejectedReasons: {

      // Candidate actions
      "candidate-actions": "Yes",
      "candidate-actions-reasons": "Didn’t reply to our interview offer,Didn’t attend interview",
      "candidate-actions-reasons-other": "Another reasons goes here",

      // Course full
      "course-full": "Yes",

      // Missing qualifications
      "missing-qualifications": "Yes",
      "missing-qualifications-reasons": "No Maths GCSE grade 4 (C) or above, or valid equivalent,No English GCSE grade 4 (C) or above, or valid equivalent, Other",
      "missing-qualifications-reasons-other": "Another reason goes here",

      // Application quality
      "application-quality": "Yes",
      "application-quality-reasons": "Personal statement, Subject knowledge, Other",
      "application-quality-reasons-other": "Spelling wasn’t great",
      "application-quality-reasons-subject-knowledge": "Didn't know enough about maths",
      "application-quality-reasons-personal-statement": "Lack of passion",

      // Safeguarding
      "safeguarding": "Yes",
      "safeguarding-reasons": "Information given on application form false or inaccurate,Evidence of plagiarism in personal statement or elsewhere, References unsatisfactory, Information disclosed by candidate makes them unsuitable to work with children, Information revealed by our vetting process makes the candidate unsuitable to work with children",
      "safeguarding-reasons-false-information": "False information about past",
      "safeguarding-reasons-plagiarism": "Copied a blog post",
      "safeguarding-reasons-reference-information": "John had a patchy history",
      "safeguarding-reasons-disclosed-information": "Information disclosed wasn't truthful",
      "safeguarding-reasons-vetting-information": "Vetting information explained not suitable",
      "safeguarding-reasons-other": "Something else regarding safeguarding",

      // Another issue
      "another-issue": "Yes",
      "another-issue-details": "Another detail here",

      // Other feedback
      "other-feedback": "Yes",
      "other-feedback-details": "Other feedback here",

      // Future applications
      "future-applications": "Yes",
      "future-applications-details": "Be happy to consider again"
    },

    'personal-details': {
      'given-name': 'Daniel James',
      'family-name': 'Jennings',
      'date-of-birth': '1998-12-16',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900005',
      email: 'daniel.jenning@example.com',
      address: {
        line1: 'Flat 2A',
        line2: '74 Nith Street',
        level2: 'Bray',
        level1: 'Wessex',
        'postal-code': 'PH2 6EX'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Joe Bloggs',
        email: 'j.bloggs@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Manager'
        }
      },
      second: {
        status: 'pending',
        type: 'Academic',
        name: 'Jane Doe',
        email: 'jane.doe@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Degree course supervisor'
        }
      }
    }
  },
  "QW211115": {
    id: "QW211115",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Titan Partnership Ltd',
    course: 'Business studies (2P37)',
    submittedDate: '2019-08-15',
    status: 'Declined',
    offer: {
      madeDate: '2019-09-10',
      declinedDate: '2019-09-12',
      standardConditions: [{ id: uuid(), description: 'Fitness to teach check', status: 'Pending' }],
      conditions: [{ id: uuid(), description: 'You need to take English speaking course', status: 'Pending' }]
    },
    'personal-details': {
      'given-name': 'Elizabeth',
      'family-name': 'Rose',
      'date-of-birth': '1988-06-08',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900006',
      email: 'elizabeth.rose@example.com',
      address: {
        line1: '106 Freezeland Lane',
        line2: '',
        level2: 'Townheath',
        level1: 'Radshire',
        'postal-code': 'HS2 9NF'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Joe Bloggs',
        email: 'j.bloggs@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Manager'
        }
      },
      second: {
        status: 'pending',
        type: 'Academic',
        name: 'Jane Doe',
        email: 'jane.doe@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Degree course supervisor'
        }
      }
    }
  },
  "KH96344": {
    id: "KH96344",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Titan Partnership Ltd',
    course: 'Media Studies (33MP)',
    submittedDate: '2019-09-15',
    withdrawnDate: '2019-09-16',
    status: 'Application withdrawn',
    'personal-details': {
      'given-name': 'Esther',
      'family-name': 'Fairley',
      'date-of-birth': '1982-08-10',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900007',
      email: 'esther.fairley@example.com',
      address: {
        line1: '67 Seaford Road',
        line2: '',
        level2: 'Cumberworth',
        level1: 'Radshire',
        'postal-code': 'LN13 0UL'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Joe Bloggs',
        email: 'j.bloggs@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Manager'
        }
      },
      second: {
        status: 'pending',
        type: 'Academic',
        name: 'Jane Doe',
        email: 'jane.doe@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Degree course supervisor'
        }
      }
    }
  },
  "WP010100": {
    id: "WP010100",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Aston Manor Academy',
    course: 'Religious Studies (V6X9)',

    submittedDate: '2019-09-01',
    status: 'Offer withdrawn',
    offer: {
      madeDate: '2019-09-23',
      withdrawnDate: '2019-09-23',
      withdrawnReasons: {

        // Candidate actions
        "candidate-actions": "Yes",
        "candidate-actions-reasons": "Didn’t reply to our interview offer,Didn’t attend interview",
        "candidate-actions-reasons-other": "Another reasons goes here",

        // Course full
        "course-full": "Yes",

        // Missing qualifications
        "missing-qualifications": "Yes",
        "missing-qualifications-reasons": "No Maths GCSE grade 4 (C) or above, or valid equivalent,No English GCSE grade 4 (C) or above, or valid equivalent, Other",
        "missing-qualifications-reasons-other": "Another reason goes here",

        // Application quality
        "application-quality": "Yes",
        "application-quality-reasons": "Personal statement, Subject knowledge, Other",
        "application-quality-reasons-other": "Spelling wasn’t great",
        "application-quality-reasons-subject-knowledge": "Didn't know enough about maths",
        "application-quality-reasons-personal-statement": "Lack of passion",

        // Safeguarding
        "safeguarding": "Yes",
        "safeguarding-reasons": "Information given on application form false or inaccurate,Evidence of plagiarism in personal statement or elsewhere, References unsatisfactory, Information disclosed by candidate makes them unsuitable to work with children, Information revealed by our vetting process makes the candidate unsuitable to work with children",
        "safeguarding-reasons-false-information": "False information about past",
        "safeguarding-reasons-plagiarism": "Copied a blog post",
        "safeguarding-reasons-reference-information": "John had a patchy history",
        "safeguarding-reasons-disclosed-information": "Information disclosed wasn't truthful",
        "safeguarding-reasons-vetting-information": "Vetting information explained not suitable",
        "safeguarding-reasons-other": "Something else regarding safeguarding",

        // Another issue
        "another-issue": "Yes",
        "another-issue-details": "Another detail here",

        // Other feedback
        "other-feedback": "Yes",
        "other-feedback-details": "Other feedback here",

        // Future applications
        "future-applications": "Yes",
        "future-applications-details": "Be happy to consider again"
      },
      standardConditions: [{ id: uuid(), description: 'Fitness to teach check', status: 'Pending' }],
      conditions: [{ id: uuid(), description: 'You need to take English speaking course', status: 'Pending' }]
    },

    'personal-details': {
      'given-name': 'Francis',
      'family-name': 'Platt',
      'date-of-birth': '1996-04-28',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900101',
      email: 'francis.platt@example.com',
      address: {
        line1: '1 Dingwall Road,',
        line2: '',
        level2: 'Croydon',
        level1: 'London',
        'postal-code': 'CR0 2NA'
      }
    },
    'work-history': {
      1: {
        role: 'Team member',
        org: 'Zabardast',
        type: 'Part-time',
        description: 'Zabardast is an Indian street food chain. I really enjoy interacting with the public, even at peak times, and I love the camaraderie of working within a busy team. Along with good communication skills, I feel all of these skills would be essential in a teaching career.',
        'worked-with-children': 'No',
        category: 'job',
        'start-date': '2018-08-01',
        'end-date': false
      },
      2: {
        role: 'English Language Assistant',
        org: 'British Council',
        type: 'Part-time',
        description: 'I taught English on a paid six-month placement working as a language assistant in Austria. This experience helped to improve my communication and presentation skills. I also learned how to work independently and think more creatively.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2017-02-01',
        'end-date': '2017-08-01'
      },
      3: {
        role: 'Counter’s Assistant',
        org: 'Sainsbury’s',
        type: 'Part-time',
        description: 'Working part-time at my local Sainsbury’s store on the checkout taught me how to deal with difficult customers (as well as engage with the lovely ones). Reliability, punctuality, hard work and patience were just some of the important life skills this job instilled in me.',
        'worked-with-children': 'No',
        category: 'job',
        'start-date': '2017-02-01',
        'end-date': '2017-08-01'
      },
      4: {
        description: 'I attended a semester exchange programme, allowing me to study abroad at the University of Strasbourg.',
        category: 'break',
        duration: '6 months',
        'start-date': '2016-08-01',
        'end-date': '2017-02-01'
      }
    },
    degree: {
      1: {
        type: 'BA',
        subject: 'English Literature',
        org: 'King’s College, London',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'Pending',
        'grade-predicted': '2:1',
        year: '2020'
      }
    },
    gcse: {
      maths: {
        type: 'GCSE',
        subject: 'Maths',
        country: 'United Kingdom',
        missing: false,
        grade: 'A*',
        year: '2012'
      },
      english: {
        type: 'GCSE',
        subject: 'English',
        missing: false,
        grade: 'A*',
        year: '2012'
      }
    },
    'other-qualifications': {
      1: {
        type: 'GCSE',
        subject: 'Resistant Materials',
        org: 'Marshfield High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2012'
      },
      2: {
        type: 'GCSE',
        subject: 'Graphics',
        org: 'Marshfield High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2012'
      },
      3: {
        type: 'GCSE',
        subject: 'Religious Studies',
        org: 'Marshfield High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2012'
      },
      4: {
        type: 'AS-level',
        subject: 'Maths',
        org: 'Marshfield High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2013'
      },
      5: {
        type: 'A-level',
        subject: 'French',
        org: 'Marshfield High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2014'
      },
      6: {
        type: 'A-level',
        subject: 'Religious Studies',
        org: 'Marshfield High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2014'
      },
      7: {
        type: 'A-level',
        subject: 'English',
        org: 'Marshfield High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2014'
      },
      8: {
        type: 'ABRSM',
        subject: 'Music Theory',
        org: '',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: '5',
        year: '2010'
      },
      9: {
        type: 'ABRSM',
        subject: 'Piano (practical)',
        org: '',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: '8',
        year: '2015'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    'school-experience': {
      1: {
        role: 'SHINE mentor',
        org: 'Castle Hill Primary School',
        'worked-with-children': 'Yes',
        'start-date': '2018-02-01',
        'end-date': '2018-06-12',
        'time-commitment': 'I worked in school for 2 hours a week as a SHINE mentor to a primary school pupil.'
      },
      2: {
        role: 'Sunday school teacher',
        org: 'Tamworth Road Baptist Chapel',
        'worked-with-children': 'Yes',
        'start-date': '2018-02-01',
        'end-date': '2018-06-12',
        'time-commitment': 'One morning every Sunday.'
      },
      3: {
        role: 'Summer Outreach volunteer',
        org: 'Canterbury Christ Church University',
        'worked-with-children': 'Yes',
        'start-date': '2017-07-01',
        'end-date': false,
        'time-commitment': 'Two weeks in July every year.'
      }
    },
    'personal-statement': {
      vocation: 'I have wanted to become a secondary school teacher since the age of fourteen, because I always enjoyed going to school and felt privileged to receive the quality of education and guidance I did. My secondary school teachers inspired my passion for learning and enabled me to pursue and achieve my goals through their dedicated teaching and support. I would hope to use the role of a teacher to help young people achieve their potential, which will help them in their future career and for their own personal development. My experiences of working with children and young people in the past have been very positive and have enabled me to develop my teaching skills, as well as confirming that I would be suited to this profession. I have been encouraged to see that my tutees make rapid progress at school after a few weeks of tuition, both in terms of their confidence and academic performance. My strongest qualities that would make me a good teacher are patience, dedication and resilience, as well as the ability to recognise and work on my weaknesses; I have also built very positive relationships with my former colleagues in the past, and work well in a team. While I have a good sense of humour, I am also a firm disciplinarian, and I place a high value on professional practice.',
      'subject-knowledge': 'I’d like to teach Religious Studies at Secondary School level because I’m convinced that educating children about different belief systems and perspectives on life is the surest way to promote a tolerant and open society. Religious Studies also provides a forum to debate ethical issues, thereby helping students apply a moral lens to the dilemmas and challenges of modern society. During my time at secondary school, it was the hard work and commitment of my Religious Studies teachers which inspired me to learn about world religions and develop a fascination for other cultures. Now more than ever children need an understanding of the spiritual ideologies which shape our world, sometimes in violent opposition to each other.\n\nI also feel that secondary school is a pivotal time in a child’s life and that if they can develop a love of learning at this age then they could go on to further study whether in higher education or outside of academia.',
      interview: ''
    },
    references: {
      first: {
        status: 'pending',
        type: 'Academic',
        name: 'Harry Smith',
        email: 'henry.smith@example.ac.uk',
        tel: '07700 900001',
        relationship: {
          summary: 'University tutor'
        }
      },
      second: {
        status: 'pending',
        type: 'Character',
        name: 'Janice Doe',
        email: 'janice.doe@example.org',
        tel: '07700 900002',
        relationship: {
          summary: 'Faith leader who I have known since January 2018'
        }
      }
    },
    miscellaneous: 'I will be taking a TEFL course in September for one month to gain a professional qualification as a TEFL teacher, which I hope will help me find work running evening classes online or at a language school in the UK this year.'
  },
  "PW908111": {
    id: "PW908111",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Aston Manor Academy',
    course: 'Computer Science and Information Technology (IX99)',
    submittedDate: '2019-09-01',
    status: 'Offered',
    offer: {
      madeDate: '2019-09-23',
      standardConditions: [{ id: uuid(), description: 'Fitness to teach check', status: 'Pending' }],
      conditions: [{ id: uuid(), description: 'You need to take English speaking course', status: 'Pending' }]
    },
    'personal-details': {
      'given-name': 'James',
      'family-name': 'Khan',
      'date-of-birth': '1982-06-10',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900102',
      email: 'james.khan@example.com',
      address: {
        line1: '25 Thatch Avenue',
        line2: '',
        level2: 'Garstang',
        level1: '',
        'postal-code': 'PR2 1TZ'
      }
    },
    'work-history': {
      1: {
        role: 'Web coordinator',
        org: 'University of Leicester',
        type: 'Full-time',
        description: 'I am closely involved in the training of new users of our Content Management System. This is all online training, but I interact with users before and after the course, and assist with queries. I have also arranged meetings with the online training team to discuss ways we can make the training more relevant, up-to-date and engaging. I also help to run bi-monthly drop-in sessions to provide one-to-one support for system users.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2019-01-01',
        'end-date': false
      },
      2: {
        role: 'Minister of Religion (Officer)',
        org: 'The Salvation Army',
        type: 'Full-time',
        description: 'Working as an administrative allowed me to develop a variety of basic skills such as time-management through meeting target deadlines; teamwork - interacting with the staff and ensuring the job was completed and in good time and communication skills which were developed through liaison with customers and the staff. Job duties consisted of communication with customers by taking orders, manufacturing visors, postal duties, clerical order processing.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2015-07-01',
        'end-date': '2018-12-01'
      },
      3: {
        role: 'Divisional Youth Officer',
        org: 'The Salvation Army',
        type: 'Full-time',
        description: 'This role involved supporting youth workers across more than thirty churches in the North-West. I provided one-on-one supervision and support for youth workers and delivered safeguarding training. I also planned annual summer camps and youth conferences, recruiting and training volunteers to assist with the delivery. These events included elements of teaching, including workshops for music, multimedia, drama, arts and bible studies, as well as presenting to larger groups of young people and youth workers. A significant project during this employment, for which I was responsible, was a year-long Youth Achievement Award, which included encouraging a group of young people to use reflective practice, critical thinking skills and peer assessment. This project ended with an overseas mission trip to Malawi, which required meticulous planning, fundraising and coordination.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2011-09-01',
        'end-date': '2013-08-01'
      },
      4: {
        description: 'In full-time education for DipHE - Salvation Army Officership (ordination training).',
        category: 'break',
        duration: '2 years',
        'start-date': '2013-08-01',
        'end-date': '2015-07-01'
      }
    },
    'school-experience': {
      1: {
        role: 'SEND Tutor',
        org: 'Various',
        'worked-with-children': 'Yes',
        'start-date': '2017-01-01',
        'end-date': '2019-01-12',
        'time-commitment': '2 years tutoring children and young people with special educational needs.'
      }
    },
    degree: {
      1: {
        type: 'BSc',
        subject: 'Web and Multimedia',
        grade: '2:1'
      }
    },
    gcse: {
      maths: {
        type: 'GCSE',
        subject: 'Maths',
        country: 'United Kingdom',
        missing: false,
        grade: 'A*',
        year: '1997'
      },
      english: {
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        missing: false,
        grade: 'A*',
        year: '1997'
      }
    },
    'other-qualifications': {
      1: {
        type: 'GCSE',
        subject: 'Science',
        org: 'Rose View High',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A*',
        year: '1997'
      },
      2: {
        type: 'GCSE',
        subject: 'Business Studies',
        org: 'Rose View High',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '1997'
      },
      3: {
        type: 'GCSE',
        subject: 'English Literature',
        org: 'Rose View High',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '1997'
      },
      4: {
        type: 'GCSE',
        subject: 'Information Technology',
        org: 'Rose View High',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '1997'
      },
      5: {
        type: 'GCSE',
        subject: 'French',
        org: 'Rose View High',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '1997'
      },
      6: {
        type: 'A-level',
        subject: 'Psychology',
        org: 'Rose View High',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '1999'
      },
      7: {
        type: 'A-level',
        subject: 'Mathematics',
        org: 'Rose View High',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '1999'
      },
      8: {
        type: 'A-level',
        subject: 'Geography',
        org: 'Rose View High',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '1999'
      },
      9: {
        type: 'Level 3 Certificate',
        subject: 'Youth Work Practice',
        org: 'ASDAN',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'Pass',
        year: '2013'
      },
      10: {
        type: 'DipHE',
        subject: 'Salvation Army Officership',
        org: 'University of Gloucestershire',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'Distinction',
        year: '2015'
      },
      11: {
        type: 'PGCert',
        subject: 'Mission: Pioneering Ministries',
        org: 'Durham University',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'Distinction',
        year: '2019'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    'personal-statement': {
      vocation: 'Having worked in various youth work settings over the years, and in a number of IT-related roles, I now find myself excited by the possibility of combining this knowledge and experience by studying for a PGCE, in order to teach Computer Science at the secondary level.\n\nAs a youth worker, and also in various chaplaincy or ministry-based roles with adults, I would find a tremendous sense of encouragement from seeing people develop new skills and raise their aspirations. I have been fortunate enough to see some of the teenagers from my activities grow up and become youth leaders themselves, using their skills for the development of others. This has been one of the greatest rewards of youth work and I am excited by the possibility that through teaching young people, I might also inspire them to use their learning for the benefit of others.\n\nMy brief experience of teaching at Blackpool and the Fylde College was both enjoyable and challenging in equal measures. I developed an understanding of the pressures of planning lessons for new classes, incorporating differentiation for my learners’ needs, managing my time, developing rapport with students, assessing work and providing helpful feedback. Whilst I did not receive a teaching qualification at this time, the experiences in this role were a crucial factor in my decision to pursue teaching. My students in this role were all over the age of sixteen, and I am aware that teaching Key Stages 3 and 4 will introduce new challenges. However, my experiences of youth work, both paid and voluntary have allowed me to develop confidence in working with these age groups. Many of my other roles have allowed me to develop in areas that I believe will serve me well as a teacher, including public speaking, safeguarding practice, equality, diversity and inclusion, and dealing with challenging behaviour in young people and adults.\n\nRecently, I have been able to experience study at postgraduate level, whilst working full time, which has required focus and a healthy home-work-study balance. I particularly enjoyed being able to apply my learning in a working environment, which is why I believe the blend of study and placements within a PGCE would be a suitable training route for me.',
      'subject-knowledge': 'For as long as I can remember, computers and technology have been one of my passions. As a child, I learned how to make simple programs, coded in BASIC, on my Commodore 64 with little more than a charity shop textbook and an enthusiasm for experimenting. This enthusiasm persisted throughout my childhood with Information Technology always being my favourite class at school.\n\nEntering university in 1999 on a Web and Multimedia course, I was particularly excited by the potential of the internet, which was very much in its early days of mainstream popularity. The course focused on web design, most often using raw HTML, but occasionally with the aid of software such as Dreamweaver. Multimedia creation and editing also featured significantly in the learning, using Photoshop, Premiere and Flash. However, not all modules were web-related and some, such as Program Design and Implementation, and Java Programming, gave me a good understanding of the fundamentals of computer programming. Other modules covered the basics of computer hardware and software. My final year project consisted of the creation of a database-driven website, which required substantial coding in PHP, HTML, CSS and Javascript, and the use of SQL to manipulate a relational database.\n\nShortly after graduating, I worked for six months as an ICT Technician at a high school in Warrington, working as part of a team at the high school, but frequently providing sole IT support for their “feeder” primary schools. This broadened my knowledge and experience of computer and network maintenance, as well as giving me a glimpse of classroom environments.',
      interview: 'I currently work full-time so I would need some notice to arrange time off for any weekday interview.'
    },
    references: {
      first: {
        status: 'pending',
        type: 'Academic',
        name: 'Joesph Bloggs',
        email: 'j.bloggs@example.ac.uk',
        tel: '07700 900001',
        relationship: {
          summary: 'University tutor'
        }
      },
      second: {
        status: 'pending',
        type: 'Professional',
        name: 'Janice Doe',
        email: 'janice.doe@example.com',
        tel: '07700 900002',
        relationship: {
          summary: 'Manager'
        }
      }
    },
    miscellaneous: ''
  },
  "AB5499": {
    id: "AB5499",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Titan Partnership Ltd',
    course: 'History (33MP)',
    submittedDate: '2019-09-16',
    status: 'Offered',
    offer: {
      madeDate: '2019-10-01',
      standardConditions: [{ id: uuid(), description: 'Fitness to teach check', status: 'Pending' }],
      conditions: [{ id: uuid(), description: 'You need to take English speaking course', status: 'Pending' }]
    },

    'personal-details': {
      'given-name': 'Jeremy',
      'family-name': 'Brown',
      'date-of-birth': '1970-01-03',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900103',
      email: 'jeremy.brown@example.com',
      address: {
        line1: '45 Dialstone Lane',
        line2: '',
        level2: 'Stockport',
        level1: '',
        'postal-code': 'SK2 6AA'
      }
    },
    'work-history': {
      1: {
        role: 'Whole School Literacy Specialist',
        org: 'Cheadle Hulme High School',
        type: 'Full-time',
        description: 'I lead, develop and enhance the literacy teaching practice of others. I support colleagues with selecting appropriate resources and techniques to help students with literacy difficulties. I’m also responsible for the Whole School Literacy Policy and Literacy Development Plan.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2018-05-01',
        'end-date': false
      },
      2: {
        role: 'Teaching Assistant',
        org: 'The Fallibroome Academy',
        type: 'Full-time',
        description: 'Prepared, managed and differentiated resources for our SEN students, taught whole classes and small groups, conducted literacy and numeracy interventions and taught English as a foreign language to a Syrian refugee.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2013-11-01',
        'end-date': '2018-05-01'
      },
      3: {
        description: 'Travelling in India',
        category: 'break',
        duration: '6 months',
        'start-date': '2013-05-01',
        'end-date': '2013-11-01'
      },
      4: {
        role: 'Teacher of English as a Foreign Language',
        org: 'Vardaki School of English, Crete',
        type: 'Full-time',
        description: 'As a TEFL instructor in the local village school, I taught English to a wide range of age groups and abilities. Most of my classes day-to-day were for adults – 72% of my students passed their English tests first time. I enjoyed sharing my love of the English language with my pupils and learning about Greek culture in return.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2007-09-01',
        'end-date': '2013-05-01'
      },
      5: {
        role: 'Police officer',
        org: 'Manchester Constabulary',
        type: 'Full-time',
        description: 'I was required to deal with often dangerous and stressful situations involving young people and mental health issues. I was expected to gather evidence and write complex reports. I developed communication and conflict resolution techniques as well as problem solving skills which I have been able to transfer to my career in education. I have also received training in moving and handling and basic first aid.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '1995-09-01',
        'end-date': '2007-08-01'
      }
    },
    'school-experience': {
      1: {
        role: 'Volunteer',
        org: 'Pathfield Special School, Barnstaple, North Devon',
        'worked-with-children': 'Yes',
        'start-date': '1994-09-01',
        'end-date': '1995-08-01',
        'time-commitment': ''
      },
      2: {
        role: 'Teaching assistant',
        org: 'Petroc College, Barnstaple',
        'worked-with-children': 'Yes',
        'start-date': '1993-09-01',
        'end-date': '1994-06-01',
        'time-commitment': ''
      },
      3: {
        role: 'Volunteer',
        org: 'Chelfham Mill Residential School for Boys',
        'worked-with-children': 'Yes',
        'start-date': '1992-09-01',
        'end-date': '1993-06-01',
        'time-commitment': ''
      }
    },
    degree: {
      1: {
        type: 'BA Hons',
        subject: 'History and Politics',
        org: 'University of Huddersfield',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: '2:1',
        year: '1992'
      }
    },
    gcse: {
      maths: {
        type: 'GCE O Level',
        subject: 'Maths',
        country: 'United Kingdom',
        missing: false,
        grade: 'B',
        year: '1992'
      },
      english: {
        type: 'GCE O Level',
        subject: 'English',
        country: 'United Kingdom',
        missing: false,
        grade: 'A',
        year: '1992'
      }
    },
    'other-qualifications': {
      1: {
        type: 'GCE O Level',
        subject: 'English Literature',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '1986'
      },
      2: {
        type: 'GCE O Level',
        subject: 'French',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '1986'
      },
      3: {
        type: 'GCE O Level',
        subject: 'History',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'C',
        year: '1986'
      },
      4: {
        type: 'GCE O Level',
        subject: 'Latin',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'C',
        year: '1986'
      },
      5: {
        type: 'GCE O Level',
        subject: 'German',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'C',
        year: '1986'
      },
      6: {
        type: 'GCE O Level',
        subject: 'Physics',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'C',
        year: '1986'
      },
      7: {
        type: 'GCE O Level',
        subject: 'Law',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '1986'
      },
      8: {
        type: 'A Level',
        subject: 'Political Studies',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '1988'
      },
      9: {
        type: 'A Level',
        subject: 'General Studies',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '1988'
      },
      10: {
        type: 'A Level',
        subject: 'French',
        org: 'St John’s High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'C',
        year: '1988'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    'personal-statement': {
      vocation: '• Retired from the Police Service in 2007.\n\n• Have been working in education in a variety of roles and I have found it to be an extremely rewarding career.\n\n• Have been teaching since this time, but I now want to go to the next level and earn my Qualified Teacher Status.\n\n• I’ve gained considerable experience teaching various subjects including English, History and BTEC Workskills.\n\n• I have obtained teaching qualifications to support my classroom experience and now wish to progress in my career.\n\n• As a teacher I see an essential part of my role as not only supporting students’ learning, but also developing their independence and self-esteem.\n\n• I have also accompanied students including wheelchair users on organised school trips to such places as the First World War battlefields in France and Belgium, the Houses of Parliament and Supreme Court in London and local destinations such as Quarry Bank Mill and Tatton Park.\n\n• I feel that the time is right to take on a new challenge and continue my career working with children in a teaching role.\n\n• I find working with students very rewarding and wish to continue to develop my knowledge and skills in this vital sector by studying for my Qualified Teacher Status.',
      'subject-knowledge': 'I wish to teach History in a Secondary School to both GCSE and A Level students. My degree is in History and I have experience teaching History at this level. Whilst working at the Fallibroome Academy I was a Curriculum Specialist Teaching Assistant working in the History Department. As part of this role, I delivered lessons to Years 7 to 11 when required, taught small groups and supported SEN students in class. History is my passion and I believe that my enthusiasm and subject knowledge will help to motivate my students to not only gain success in their examinations, but to learn to love the subject into adulthood.',
      interview: ''
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Joesph Bloggs',
        email: 'j.bloggs@example.ac.uk',
        tel: '07700 900001',
        relationship: {
          summary: 'University tutor'
        },
        comments: 'A charismatic talented and able person. Great with people, fantastic personality and a strong communicator passionate about teaching. Great potential. Go for her.'
      },
      second: {
        status: 'pending',
        type: 'School-based',
        name: 'Janice Doe',
        email: 'janice.doe@example.com',
        tel: '07700 900002',
        relationship: {
          summary: 'Manager'
        },
        comments: 'A charismatic talented and able bloke. Great with people, fantastic personality and a strong communicator passionate about teaching. Great potential. Go for her.'
      }
    },
    miscellaneous: ''
  },
  "CV943651": {
    id: "CV943651",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Titan Partnership Ltd',
    course: 'Primary (2PPM)',
    submittedDate: '2019-09-18',
    status: 'New',
    'personal-details': {
      'given-name': 'May',
      'family-name': 'Cole',
      'date-of-birth': '1998-09-22',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900104',
      email: 'may.cole@example.com',
      address: {
        line1: '10 High Hill',
        line2: '',
        level2: 'Bently Hill',
        level1: 'West Midlands',
        'postal-code': 'B56 3ND'
      }
    },
    'work-history': {
      1: {
        role: 'Events coordinator',
        org: 'Hope Creative',
        type: 'Part-time',
        description: 'Job duties consisted of ensuring stalls were in the correct placement; communicating with stallholders and making them aware of contact points if required; general health and safety and, assisting with sales and marketing. Being a coordinator developed my responsibility and initiative by working with a variety of ages and creating a fun atmosphere at different seasonal events. It also involved both problem-solving and adaptability skills through changing situations as simple as the weather.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2018-06-01',
        'end-date': false
      },
      2: {
        role: 'Administrator',
        org: 'John Smith Visors',
        type: 'Part-time',
        description: 'Working as an administrative allowed me to develop a variety of basic skills such as time-management through meeting target deadlines; teamwork - interacting with the staff and ensuring the job was completed and in good time and communication skills which were developed through liaison with customers and the staff. Job duties consisted of communication with customers by taking orders, manufacturing visors, postal duties, clerical order processing.',
        'worked-with-children': 'No',
        category: 'job',
        'start-date': '2018-06-01',
        'end-date': false
      }
    },
    'school-experience': {
      1: {
        role: 'Teaching Assistant',
        org: 'Park Hill Primary',
        'worked-with-children': 'Yes',
        'start-date': '2019-01',
        'end-date': '2019-01',
        'time-commitment': '1 day of school experience.'
      },
      2: {
        role: 'Teaching Assistant',
        org: 'St. Saviours Secondary School',
        'worked-with-children': 'Yes',
        'start-date': '2019-01',
        'end-date': '2019-01',
        'time-commitment': '4 days over 2 weeks.'
      },
      3: {
        role: 'Mentor',
        org: 'Stepney High School',
        'worked-with-children': 'Yes',
        'start-date': '2017-11-01',
        'end-date': '2019-03-01',
        'time-commitment': '1 day a week.'
      }
    },
    degree: {
      1: {
        type: 'BSc',
        subject: 'Psychology',
        org: 'University of Sheffield',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: '2:1',
        year: '2019'
      }
    },
    gcse: {
      maths: {
        type: 'GCSE',
        subject: 'Maths',
        country: 'United Kingdom',
        missing: 'I will be taking a Maths GCSE equivalency test through equivalencytesting.com website on 18th August 2019'
      },
      english: {
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        missing: false,
        grade: 'B',
        year: '2014'
      },
      science: {
        type: 'GCSE',
        subject: 'Science',
        country: 'United Kingdom',
        missing: false,
        grade: 'B',
        year: '2014'
      }
    },
    'other-qualifications': {
      1: {
        type: 'GCSE',
        subject: 'Science',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2014'
      },
      2: {
        type: 'GCSE',
        subject: 'Additional Science',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2014'
      },
      3: {
        type: 'GCSE',
        subject: 'Child Development',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2014'
      },
      4: {
        type: 'GCSE',
        subject: 'English Literature',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2014'
      },
      5: {
        type: 'GCSE',
        subject: 'Citizenship',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2014'
      },
      6: {
        type: 'GCSE',
        subject: 'Psychology',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2014'
      },
      7: {
        type: 'A Level',
        subject: 'Psychology',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A*',
        year: '2016'
      },
      8: {
        type: 'A Level',
        subject: 'Sociology',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2016'
      },
      9: {
        type: 'A Level',
        subject: 'English Literature',
        org: 'Bently Academy',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'C',
        year: '2016'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    'personal-statement': {
      vocation: '‘What is my calling?’ is a question we explored within one of my third-year modules. Having to reflect upon previous experiences, personal passions and participating in a placement of interest, cultivated the idea that ‘my calling’ was meant to help and inspire others. Since realising this, my motivation to be a primary school teacher has grown.\n\nMy interest in teaching initiated through learning developmental psychology. The importance of how early experiences and the education system can impact the development of language, cognition, and emotion within children, fascinated me. From this, I decided to complete my placement in an educational setting. Within this, I had the opportunity to plan and team-teach Psychology and English lessons which developed my confidence and communication skills. Through this placement, I discovered that I particularly enjoyed working with the younger students, leading me to pursue primary school teaching. With the love for teaching younger ages, I then completed work experience within a Primary school. This confirmed my passion for wanting to teach Key stage 1/2, as I enjoyed being involved in the diverse range of subjects and working with a range of educational abilities. I am aware that all children learn differently, and had the great opportunity of working with the SEN children witnessing the importance of scaffold learning and the variety of techniques that enhanced my resilience and interpersonal skills. This experience developed my understanding of the curriculum works and the pressures associated in a school environment. I particularly noticed the different relationships that teachers have with their pupils and believe that this compliments my desire and ability to nurture.\n\nI have also volunteered for a charity called ANTS; looking after children suffering from bereavement. This experience strengthened my responsibility and empathy skills by being a support system and planning activities. This has prepared me for being relatable to children, allowing me to offer more than academic help. Furthermore, my current jobs reflect my adaptability, time management, and organization skills. Achieving set deadlines presents my ability to cope with high volumes of workload, necessary qualities needed when planning lessons whilst also juggling other teacher-related obligations. In addition, liaising with a variety of personnel, demonstrates my leadership, teamwork, and interpersonal skills which are transferable when communicating with students, parents and colleagues.\n\nAdditionally, I also enjoy several hobbies; I have taught myself guitar and piano also taking great enjoyment in the art and being creative. This will be an asset to the classroom by creating an exciting and stimulating environment, through colourful innovative learning techniques, to increase engagement and learning. These interests are beneficial in a primary classroom where cross-curricular and creative activities are part of everyday learning.',
      'subject-knowledge': 'Whilst psychology is not a national curriculum subject, it has a strong English, Scientific and Mathematical background which involves; essay writing, debates, and statistical analysis, incorporating core subjects taught within the early years to key stage 1/2. Alongside academic advantages, psychology has taught me to identify and support difficulties a child may face in the educational system such as dyslexia or mental health issues. This will be an advantage within the classroom assisting in the welfare and safeguarding of the child, particularly as mental health in primary schools is a rising educational matter. Other relevant skills I have gained are data analysis, critical thinking and social intelligence.\n\nMy varied academic and professional backgrounds offer me a unique platform to be a primary school teacher and further enhances my desire to inspire future generations to be creative, develop new ideas and challenge themselves. It would be a privilege to have involvement within these pupils’ lives.'
    },
    references: {
      first: {
        status: 'pending',
        type: 'Professional',
        name: 'Alex James',
        email: 'alex.james@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'University tutor'
        }
      },
      second: {
        status: 'pending',
        type: 'Academic',
        name: 'Peter Giles',
        email: 'pete.giles@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Degree course supervisor'
        }
      }
    },
    miscellaneous: ''
  },
  "RE123123": {
    id: "RE123123",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Aston Manor Academy',
    course: 'Mathematics (GX11)',
    submittedDate: '2019-09-21',
    status: 'New',
    'personal-details': {
      'given-name': 'Poppy',
      'family-name': 'Noor',
      'date-of-birth': '1988-02-09',
      nationality: 'Indian',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900105',
      email: 'poppy.noor@example.com',
      address: {
        line1: '5 Royal Exchange Square',
        line2: '',
        level2: 'Glasgow',
        level1: '',
        'postal-code': 'G1 3AH'
      }
    },
    'work-history': {
      1: {
        role: 'Private Tutor',
        org: 'Tutorful',
        type: 'Full-time',
        description: 'Taught Mathematics and Physics content covered in the Scottish National 5, the Higher and the Advanced Higher curricula. Assessed, graded and tracked individual’s progress in the above-mentioned subjects. Guided students to perform better in the exam by offering them mock exams and giving adequate scientific feedback.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2019-09-01',
        'end-date': false
      },
      2: {
        role: 'Resident assistant (winter vacation)',
        org: 'Tutorful',
        type: 'Part-time',
        description: 'Assisted residents by answering their queries and resolving issues during the winter break at the Andrew Ure Hall.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2016-12-01',
        'end-date': '2017-01-01'
      },
      3: {
        role: 'Graduate teaching assistant',
        org: 'Creighton University',
        type: 'Part-time',
        description: 'Taught the lab sections of General Physics 1 & General Physics 2. Assessed and graded the lab journals and exams. Guided students to solve physics problems on their own.',
        'worked-with-children': 'No',
        category: 'job',
        'start-date': '2013-08-01',
        'end-date': '2016-11-01'
      },
      4: {
        role: 'Summer intern',
        org: 'American Association of Variable Star Observers',
        type: 'Full-time',
        description: 'Maintained the APASS and the NAPASS database and kept it up to date with new observed data using the UNIX shell scripting. Ran photometry and astrometry programs (based on UNIX shell scripting) written by Dr. Arne Henden to calibrate observed APASS and NAPASS.',
        'worked-with-children': 'No',
        category: 'job',
        'start-date': '2013-06-01',
        'end-date': '2013-08-01'
      },
      5: {
        role: 'Undergraduate teaching assistant',
        org: 'Minnesota State University, Moorhead',
        type: 'Part-time',
        description: 'Leveraged exceptional communication skills to improve student performance in the Department of Physics and Astronomy. Provided comprehensive support for Introductory astronomy, analog electronics, and experimental physics courses. Tutored students and answered questions during lectures and lab sessions. Instructed students, assessed grades, and assisted with observation projects at the planetarium and the Paul P. Feder Observatory.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2010-01-01',
        'end-date': '2013-05-01'
      }
    },
    'school-experience': {},
    degree: {
      1: {
        type: 'BS',
        subject: 'Physics with emphasis in Astronomy',
        org: 'Minnesota State University, Moorhead',
        provenance: 'international',
        country: 'USA',
        grade: '2:2',
        year: '2013'
      },
      2: {
        type: 'MSc',
        subject: 'Applied Physics',
        org: 'Strathclyde University, Glasgow',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'Pass',
        year: '2017'
      }
    },
    gcse: {
      maths: {
        type: 'GCSE(A*-G)',
        subject: 'Maths',
        country: 'India',
        missing: false,
        'award-org': 'WBBSE',
        grade: '92',
        year: '2004'
      },
      english: {
        type: 'GCSE',
        subject: 'English',
        missing: 'I am prepared to take an equivalency test.'
      }
    },
    'other-qualifications': {
      1: {
        type: 'GCSE(A*-G)',
        subject: 'Science',
        org: 'Hope School, Delhi',
        provenance: 'international',
        country: 'India',
        grade: '173',
        year: '2004'
      },
      2: {
        type: 'Higher Secondary School Certificate',
        subject: 'All subjects',
        org: 'Hope School, Delhi',
        provenance: 'international',
        country: 'India',
        grade: '647',
        year: '2008'
      }
    },
    'language-skills': {
      'english-is-main': 'No',
      other: false,
      'english-qualifications': 'I learnt English during high school, and given my studies in the USA and Scotland, spend most of my time speaking English. My native language is Bengali.'
    },
    'personal-statement': {
      vocation: 'I am confident that I will be successful in the PGCE programme because I have a passion for teaching.\n\nMy collaboration and communication skills developed through my undergraduate research. I honed my public speaking skills by presenting the results at the MSUM Student Academic Conference as well as two professional meetings. I presented a poster of my senior project at the American Physical Society’s (APS) Annual March Meeting in 2013 where I also served as the Society of Physics Students (SPS) student reporter.\n\nIn 2012, I was selected as an SPS summer intern and spent the summer working on American Institute of Physics’ (AIP) Career Pathways Project, which aims to better prepare students with a bachelor’s degree in physics for the Science, Technology, Engineering, and Mathematics (STEM) workforce. Under the supervision of Dr. Thomas Olsen, Kendra Redmond, Roman Czujko, and other collaborators at the American Center for Physics, I experienced how teamwork is valued in a professional setting.\n\nThis internship opportunity also opened my eyes to scientific and professional communication. I gave a talk about my summer internship at the 221st winter meeting of American Astronomical Society (AAS) in Long Beach, CA.\n\nAfter defending my master’s thesis at Strathclyde, I worked as a private tutor and taught the students physics and mathematics for four months, who were taking the Scottish Qualification Authority (SQA) designed curricula. As a teaching and a planetarium assistant for introductory astronomy, analog electronics, and experimental physics courses, I learnt to communicate science effectively with the students. As a teaching assistant for introductory astronomy courses, I taught and assessed students on names of constellations and stars. My job was to lead students to critically think and find answers independently before asking for direction. Altogether I am confident that my strong research, work, and academic background will help me to succeed in the PGCE programme.',
      'subject-knowledge': 'I pursued an MSc in Applied Physics at the University of Strathclyde and for my dissertation, I worked on the aftermath of the space radiation on bio/matter. Previously, I obtained a Bachelor of Science in Physics with an emphasis in astronomy and a minor in Mathematics at Minnesota State University Moorhead (MSUM), USA.\n\n In my postgraduate career, I was enrolled in plasma physics courses and under the supervision of Professors Hidding and Sheng, I examined the effects of relativistic electrons at an altitude of 405 km where the International space station is on the orbit.\n\nIn addition to taking mathematics and astronomy courses in my undergraduate career, I was actively engaged in observational astronomy research throughout my undergraduate career at the Paul P. Feder Observatory at the Regional Science Center of MSUM. Under the supervision of Drs. Linda Irene Winkler, Matthew Craig, and Juan Cabanela, I performed a coarse calibration on the SBIG SGS Spectrograph using the high voltage mercury and neon light sources in the summer of 2011.\n\nMy senior year project entitled, “Analyzing Brightness Variations of an SX Phoenicis Star, XX Cyg,” which involved collecting and analyzing photometric data of XX Cyg in four Johnson/Cousins Ic filters. Through my research, I found that the period of XX Cyg is 0.134868±0.000003 days. I investigated the nature of the limit cycles of algebraic systems, which involved studying autonomous nonlinear differential equations in my senior year. I found that Van der Pol Equations are used in modeling stellar pulsation mechanism.',
      interview: ''
    },
    safeguarding: 'I have a shoplifting charge from when I was 18.',
    references: {
      first: {
        status: 'received',
        type: 'Professional',
        name: 'Alex James',
        email: 'alex.james@example.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Scotland and borders area supervisor at Tutorful'
        },
        safeguarding: {
          response: 'no'
        },
        comments: 'Fantastic personality. Great with people. Strong communicator . Excellent character. Passionate about teaching . Great potential. Go for her. A charismatic talented able young woman who is far better than her official degree result. An exceptional person.'
      },
      second: {
        status: 'received',
        type: 'Academic',
        name: 'Peter Giles',
        email: 'pete.giles@example.ac.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Course leader for my masters programme.'
        },
        safeguarding: {
          response: 'no'
        },
        comments: 'A charismatic talented and able woman. Great with people, fantastic personality and a strong communicator passionate about teaching. Great potential. Go for her.'
      }
    },
    miscellaneous: ''
  },
  "AS1623": {
    id: "AS1623",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Aston Manor Academy',
    course: 'Biology (2P36)',
    submittedDate: '2019-10-08',
    status: 'New',
    notes: {
      items: [{
        subject: "Needs review",
        body: "Make sure you review this application paying close attention to their qualifications",
        sender: "Pepper Potts",
        date: '2020-01-20'
      }]
    },
    'personal-details': {
      'given-name': 'Elise',
      'family-name': 'Briggs',
      'date-of-birth': '1998-11-17',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900201',
      email: 'elise.briggs@example.com',
      address: {
        line1: '35 Iffley Road',
        line2: '',
        level2: 'Bristol',
        level1: '',
        'postal-code': 'BS1 1PA'
      }
    },
    'reasonable-adjustments': 'I have dyslexia and require extra time.',
    'work-history': {
      1: {
        role: 'Bar Staff',
        org: 'Bristol City FC',
        type: 'Part-time',
        description: 'Time Management, Organisation, People Management, Team Leading',
        'worked-with-children': 'No',
        category: 'job',
        'start-date': '2019-05-01',
        'end-date': false
      },
      2: {
        role: 'PE Cover Supervisor',
        org: 'PE Direct',
        type: 'Part-time',
        description: 'Covering PE Lessons within secondary schools around Bristol. Developed teaching and coaching skills, behavior management and pastoral skills',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2019-05-01',
        'end-date': false
      },
      3: {
        description: 'Unable to complete work whilst studying ',
        category: 'break',
        duration: '1 year, 4 months',
        'start-date': '2014-09-01',
        'end-date': '2019-05-01'
      }
    },
    'school-experience': {
      1: {
        role: 'Observer',
        org: 'Desborough',
        'worked-with-children': 'Yes',
        'start-date': '2018-12-01',
        'end-date': '2018-12-12',
        'time-commitment': 'I spent 1 day observing in this school'
      }
    },
    degree: {
      1: {
        type: 'BSc',
        subject: 'Sport and Physical Education',
        org: 'Cardiff Metropolitan University',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'Pending',
        'grade-predicted': '2:1',
        year: '2020'
      }
    },
    gcse: {
      maths: {
        type: 'GCSE',
        subject: 'Maths',
        country: 'United Kingdom',
        missing: false,
        grade: 'C',
        year: '2015'
      },
      english: {
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        missing: false,
        grade: 'A*',
        year: '2015'
      }
    },
    'other-qualifications': {
      1: {
        type: 'BTEC',
        subject: 'Sport Science',
        org: 'Bristol College',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'D*D*D*',
        year: '2016'
      },
      2: {
        type: 'GCSE',
        subject: 'Physical Education',
        org: 'Kingswood Park',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2015'
      },
      3: {
        type: 'GCSE',
        subject: 'Biology',
        org: 'Kingswood Park',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2015'
      },
      4: {
        type: 'GCSE',
        subject: 'Chemistry',
        org: 'Kingswood Park',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2015'
      },
      5: {
        type: 'GCSE',
        subject: 'History',
        org: 'Kingswood Park',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2015'
      },
      6: {
        type: 'GCSE',
        subject: 'English Literature',
        org: 'Kingswood Park',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2015'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    'personal-statement': {
      vocation: 'Involvement within sport and physical activity is important at all ages for a plethora of reasons and further study can aid the development of knowledge that surrounds the importance of physical activity in our healthy life. I have always been involved in a range of sports including Rugby and Dancing. My motivated and determined attitude to maintain a high standard in sport has allowed me to achieve a GCSE and BTEC in both Physical Education and Sport Science. I am currently studying an Honours Degree in Sport and Physical Education and am especially interested in the challenges faced by sporting educators in inspiring a group to participate and adhere. This is something I wish to explore as part of my long-term career.\n\nThe opportunities provided by teachers and lecturers whilst studying has inspired me to replicate this throughout my continued work experience placements and, one day, within my career.\n\nI am a determined individual with a passion for sport and education, this evident in my experience within the teaching environment. I enjoy working as an individual, and as part of a team, and this allows me to adapt to new situations. As an individual who strives to achieve and consistently sets high targets to meet, I believe the opportunity to study a PGCE in secondary physical education would allow me to continue this further.',
      'subject-knowledge': 'I am involved within coaching and have completed a Level One World Rugby Coaching Badge. Alongside this, I represented my district over 3 successive years in both High and Long jump. Following my participation, I was invited to assist the organising and officiating of Gloucestershire school events, these including indoor athletics, touch rugby and netball. Helping run these developed my knowledge of planning sporting events and the efficiency needed to run these, this valuable work experience sparked my interest in following a career in teaching PE at secondary level.\n\nI have completed a number of work experience placements and internships throughout my academic career. Whilst at college, I regularly returned to my secondary school and aided in the teaching of Physical Education lessons, these have helped in the development of coaching skills that I have transferred into a job role as a PE Cover Supervisor within the South Wales region. This role has given me the opportunity to work with different age groups, sporting abilities and individuals from varying socioeconomic backgrounds and has given me the chance to build my leadership skills, specifically important within the safety aspects of the PE lessons. My job here has not been limited to PE and I have covered lessons in other departments such as Humanities, Maths and Art. This has allowed me to link PE with other subject areas across the curriculum, for example, presenting athlete data in graphs, tables and spreadsheets using skills found in Maths and ICT. My chosen degree has allowed me to complete two further placements within secondary schools. All my undertaken work experience has given me insights into a variety of teaching and coaching styles, including ways in which to encourage and maintain healthy lifestyle choices and adhere to these.\n\nOne of the most valuable experiences I gained was whilst at college where I was a member of the Sports Career Ready Academy. Being chosen through an interview process, Career Ready provided the opportunity to attend employability masterclasses with professionals and practice these skills in real life scenarios, including networking and interviews. This has allowed me to develop a wide range of employability skills including organisation and time management while also providing me opportunities to network with sporting institutes including Bristol City FC, Sport England and Active Gloucestershire.',
      interview: 'I am unable to travel on Tuesdays and Thursdays.'
    },
    safeguarding: 'Request',
    references: {
      first: {
        status: 'received',
        type: 'Academic',
        name: 'Brian Todd',
        email: 'brian.todd@bristolcity.co.uk',
        tel: '07700 900001',
        relationship: {
          summary: 'Brian is the manager of the bar at Bristol City FC bar, where I currently work part-time.',
          validated: true
        },
        safeguarding: {
          response: 'yes',
          concerns: 'Elise is impatient and intolerant by nature, and therefore not suited to work with children.'
        },
        comments: 'Elise is a very smart young woman who I have had the pleasure of working with since spring last year (2019).\n\n We rely on bar staff to be responsible, reliable, trustworthy with stock and takings, and maintain excellent time-keeping. In all of these respects Elise exceeded expectations. She remained calm in difficult situations and was always equally happy to work independently or as part of a team.\n\n Elise has great communication skills and during her time with us there have been no misunderstandings or difficulties either with customers or with staff. She manages everything to a very good standard and always goes the extra mile – for example by designing and creating a social media campaign for the bar’s relaunch.\n\n I was also impressed by the way she organised a 5-a-side football team from amongst her fellow staff – her enthusiasm and love of sport made her an inspiration.\n\n If she’s able to bring the same patience, people skills and good humour to teaching as she does to working behind the bar, I believe that she will make a fantastic teacher.'
      },
      second: {
        status: 'received',
        type: 'School-based',
        name: 'Simon Taylor',
        email: 'simon.taylor@bristolacademy.co.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Simon Taylor is head of PE at one of the schools where I have regularly provided cover as a PE teacher through my agency PE Direct.',
          validated: false,
          correction: 'I worked with Elise regularly over a period of a year, but was not the head of PE.'
        },
        safeguarding: {
          response: 'no'
        },
        comments: 'Elise Briggs has good time management and attendance. When working for Bristol Academy as a temporary PE teacher, Elise always demonstrated the utmost commitment and dedication towards her classes. I also felt completely confident in Elise to leave her to assist students without having to suggest what to do – she would automatically do it.\n\n She always gave myself and other teachers respect and worked well under direction; at the same time, I would feel confident knowing she would be able to teach the students without needing my support or guidance. Her degree in Sport and Physical Education gives her the confidence to take control of a class and lead. \n\n Elise also shows a huge passion for teaching not just sport, but also choreography. After showing a talent for it, she was given opportunities to choreograph pieces within the competition class which she excelled at. Elise knows her technical theory so when teaching she always explains what the students should be doing and how that helps, explaining the muscles used, etc. \n\n Elise showed a good sense of emotion towards the students at Bristol Academy, and built  bonds that allowed the students to feel they could go to her and learn from her. I feel Elise would make an excellent teacher and I would highly recommend her for this course. '
      }
    },
    miscellaneous: ''
  },
  "JF4978": {
    id: "JF4978",
    accreditingbody: "Titan Partnership Ltd",
    provider: 'Titan Partnership Ltd',
    course: 'Upper Primary with Modern Foreign Languages (XR9C)',
    submittedDate: '2019-10-10',
    status: 'New',
    'personal-details': {
      'given-name': 'Kelly Jane',
      'family-name': 'Spears',
      'date-of-birth': '1997-04-09',
      nationality: 'British',
      'second-nationality': false
    },
    'contact-details': {
      tel: '07700 900202',
      email: 'kelly.spears@example.com',
      address: {
        line1: '44 Southend Avenue',
        line2: '',
        level2: 'Southampton',
        level1: '',
        'postal-code': 'SO1  8UZ'
      }
    },
    'reasonable-adjustments': 'I currently require use of a wheelchair, so any interview location needs to be accessible. I should be back on my feet by the time I begin my training.',
    'work-history': {
      1: {
        role: 'Care Partner',
        org: 'Premier Care',
        type: 'Full-time',
        description: 'I work with vulnerable elderly people who still live in their homes, and help them with daily tasks to maintain their independence. This role has taught me to be patient, caring and to communicate clearly and effectively.',
        'worked-with-children': 'No',
        category: 'job',
        'start-date': '2019-09-01',
        'end-date': false
      },
      2: {
        role: 'Holiday Club Play Leader',
        org: 'Play Club',
        type: 'Full-time',
        description: 'I worked at a summer holiday club facilitating activities for children aged 4 to 11 years old. I developed my presentation and public speaking skills through running activities for the children at the club. I also worked in a team with the other Play Leaders to ensure the smooth running of the club.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2019-07-01',
        'end-date': '2019-08-01'
      },
      3: {
        role: 'English Teacher',
        org: 'Jun Wu Primary School',
        type: 'Full-time',
        description: 'I taught English to Chinese children aged 5 to 7 years old. I learnt lots of teaching skills including presentation, clear communication and planning. These skills are vital for teaching.',
        'worked-with-children': 'Yes',
        category: 'job',
        'start-date': '2018-08-01',
        'end-date': '2019-06-01'
      },
      4: {
        category: 'break',
        duration: '3 years, 10 months',
        'start-date': '2014-10-01',
        'end-date': '2018-08-01'
      }
      // 4: {
      //   description: 'I studied A Levels from September 2013 until August 2015. I studied my BSc from September 2015 until July 2018.',
      //   category: 'break',
      //   duration: '3 years, 10 months',
      //   'start-date': '2014-10-01',
      //   'end-date': '2018-08-01'
      // }
    },
    'school-experience': {
      1: {
        role: 'Vice President of Student Society',
        org: 'Birmingham Mind Aware - mental health society',
        'worked-with-children': 'Yes',
        'start-date': '2017-03-01',
        'end-date': '2018-03-01',
        'time-commitment': 'Several hours each week alongside my degree studies.'
      },
      2: {
        role: 'Outreach Officer',
        org: 'Birmingham Chess Club - student society',
        'worked-with-children': 'Yes',
        'start-date': '2017-03-01',
        'end-date': '2018-03-01',
        'time-commitment': '3 hours a week.'
      },
      3: {
        role: 'Classroom Helper',
        org: 'Several schools in Southampton and Birmingham',
        'worked-with-children': 'Yes',
        'start-date': '2017-07-01',
        'end-date': '2019-07-01',
        'time-commitment': 'Roughly 2 or 3 days a month.'
      }
    },
    degree: {
      1: {
        type: 'BSc',
        subject: 'Psychology',
        org: 'University of Birmingham',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'Upper second (2:1)',
        year: '2018'
      }
    },
    gcse: {
      maths: {
        type: 'GCSE',
        subject: 'Maths',
        country: 'United Kingdom',
        missing: false,
        grade: 'A',
        year: '2013'
      },
      english: {
        type: 'GCSE',
        subject: 'English',
        country: 'United Kingdom',
        missing: false,
        grade: 'A*',
        year: '2013'
      },
      science: {
        type: 'GCSE',
        subject: 'Science',
        country: 'United Kingdom',
        missing: false,
        grade: 'A*',
        year: '2013'
      }
    },
    'other-qualifications': {
      1: {
        type: 'GCSE',
        subject: 'English Literature',
        org: 'Southampton High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2013'
      },
      2: {
        type: 'GCSE',
        subject: 'Geography',
        org: 'Southampton High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A*',
        year: '2013'
      },
      3: {
        type: 'GCSE',
        subject: 'Religious Studies',
        org: 'Southampton High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A*',
        year: '2013'
      },
      4: {
        type: 'GCSE',
        subject: 'French',
        org: 'Southampton High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2013'
      },
      5: {
        type: 'GCSE',
        subject: 'ICT',
        org: 'Southampton High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2013'
      },
      6: {
        type: 'GCSE',
        subject: 'Biology',
        org: 'Southampton High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A*',
        year: '2013'
      },
      7: {
        type: 'GCSE',
        subject: 'Chemistry',
        org: 'Southampton High School',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2013'
      },
      8: {
        type: 'A Level',
        subject: 'French',
        org: 'Southampton High School Sixth Form',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A*',
        year: '2015'
      },
      9: {
        type: 'A Level',
        subject: 'Psychology',
        org: 'Southampton High School Sixth Form',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'A',
        year: '2015'
      },
      10: {
        type: 'A Level',
        subject: 'Maths',
        org: 'Southampton High School Sixth Form',
        provenance: 'domestic',
        country: 'United Kingdom',
        grade: 'B',
        year: '2015'
      }
    },
    'language-skills': {
      'english-is-main': 'Yes',
      other: false,
      'english-qualifications': false
    },
    'personal-statement': {
      vocation: 'I want to be a teacher so that I can make a difference. My teachers have always been my role models. As a child, I thought that my teachers knew everything, and I was inspired by their knowledge. I felt motivated to continue learning by their obvious passion. Learning is an important life skill, and my teachers showed me that education is important in setting foundations for the future.\n\nTeaching is a challenging but rewarding profession, as teachers must have a range of skills and qualities. In my opinion, the most important quality of a teacher is to have a genuine desire to cater to every child’s individual needs.\n\nI have recently spent an academic year working in a primary school in Southern China, teaching English to Chinese children aged 5-7. I taught listening, reading, writing and speaking skills, but I felt that my main responsibility was to develop my students’ interest in learning English, as this is essential for their future success in the subject. I used interactive activities to demonstrate that learning is fun, and was particularly keen on encouraging learning through play, especially with very young students, as I know they can learn so much language through games and outings. Life in China was challenging, but the enthusiasm of my students motivated me to be the best teacher I could be. This role taught me so much. For example, it is essential to give concise and clear instructions for tasks, and provide examples if the task structure is new. It is also vital to create an atmosphere of respect in the classroom, so that students listen to the teacher and to each other.\n\nBefore I moved to China, I studied Psychology at the University of Birmingham. I picked modules related to child development and education, as I find this research fascinating. I am particularly interested in children and adolescents’ mental health, and chose this area for my final year research project. I also studied an additional module in the education department, which enabled me to complete assignments about teaching practices, technology in the classroom and reflecting on my teaching abilities. My favourite aspect of this module was the school-based placement. I spent one morning per week volunteering in a Year 1 class where I read with individual children and gave them feedback on their work. This was the best morning of my week!\n\nI have held several voluntary roles, including coaching at a lunchtime chess club, helping at a Brownies and GirlGuides unit, and completing short placements in primary schools. I learned vital skills for teaching, such as managing time effectively to ensure that  I interact with every child, as well as gaining ideas for activities to use in the classroom. These roles have helped to solidify my passion for teaching. I enjoy spending time with children, as I feel that I am a good role model and have a positive influence on them. My current employment involves helping elderly people to remain living in their homes by helping them with daily tasks and personal care. Whilst I love my job because I genuinely feel that I am making a difference, I miss working with children every day.\n\nI believe that I have the necessary skills and qualities to become an excellent primary teacher. Young children have contagious energy and excitement, and I would be privileged to train to be a teacher.',
      'subject-knowledge': 'Teaching in a Primary School is a challenging but rewarding profession. Teachers are enthusiastic and patient, because they must encourage students to always try their best and to persevere with their learning. Teachers are also resourceful, as they are able to teach challenging concepts in a fun and imaginative way, so that learning occurs organically. In my opinion, the most important quality of a teacher is to have a genuine desire to cater to every child’s individual needs.\n\nI have recently spent an academic year working in a primary school in Southern China, teaching English to Chinese children aged 5-7. I taught listening, reading, writing and speaking skills, but I felt that my main responsibility was to develop my students’ interest in learning English, as this is essential for their future success in the subject. I used interactive activities to demonstrate that learning is fun, and was particularly keen on encouraging learning through play, especially with very young students, as I know they can learn so much language through games and outings. Life in China was challenging, but the enthusiasm of my students motivated me to be the best teacher I could be.\n\nBefore I moved to China, I studied Psychology at the University of Birmingham. I picked modules related to child development and education, as I find this research fascinating. I am particularly interested in children and adolescents’ mental health, and chose this area for my final year research project. I also studied a module in the education department, which included a school placement. I volunteered in Year 1 reading with individual children and giving feedback on their work. This was the best morning of my week! I enjoy spending time with children, as I feel that I am a good role model and have a positive influence on them. My current employment involves helping elderly people to remain living in their homes by helping them with daily tasks and personal care. Whilst I love my job because I genuinely feel that I am making a difference, I miss working with children every day!\n\nI believe that I have the necessary skills and qualities to become an excellent primary teacher. I felt a genuine sense of achievement in my teaching job when my students used English outside the classroom. Young children have contagious energy and excitement, and I would be privileged to train to be a teacher.',
      interview: 'I am unable to attend an interview on Mondays, Tuesdays and Wednesdays due to current work commitments.'
    },
    references: {
      first: {
        status: 'received',
        type: 'School-based',
        name: 'Jane Smith',
        email: 'j.smith@junwu.edu.com',
        tel: '07700 900001',
        relationship: {
          summary: 'Jane was head of department over the 12 months I was employed as an English teacher at Jun Wu Primary School in Chengdu, China.',
          validated: true
        },
        safeguarding: {
          response: 'no'
        },
        comments: 'When we employed Kelly Jane Spears as a full-time teacher of English to our students (aged 7 to 11), we were immediately impressed by her knowledge of and passion for the English language.\n\n I can only compliment Kelly regarding her organisation, including time-keeping and lesson-planning. Her appreciation of the students’ needs, both academic and social and emotional, formed a solid base for differentiation according to the tasks at hand. Kelly showed her commitment to education and a great degree of care for the welfare of the students she worked with.\n\n Kelly was able to demonstrate great confidence in her work, be it teaching, giving advice during meetings or writing reports. This made her an invaluable member of our department’s team. Kelly was able to use different resources to assess, teach and to support students. She set appropriate targets and drew on effective strategies to help students to make progress, according to the pace of their learning.\n\n Kelly worked both as a team member and individually, showing initiative and supporting students both in lessons and outside of lessons. She excelled at helping the students sustain concentration and motivation. She also dedicated a great deal of her own resources to ensure that students achieved their best, both during lessons and small group sessions.\n\n It appears that studying and working in different environments, here in China and in the UK, has given Kelly valuable experience in working with different people. She was able to draw on this to enrich the life of the students in her care. Her enthusiasm, creativity and communication skills meant she was not only able to enhance our students’ learning, but also to build their emotional resilience and investment in their own learning.'
      },
      second: {
        status: 'received',
        type: 'School-based',
        name: 'Sam Fairey',
        email: 'sam.fairey@playclub.co.uk',
        tel: '07700 900002',
        relationship: {
          summary: 'Sam was my line manager at Play Club, where I worked full-time as a play leader for 4 to 11 year olds.',
          validated: true
        },
        safeguarding: {
          response: 'no'
        },
        comments: 'Kelly Jane Spears is very well-suited to teaching and working with children. She is caring, enthusiastic, encouraging, dedicated and kind. She is passionate about using play and the arts to develop children’s confidence, emotional intelligence and self-esteem, and her love of sharing that passion with others shines through. She is a great team member, and can also work independently, taking initiative to achieve results. She works well under pressure and is reliable, always fulfilling her tasks and going over and above. She has good literacy and numeracy, and as part of her role at our organisation, she was excellent with reception and administration responsibilities. As a play leader she is supportive, receptive and energetic. She interacts well with both staff and students, is responsible, and has strong communication skills. In terms of character, she is honest, hard-working and full of integrity. I highly recommend her and am confident she will be an excellent candidate. '
      }
    },
    miscellaneous: ''
  }
}
