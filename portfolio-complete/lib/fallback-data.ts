import type { PortfolioData } from "@/types/portfolio";
export const fallbackData: PortfolioData = {
  profile: {
    full_name: "Padma Kumari Talreja",
    professional_title: "Technical Analyst | QA Engineer | Manual & Automation Testing",
    short_intro:
      "Technical Analyst focused on software quality assurance, reliable user experiences, and systematic testing across banking and technology products.",
    biography:
      "Technical Analyst with experience in the banking and technology sector, currently working at Habib Metropolitan Bank. I enjoy Software Quality Assurance, particularly understanding how systems work, identifying gaps, and ensuring a reliable user experience. I approach challenges logically, pay close attention to detail, and enjoy collaborating with teams to solve problems and improve product quality. I am continuously learning and building my skills with the goal of growing as an SQA Engineer.",
    email: "Padmakumaritalreja@gmail.com",
    phone: "+923333578468",
    location: "Karachi, Pakistan",
    hero_text:
      "Quality engineering grounded in careful analysis, practical testing, and dependable delivery.",
  },

  experiences: [
    {
      position: "Technical Analyst | QA Analyst | Officer Grade III",
      organization: "HABIBMETRO Head Office",
      location: "Karachi, Pakistan",
      start_date: "2024-12-01",
      is_current: true,
      responsibilities: [
        "Analyze business requirements and translate them into technical and testing requirements for banking applications.",
        "Design, execute, and maintain test cases covering functional, regression, API, and UAT testing.",
        "Perform API testing using Postman and validate backend data using SQL.",
        "Conduct load and stress testing using Apache JMeter for Money Exchange, Home Remittance, and 1LINK.",
        "Test Core Banking, Digital Banking, B2B Portal, Money Exchange, and payment modules.",
        "Identify, document, and track defects while collaborating with development teams through resolution and retesting.",
        "Validate fixes and support application releases, deployments, and system enhancements.",
        "Maintain technical and testing documentation and collaborate with business and technical teams throughout the SDLC.",
      ],
      display_order: 1,
    },
  ],

  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution:
        "Shaheed Zulfikar Ali Bhutto Institute of Science & Technology",
      start_year: 2020,
      end_year: 2024,
      grade: "CGPA 3.17",
      description:
        "Relevant coursework: Data Structures and Algorithms, Design and Analysis of Algorithms, Database Systems, Artificial Intelligence, Data Science, Data Mining, Operating Systems, Software Engineering, Software Testing, Computer Networks, Hybrid Mobile Application Development, and UI/UX.",
      display_order: 1,
    },
  ],

  skillCategories: [
    {
      name: "Testing",
      display_order: 1,
      skills: [
        "Manual Testing",
        "Functional Testing",
        "Regression Testing",
        "Smoke Testing",
        "Sanity Testing",
        "UAT",
        "Exploratory Testing",
        "Web Testing",
        "Mobile Testing",
        "API Testing",
        "Integration Testing",
        "Unit Testing",
        "Test Case Design & Execution",
        "Performance Testing",
        "Load Testing",
        "Stress Testing",
      ].map((name, i) => ({ name, display_order: i + 1 })),
    },
    {
      name: "Automation",
      display_order: 2,
      skills: ["Playwright", "Selenium WebDriver", "TestNG", "JUnit"].map(
        (name, i) => ({ name, display_order: i + 1 })
      ),
    },
    {
      name: "Programming Languages",
      display_order: 3,
      skills: ["Java", "Python", "JavaScript"].map((name, i) => ({
        name,
        display_order: i + 1,
      })),
    },
    {
      name: "API & Data",
      display_order: 4,
      skills: [
        "Postman",
        "REST APIs",
        "JSON Validation",
        "SQL",
        "SQL Data Validation",
      ].map((name, i) => ({ name, display_order: i + 1 })),
    },
    {
      name: "Tools",
      display_order: 5,
      skills: [
        "Jira",
        "TestRail",
        "Git",
        "GitHub",
        "VS Code",
        "Maven",
        "Apache JMeter",
        "MySQL",
        "IntelliJ IDEA",
        "MS Office",
      ].map((name, i) => ({ name, display_order: i + 1 })),
    },
    {
      name: "Methodologies & Concepts",
      display_order: 6,
      skills: [
        "Agile",
        "Scrum",
        "SDLC",
        "STLC",
        "Bug Life Cycle",
        "Test Design Techniques",
        "CI/CD Concepts",
        "Requirement Analysis",
        "Technical Documentation",
      ].map((name, i) => ({ name, display_order: i + 1 })),
    },
  ],

  projects: [
    {
      title: "DVAGO Web Application Testing",
      slug: "dvago-web-application-testing",
      description:
        "End-to-end quality assurance of shopping cart, checkout, and product search workflows.",
      full_description:
        "Created and executed 40+ test cases covering shopping cart, checkout, and product search functionality. Identified and documented defects, verified fixes through regression testing, performed functional, usability, and compatibility testing across multiple browsers and devices, and prepared test documentation including test cases and execution results.",
      technologies: [
        "Manual Testing",
        "Regression Testing",
        "Cross-browser Testing",
        "Test Documentation",
      ],
      category: "Testing / QA",
      featured: true,
      display_order: 1,
    },
  ],

  publications: [],

  certifications: [
    {
      name: "The Complete 2025 Software Testing Bootcamp",
      organization: "Udemy",
      issue_date: "2025-07-01",
      display_order: 1,
    },
    {
      name: "Database Competition",
      organization: "ZAB E-Fest",
      description: "Participated in the database competition.",
      display_order: 2,
    },
    {
      name: "UI/UX",
      organization: "Great Learning",
      display_order: 3,
    },
  ],

  awards: [],

  socialLinks: [],

  settings: {
    site_title: "Padma Kumari Talreja | QA Engineer Portfolio",
    meta_description:
      "Portfolio of Padma Kumari Talreja, Technical Analyst and QA Engineer specializing in manual, automation, API, performance, and banking application testing.",
    logo_text: "PKT",
    footer_text: "Built for clarity, quality, and continuous improvement.",
    seo_keywords: [
      "QA Engineer",
      "Technical Analyst",
      "Software Testing",
      "Automation Testing",
      "Karachi",
    ],
  },

  services: [
    {
      title: "Manual Testing",
      description:
        "Comprehensive manual testing including functional, regression, smoke, sanity, UAT, and exploratory testing for web and mobile applications.",
      icon: "🧪",
      display_order: 1,
      is_public: true,
    },
    {
      title: "API Testing",
      description:
        "End-to-end API validation using Postman — verifying endpoints, payloads, status codes, and backend data integrity with SQL.",
      icon: "🔗",
      display_order: 2,
      is_public: true,
    },
    {
      title: "Performance Testing",
      description:
        "Load and stress testing with Apache JMeter to evaluate system behavior under high traffic and identify bottlenecks before production.",
      icon: "⚡",
      display_order: 3,
      is_public: true,
    },
    {
      title: "Test Automation",
      description:
        "Automated test suite development using Playwright and Selenium WebDriver for reliable regression coverage.",
      icon: "🤖",
      display_order: 4,
      is_public: true,
    },
    {
      title: "Test Documentation",
      description:
        "Writing clear, structured test plans, test cases, and defect reports that support effective communication across development and business teams.",
      icon: "📋",
      display_order: 5,
      is_public: true,
    },
    {
      title: "QA Consulting",
      description:
        "Helping teams define quality processes, review test strategies, and improve software delivery through systematic quality assurance practices.",
      icon: "💡",
      display_order: 6,
      is_public: true,
    },
  ],

  testimonials: [],
  contactInfo: {
    phone:          "+923333578468",
    email:          "Padmakumaritalreja@gmail.com",
    address:        "Karachi, Pakistan",
    business_hours: null,
    social_links:   [],
    is_public:      true,
  },
};
