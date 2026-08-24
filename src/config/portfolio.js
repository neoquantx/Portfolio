export const portfolioData = {
  personal: {
    name: 'Himanshu Nikam',
    title: 'Software Engineer',
    tagline: 'Building the future, one line of code at a time',
    bio: 'A passionate Computer Science Engineering student at CMRIT, Bengaluru, driven by innovation and a love for building impactful software solutions. From full-stack web applications to algorithm visualizers, I thrive on turning complex ideas into elegant digital experiences.',
    email: 'himanshunikam1817@gmail.com',
    phone: '+91 8737923714',
    location: 'Bengaluru, Karnataka',
    resumeUrl: '/resume.pdf'
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
      github: 'https://github.com/neoquantx',
      live: null,
      category: 'fullstack'
    },
    {
      id: 2,
      title: "Banker's Algorithm Simulator",
      description: 'An interactive web-based simulator demonstrating deadlock avoidance in operating systems. Features dynamic matrix generation for Allocation, Max, Need, and Total Resources with real-time input validation and visual safe/unsafe status indicators.',
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'DOM Manipulation', 'Algorithm Viz'],
      formula: 'H5·C3·JS·DOM·Algo',
      github: 'https://github.com/neoquantx',
      live: null,
      category: 'frontend'
    },
    {
      id: 3,
      title: 'Abhiyan Education Consultancy',
      description: 'A comprehensive web application for education consultancy to streamline student admissions, information management, and service delivery. Built with Firebase for scalable real-time database operations, authentication, and lead management.',
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'Firebase', 'Authentication'],
      formula: 'H5·C3·JS·🔥·Auth',
      github: 'https://github.com/neoquantx',
      live: null,
      category: 'fullstack'
    }
  ],
  skills: [
    { name: 'Java', category: 'language', level: 85 },
    { name: 'Python', category: 'language', level: 75 },
    { name: 'C', category: 'language', level: 70 },
    { name: 'JavaScript', category: 'language', level: 90 },
    { name: 'React', category: 'framework', level: 85 },
    { name: 'React Native', category: 'framework', level: 70 },
    { name: 'Next.js', category: 'framework', level: 65 },
    { name: 'Node.js', category: 'backend', level: 80 },
    { name: 'Express.js', category: 'backend', level: 80 },
    { name: 'MongoDB', category: 'database', level: 75 },
    { name: 'Firebase', category: 'database', level: 75 },
    { name: 'SQL', category: 'database', level: 70 },
    { name: 'HTML/CSS', category: 'frontend', level: 90 },
    { name: 'Tailwind CSS', category: 'frontend', level: 85 },
    { name: 'Git/GitHub', category: 'tools', level: 85 },
    { name: 'REST APIs', category: 'backend', level: 80 }
  ],
  timeline: [
    { year: '2020', event: '10th Grade — 88.8%', description: 'Sant Atulanand Residential Academy, Varanasi', type: 'education' },
    { year: '2022', event: '12th Grade — 90.2%', description: 'Vanita Public School, Varanasi', type: 'education' },
    { year: '2023', event: 'Started B.E. in CSE', description: 'CMR Institute of Technology, Bengaluru — CGPA: 8.43', type: 'education' },
    { year: '2024', event: 'Smart India Hackathon', description: 'Participated in SIH 2024', type: 'achievement' },
    { year: '2024', event: 'RARE Club Technical Team', description: 'Technical Team Member at CMRIT', type: 'activity' },
    { year: '2024', event: 'Java Certification', description: 'Certified in Java Basics — MindLuster', type: 'certification' },
    { year: '2025', event: 'Lead Coordinator — Cultura', description: 'Led RARE Club Events at Annual Techno-Cultural Fest', type: 'leadership' },
    { year: '2025', event: 'Multiple Hackathons', description: 'Vyuhatech, SIH 2025, DSA Hackathon at CMRIT', type: 'achievement' },
    { year: '2025', event: 'ML Certification', description: 'Machine Learning for All — Coursera', type: 'certification' },
    { year: '2026', event: 'Meta PyTorch Hackathon', description: 'Meta PyTorch OpenEnv Hackathon X Scaler School of Technology', type: 'achievement' }
  ],
  certifications: [
    { name: 'Java Basics for Beginners', issuer: 'MindLuster', date: 'December 2024' },
    { name: 'Machine Learning for All', issuer: 'Coursera', date: 'October 2025' }
  ],
  hackathons: [
    'Smart India Hackathon (SIH) 2024',
    'Vyuhatech Hackathon 2025',
    'Smart India Hackathon (SIH) 2025',
    'DSA Hackathon — CMRIT CSE 2025',
    'Meta PyTorch OpenEnv Hackathon X Scaler 2026'
  ]
};
