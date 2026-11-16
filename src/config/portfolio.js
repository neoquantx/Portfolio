export const portfolioData = {
  personal: {
    name: 'Himanshu Nikam',
    title: 'Software Engineer', // TODO: Update to your exact role/tagline e.g. "Full Stack Engineer & ML Enthusiast"
    tagline: 'I build systems that think, scale, and ship.',
    bio: '7th-semester CSE undergraduate who builds full-stack products end to end and ships interactive tools people can actually use. Hacktoberfest 2026 Completionist++ — 1 of 503 out of 115,385 participants worldwide. Meta PyTorch OpenEnv Finalist — Top 800 of 31,000+ teams. III Place, DSA Hackathon. Open to remote, hybrid, and onsite software development roles.',
    email: 'himanshunikam1817@gmail.com',
    phone: '+91 8737923714',
    location: 'Bengaluru, Karnataka',
    resumeUrl: '/resume.pdf' // TODO: Add your actual resume PDF to /public/resume.pdf
  },
  socials: [
    { name: 'GitHub', url: 'https://github.com/neoquantx', icon: 'Github' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/himanshu-nikam-2aa40b247/', icon: 'Linkedin' },
    { name: 'LeetCode', url: 'https://leetcode.com/u/Himanshu_1817/', icon: 'Code2' },
    { name: 'Email', url: 'mailto:himanshunikam1817@gmail.com', icon: 'Mail' }
  ],
  projects: [
    {
      id: 1,
      title: 'Smart Assignment System',
      description: 'A full-stack assignment management platform enabling students to submit assignments and teachers to evaluate them. Features JWT-based auth with role-based access, file uploads for PDF/DOCX submissions, and RESTful API design.',
      techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Tailwind CSS'],
      formula: 'Re·Nd·Ex·Mg·JWT·TW',
      github: 'https://github.com/neoquantx', // TODO: Replace with actual repo URL e.g. 'https://github.com/neoquantx/smart-assignment-system'
      live: null, // TODO: Add live URL once deployed e.g. 'https://smart-assign.vercel.app'
      category: 'fullstack'
    },
    {
      id: 2,
      title: "Banker's Algorithm Simulator",
      description: 'An interactive web-based simulator demonstrating deadlock avoidance in operating systems. Features dynamic matrix generation for Allocation, Max, Need, and Total Resources with real-time input validation and visual safe/unsafe status indicators.',
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'DOM Manipulation', 'Algorithm Viz'],
      formula: 'H5·C3·JS·DOM·Algo',
      github: 'https://github.com/neoquantx', // TODO: Replace with actual repo URL
      live: null, // TODO: Add live URL once deployed
      category: 'frontend'
    },
    {
      id: 3,
      title: 'Abhiyan Education Consultancy',
      description: 'A comprehensive web application for education consultancy to streamline student admissions, information management, and service delivery. Built with Firebase for scalable real-time database operations, authentication, and lead management.',
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'Firebase', 'Authentication'],
      formula: 'H5·C3·JS·🔥·Auth',
      github: 'https://github.com/neoquantx', // TODO: Replace with actual repo URL
      live: null, // TODO: Add live URL once deployed
      category: 'fullstack'
    }
  ],
  skills: [
    // Frontend
    { name: 'HTML/CSS', category: 'Frontend', level: 90 },
    { name: 'JavaScript', category: 'Frontend', level: 90 },
    { name: 'React.js', category: 'Frontend', level: 85 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 85 },

    // Backend
    { name: 'Node.js', category: 'Backend', level: 80 },
    { name: 'Express.js', category: 'Backend', level: 80 },
    { name: 'REST APIs', category: 'Backend', level: 80 },

    // Machine Learning & AI
    { name: 'Python', category: 'ML & AI', level: 75 },
    { name: 'PyTorch', category: 'ML & AI', level: 60 },
    { name: 'Scikit-learn', category: 'ML & AI', level: 55 },
    { name: 'Neural Networks', category: 'ML & AI', level: 55 },
    { name: 'Computer Vision', category: 'ML & AI', level: 50 },
    { name: 'Model Training', category: 'ML & AI', level: 55 },

    // Mobile Development
    { name: 'React Native', category: 'Mobile', level: 70 },
    { name: 'Expo', category: 'Mobile', level: 65 },
    { name: 'Mobile UI/UX', category: 'Mobile', level: 65 },

    // Databases & Cloud
    { name: 'MongoDB', category: 'Cloud & DB', level: 75 },
    { name: 'Firebase', category: 'Cloud & DB', level: 75 },
    { name: 'SQL', category: 'Cloud & DB', level: 70 },
    { name: 'Supabase', category: 'Cloud & DB', level: 50 },

    // DevOps & Deployment
    { name: 'Git/GitHub', category: 'DevOps', level: 85 },
    { name: 'CI/CD Pipelines', category: 'DevOps', level: 55 },
    { name: 'Docker', category: 'DevOps', level: 45 },

    // Core Engineering
    { name: 'Java', category: 'Core', level: 85 },
    { name: 'C', category: 'Core', level: 70 },
    { name: 'DSA', category: 'Core', level: 75 },
    { name: 'OS Concepts', category: 'Core', level: 65 },
  ],
  timeline: [
    { year: '2026', event: 'Hacktoberfest 2026 Completionist++', description: '1 of 503 out of 115,385 participants, MLH x DEV (Oct 11, 2026) — 27 of 29 stickers', type: 'achievement' },
    { year: '2026', event: 'Hacktoberfest 2026 Completionist', description: 'Open-source completion, MLH x DEV (Oct 9, 2026)', type: 'achievement' },
    { year: '2026', event: 'Cognizant Technoverse Hackathon', description: 'Cognizant India Technoverse Hackathon 2026', type: 'achievement' },
    { year: '2026', event: 'Think Build Showcase — 2nd Place', description: 'Velocity-Agent mini-project exhibition, CMRIT (Apr 30, 2026)', type: 'achievement' },
    { year: '2026', event: 'MLOps End-to-End Workshop', description: '6-day hands-on workshop, CSE CMRIT (Apr 20–25, 2026)', type: 'certification' },
    { year: '2026', event: 'Meta PyTorch — Top 800 Finalist', description: 'Finalist card, 31,000+ teams, Meta OpenEnv x Scaler, Bengaluru (Apr 25–26, 2026)', type: 'achievement' },
    { year: '2026', event: 'Meta PyTorch — Round 1 Qualified', description: 'Qualified Round 1, Meta PyTorch OpenEnv x Scaler (Apr 25–26, 2026)', type: 'achievement' },
    { year: '2026', event: 'Codestorm 2026 AI Hackathon', description: 'AI hackathon by Unlox at CMRIT (Apr 1, 2026)', type: 'achievement' },
    { year: '2026', event: 'Mega Hackathon — BMSCE', description: 'Protocol Club x Team Codelocked, B.M.S. College (Mar 13–14, 2026)', type: 'achievement' },
    { year: '2026', event: 'SQL (Basic) — HackerRank', description: 'Passed HackerRank skill certification test (Feb 21, 2026)', type: 'certification' },
    { year: '2025', event: 'ML for All — Coursera', description: 'Machine Learning for All, University of London, Coursera (Oct 27, 2025)', type: 'certification' },
    { year: '2025', event: 'DSA Hackathon — III Place Win', description: '6-hour DSA Hackathon III Place, Team byte_X, CSE CMRIT (Sep 10, 2025)', type: 'achievement' },
    { year: '2025', event: 'Internal SIH-2025 — CMRIT', description: 'Internal SIH-2025 participation, CMRIT (Sep 24–25, 2025)', type: 'achievement' },
    { year: '2025', event: 'Foundation of AI and ML — Udemy', description: 'Foundation of AI and Machine Learning, Udemy (May 11, 2025)', type: 'certification' },
    { year: '2025', event: 'Lead Coordinator — Cultura', description: 'Led RARE Club Events at Annual Techno-Cultural Fest', type: 'leadership' },
    { year: '2024', event: 'Java Basics — MindLuster', description: 'Java Basics for Beginners, 75 hours, MindLuster (Dec 2, 2024)', type: 'certification' },
    { year: '2024', event: 'Internal SIH — Preliminary Round', description: 'Internal hackathon preliminary for SIH 2024, CMRIT (Sep 5, 2024)', type: 'achievement' },
    { year: '2024', event: 'BGMI — SAMBHRAM 24 (RVITM)', description: 'BGMI participation with team, RV Institute of Technology and Management (May 29, 2024)', type: 'achievement' },
    { year: '2024', event: 'RARE Club Technical Team', description: 'Technical Team Member at CMRIT', type: 'activity' },
    { year: '2023', event: 'Complete Python Developer — Udemy', description: 'Complete Python Developer 2023: Zero to Mastery, 31 hours, Udemy (Dec 27, 2023)', type: 'certification' },
    { year: '2023', event: 'Started B.E. in CSE', description: 'CMR Institute of Technology, Bengaluru — CGPA: 8.43', type: 'education' },
    { year: '2022', event: '12th Grade — 90.2%', description: 'Vanita Public School, Varanasi', type: 'education' },
    { year: '2020', event: '10th Grade — 88.8%', description: 'Sant Atulanand Residential Academy, Varanasi', type: 'education' }
  ],
  certifications: [
    { name: 'Hacktoberfest 2026 Completionist++', issuer: 'Hacktoberfest (MLH x DEV)', date: 'October 2026', file: '/certificates/hacktoberfest-2026-completionist-plus-plus-certificate-2026.png' },
    { name: 'Hacktoberfest 2026 Completionist', issuer: 'Hacktoberfest (MLH x DEV)', date: 'October 2026', file: '/certificates/hacktoberfest-2026-completionist-certificate-2026.png' },
    { name: 'SQL (Basic)', issuer: 'HackerRank', date: 'February 2026', file: '/certificates/HackerRank-SQL-Basic.png' },
    { name: 'Machine Learning for All', issuer: 'Coursera — University of London', date: 'October 2025', file: '/certificates/Coursera-ML-for-All.png' },
    { name: 'Foundation of AI and Machine Learning', issuer: 'Udemy', date: 'May 2025', file: '/certificates/Udemy-Foundation-AI-ML.png' },
    { name: 'Java Basics for Beginners', issuer: 'MindLuster', date: 'December 2024', file: '/certificates/Mindluster-Java-Basics.png' },
    { name: 'Complete Python Developer 2023: Zero to Mastery', issuer: 'Udemy', date: 'December 2023', file: '/certificates/Udemy-Complete-Python.png' }
  ],
  hackathons: [
    {
      id: 'hacktoberfest-2026-plus-plus',
      category: 'certificates',
      title: 'Hacktoberfest 2026 Completionist++',
      role: 'Completionist++',
      description: 'Top-tier open-source completion under MLH x DEV (DigitalOcean presenting partner). 1 of 503 Completionist++ out of 115,385 participants worldwide. Finished with 27 of 29 stickers.',
      tags: ['Open Source', 'MLH', 'DEV'],
      certificate_url: '/certificates/hacktoberfest-2026-completionist-plus-plus-certificate-2026.png',
      date: 'October 2026'
    },
    {
      id: 'hacktoberfest-2026-completionist',
      category: 'certificates',
      title: 'Hacktoberfest 2026 Completionist',
      role: 'Completionist',
      description: 'Open-source completion under MLH x DEV (DigitalOcean presenting partner) on October 9, 2026. Stepping stone to Completionist++ two days later.',
      tags: ['Open Source', 'MLH', 'DEV'],
      certificate_url: '/certificates/hacktoberfest-2026-completionist-certificate-2026.png',
      date: 'October 2026'
    },
    {
      id: 'hacktoberfest-2026-sticker-book',
      category: 'beyond',
      title: 'Hacktoberfest 2026 Sticker Book (27/29)',
      role: 'Collector',
      description: 'Hacktoberfest 26 sticker book showing 27 of 29 stickers earned. Visual proof of breadth across merged contributions.',
      tags: ['Open Source', 'MLH', 'DEV'],
      certificate_url: '/certificates/hacktoberfest-2026-sticker-book.png',
      date: 'October 2026'
    },
    {
      id: 'cognizant-technoverse-2026',
      category: 'hackathons',
      title: 'Cognizant Technoverse Hackathon 2026',
      role: 'Participant',
      description: 'Corporate hackathon by Cognizant India. MNC-backed problem solving under enterprise constraints.',
      tags: ['Enterprise', 'Problem Solving'],
      certificate_url: '/certificates/participation-cert-ce2f3837.png',
      date: '2026'
    },
    {
      id: 'showcase-2026',
      category: 'hackathons',
      title: 'Think Build Showcase 2026 — 2nd Place',
      role: '2nd Place',
      description: 'Second place in the VI Semester college mini-project exhibition at CMRIT (April 30, 2026). Presented "Velocity-Agent as a Service — Autonomous Digital Marketing for Every Business" under Ms Pooja Goud.',
      tags: ['2nd Place', 'Mini-Project', 'Innovation'],
      certificate_url: '/certificates/Second-Himanshu-Nikam-Showcase.png',
      date: 'April 2026'
    },
    {
      id: 'mlops-workshop-2026',
      category: 'workshops',
      title: 'MLOps End-to-End Workshop (6 Days, CMRIT)',
      role: 'Participant',
      description: '6-day hands-on workshop on MLOps workflow from model development to deployment. Organized by CSE, CMR Institute of Technology (April 20–25, 2026).',
      tags: ['MLOps', 'Deployment', 'Python'],
      certificate_url: '/certificates/Himanshu Nikam_Workshop.png',
      date: 'April 2026'
    },
    {
      id: 'meta-pytorch-finalist-2026',
      category: 'hackathons',
      title: 'Meta PyTorch OpenEnv — Top 800 Finalist',
      role: 'Finalist',
      description: 'Made it to the finale. Out of 31,000+ registered teams, team reached the top 800 finalists at Meta OpenEnv x Scaler, Bengaluru (April 25–26).',
      tags: ['PyTorch', 'Machine Learning', 'AI'],
      certificate_url: '/certificates/FinalistCard-Top800-Finalist.png',
      date: 'April 2026'
    },
    {
      id: 'meta-pytorch-round1-2026',
      category: 'hackathons',
      title: 'Meta PyTorch OpenEnv — Round 1 Qualified',
      role: 'Round 1 Qualified',
      description: 'Qualified Round 1 of the Meta PyTorch OpenEnv Hackathon x Scaler School of Technology (April 25–26, 2026) for strong technical proficiency.',
      tags: ['PyTorch', 'Machine Learning', 'AI'],
      certificate_url: '/certificates/FinalistCard_Himanshu Nikam.png',
      date: 'April 2026'
    },
    {
      id: 'codestorm-2026',
      category: 'hackathons',
      title: 'Codestorm 2026 — AI Hackathon (Unlox, CMRIT)',
      role: 'Participant',
      description: 'AI hackathon by Unlox at CMRIT (April 1, 2026). Practical exposure to AI-powered learning systems and professional work environments.',
      tags: ['AI', 'Problem Solving'],
      certificate_url: '/certificates/Himanshu Nikam-Codestorm.png',
      date: 'April 2026'
    },
    {
      id: 'mega-hackathon-2026',
      category: 'hackathons',
      title: 'Mega Hackathon 2026 — B.M.S. College (Protocol Club)',
      role: 'Participant',
      description: 'Two-day mega hackathon hosted by Protocol Club with Team Codelocked at B.M.S. College of Engineering, Bengaluru (March 13–14, 2026).',
      tags: ['Problem Solving', 'Teamwork'],
      certificate_url: '/certificates/Himanshu Nikam-Mega-Hackathon.png',
      date: 'March 2026'
    },
    {
      id: 'sql-basic-2026',
      category: 'certificates',
      title: 'SQL (Basic) — HackerRank',
      role: 'Certified',
      description: 'Passed the HackerRank SQL (Basic) skill certification test (February 21, 2026). ID: 920COC27EC05.',
      tags: ['SQL', 'HackerRank', 'Certification'],
      certificate_url: '/certificates/HackerRank-SQL-Basic.png',
      date: 'February 2026'
    },
    {
      id: 'coursera-ml-2025',
      category: 'certificates',
      title: 'Machine Learning for All — Coursera',
      role: 'Certified',
      description: 'Machine Learning for All, University of London via Coursera (October 27, 2025). Prof Marco Gillies.',
      tags: ['Machine Learning', 'Coursera', 'Certification'],
      certificate_url: '/certificates/Coursera-ML-for-All.png',
      date: 'October 2025'
    },
    {
      id: 'dsa-win-2025',
      category: 'hackathons',
      title: 'DSA Hackathon — III Place Win (CMRIT)',
      role: 'III Place',
      description: 'Won III Place in the 6-hour Data Structures and Algorithms Hackathon, CSE CMRIT (September 10, 2025). Team byte_X, USN 1CR23CS070, WIN03/0003.',
      tags: ['Algorithms', 'Data Structures', 'Win'],
      certificate_url: '/certificates/DSA-Hackathon-III-Place.png', // clean-path copy; original Screenshot file kept untouched on disk
      date: 'September 2025'
    },
    {
      id: 'udemy-ai-2025',
      category: 'certificates',
      title: 'Foundation of AI and Machine Learning — Udemy',
      role: 'Certified',
      description: 'Foundation of AI and Machine Learning, Udemy (May 11, 2025). Instructors Irlon Terblanche, Peter Alkema.',
      tags: ['AI', 'Machine Learning', 'Certification'],
      certificate_url: '/certificates/Udemy-Foundation-AI-ML.png',
      date: 'May 2025'
    },
    {
      id: 'vyuhatech-2025',
      category: 'hackathons',
      title: 'Vyuhatech Hackathon 2025',
      role: 'Participant',
      description: 'Intense technical hackathon focused on modern web and cloud technologies. Prototyped full-stack applications.',
      tags: ['Web Dev', 'Rapid Prototyping'],
      certificate_url: null,
      date: '2025'
    },
    {
      id: 'sih-2025',
      category: 'hackathons',
      title: 'Internal SIH-2025 — CMRIT',
      role: 'Participant',
      description: 'Internal SIH-2025 at CMRIT (September 24–25, 2025). 3rd year CSE, USN 1CR23CS070. Organized under MoE Innovation Cell / Smart India Hackathon 2025.',
      tags: ['Full Stack', 'System Design', 'SIH'],
      certificate_url: '/certificates/SIH-2025-Internal.png',
      date: 'September 2025'
    },
    {
      id: 'java-mindluster-2024',
      category: 'certificates',
      title: 'Java Basics for Beginners — MindLuster',
      role: 'Certified',
      description: 'Java Basics for Beginners, 75 hours, MindLuster (December 2, 2024). Certified No. 111b8452.',
      tags: ['Java', 'Certification', 'Backend'],
      certificate_url: '/certificates/Mindluster-Java-Basics.png',
      date: 'December 2024'
    },
    {
      id: 'sih-2024-internal',
      category: 'hackathons',
      title: 'Internal SIH 2024 — Preliminary Round (CMRIT)',
      role: 'Participant',
      description: 'Internal hackathon at CMRIT as the preliminary round for Smart India Hackathon 2024 (MoE Innovation Cell, September 5, 2024).',
      tags: ['Problem Solving', 'Teamwork', 'Innovation'],
      certificate_url: '/certificates/Internal SIH Certificates 2024.png',
      date: 'September 2024'
    },
    {
      id: 'bgmi-sambhram-2024',
      category: 'beyond',
      title: 'BGMI — SAMBHRAM 24 (RVITM)',
      role: 'Participant',
      description: 'BGMI participation with team at RV Institute of Technology and Management as part of SAMBHRAM 24 (May 29, 2024).',
      tags: ['Teamwork', 'College Fest'],
      certificate_url: '/certificates/BGMI-SAMBHRAM24.png',
      date: 'May 2024'
    },
    {
      id: 'python-udemy-2023',
      category: 'certificates',
      title: 'Complete Python Developer — Udemy',
      role: 'Certified',
      description: 'Complete Python Developer in 2023: Zero to Mastery, 31 hours, Udemy (December 27, 2023). Instructor Andrei Neagoie.',
      tags: ['Python', 'Certification', 'Programming'],
      certificate_url: '/certificates/Udemy-Complete-Python.png',
      date: 'December 2023'
    }
  ]
};
