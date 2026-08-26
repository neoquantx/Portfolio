export const portfolioData = {
  personal: {
    name: 'Himanshu Nikam',
    title: 'Software Engineer',
    tagline: 'Building the future, one line of code at a time',
    bio: 'A passionate Computer Science Engineering student driven by innovation and a love for building impactful software solutions. From full-stack web applications to algorithm visualizers, I thrive on turning complex ideas into elegant digital experiences.',
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
    { name: 'Python', category: 'Core', level: 75 },
    { name: 'C', category: 'Core', level: 70 },
    { name: 'DSA', category: 'Core', level: 75 },
    { name: 'OS Concepts', category: 'Core', level: 65 },
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
    {
      id: 'sih-2024',
      title: 'Smart India Hackathon (SIH) 2024',
      role: 'Participant',
      description: 'National level hackathon organized by MoE. Built innovative solutions for real-world problem statements under time constraints.',
      tags: ['Problem Solving', 'Teamwork', 'Innovation'],
      certificate_url: null, // TODO: Add your certificate image path here (e.g., '/certificates/sih-2024.jpg')
      date: '2024'
    },
    {
      id: 'vyuhatech-2025',
      title: 'Vyuhatech Hackathon 2025',
      role: 'Participant',
      description: 'Intense technical hackathon focused on modern web and cloud technologies. Prototyped full-stack applications.',
      tags: ['Web Dev', 'Rapid Prototyping'],
      certificate_url: null, // TODO: Add your certificate image path here
      date: '2025'
    },
    {
      id: 'sih-2025',
      title: 'Smart India Hackathon (SIH) 2025',
      role: 'Participant',
      description: 'Continuing the journey of solving complex national challenges through scalable system design and architecture.',
      tags: ['Full Stack', 'System Design'],
      certificate_url: null, // TODO: Add your certificate image path here
      date: '2025'
    },
    {
      id: 'dsa-2025',
      title: 'DSA Hackathon — CMRIT CSE 2025',
      role: 'Competitor',
      description: 'College-level competitive programming hackathon focusing on Data Structures and Algorithms optimization.',
      tags: ['Algorithms', 'Data Structures', 'Logic'],
      certificate_url: null, // TODO: Add your certificate image path here
      date: '2025'
    },
    {
      id: 'meta-pytorch-2026',
      title: 'Meta PyTorch OpenEnv Hackathon X Scaler 2026',
      role: 'Participant',
      description: 'Advanced machine learning hackathon building AI environments and models utilizing the PyTorch ecosystem.',
      tags: ['PyTorch', 'Machine Learning', 'AI'],
      certificate_url: null, // TODO: Add your certificate image path here
      date: '2026'
    }
  ]
};
