/**
 * Seed script — populates all Neon tables from the canonical fallback data.
 * Safe to run multiple times (ON CONFLICT DO NOTHING).
 * Run: node scripts/seed.mjs
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL =
  "postgresql://neondb_owner:npg_V4LijBMD8RfN@ep-billowing-sunset-b5faxsh2-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString: DATABASE_URL });

// ─── Seed data (mirrors lib/fallback-data.ts exactly) ────────────────────────

const profile = {
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
  is_public: true,
  display_order: 1,
};

const settings = {
  site_title: "Padma Kumari Talreja | QA Engineer Portfolio",
  meta_description:
    "Portfolio of Padma Kumari Talreja, Technical Analyst and QA Engineer specializing in manual, automation, API, performance, and banking application testing.",
  logo_text: "PKT",
  footer_text: "Built for clarity, quality, and continuous improvement.",
  seo_keywords: ["QA Engineer", "Technical Analyst", "Software Testing", "Automation Testing", "Karachi"],
  is_public: true,
  display_order: 1,
};

const experiences = [
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
    achievements: [],
    is_public: true,
    display_order: 1,
  },
];

const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "Shaheed Zulfikar Ali Bhutto Institute of Science & Technology",
    start_year: 2020,
    end_year: 2024,
    grade: "CGPA 3.17",
    description:
      "Relevant coursework: Data Structures and Algorithms, Design and Analysis of Algorithms, Database Systems, Artificial Intelligence, Data Science, Data Mining, Operating Systems, Software Engineering, Software Testing, Computer Networks, Hybrid Mobile Application Development, and UI/UX.",
    achievements: [],
    is_public: true,
    display_order: 1,
  },
];

const skillCategories = [
  {
    name: "Testing",
    display_order: 1,
    skills: [
      "Manual Testing", "Functional Testing", "Regression Testing", "Smoke Testing",
      "Sanity Testing", "UAT", "Exploratory Testing", "Web Testing", "Mobile Testing",
      "API Testing", "Integration Testing", "Unit Testing", "Test Case Design & Execution",
      "Performance Testing", "Load Testing", "Stress Testing",
    ],
  },
  {
    name: "Automation",
    display_order: 2,
    skills: ["Playwright", "Selenium WebDriver", "TestNG", "JUnit"],
  },
  {
    name: "Programming Languages",
    display_order: 3,
    skills: ["Java", "Python", "JavaScript"],
  },
  {
    name: "API & Data",
    display_order: 4,
    skills: ["Postman", "REST APIs", "JSON Validation", "SQL", "SQL Data Validation"],
  },
  {
    name: "Tools",
    display_order: 5,
    skills: ["Jira", "TestRail", "Git", "GitHub", "VS Code", "Maven", "Apache JMeter", "MySQL", "IntelliJ IDEA", "MS Office"],
  },
  {
    name: "Methodologies & Concepts",
    display_order: 6,
    skills: [
      "Agile", "Scrum", "SDLC", "STLC", "Bug Life Cycle",
      "Test Design Techniques", "CI/CD Concepts", "Requirement Analysis", "Technical Documentation",
    ],
  },
];

const projects = [
  {
    title: "DVAGO Web Application Testing",
    slug: "dvago-web-application-testing",
    description:
      "End-to-end quality assurance of shopping cart, checkout, and product search workflows.",
    full_description:
      "Created and executed 40+ test cases covering shopping cart, checkout, and product search functionality. Identified and documented defects, verified fixes through regression testing, performed functional, usability, and compatibility testing across multiple browsers and devices, and prepared test documentation including test cases and execution results.",
    technologies: ["Manual Testing", "Regression Testing", "Cross-browser Testing", "Test Documentation"],
    category: "Testing / QA",
    featured: true,
    is_public: true,
    display_order: 1,
  },
];

const certifications = [
  {
    name: "The Complete 2025 Software Testing Bootcamp",
    organization: "Udemy",
    issue_date: "2025-07-01",
    is_public: true,
    display_order: 1,
  },
  {
    name: "Database Competition",
    organization: "ZAB E-Fest",
    description: "Participated in the database competition.",
    is_public: true,
    display_order: 2,
  },
  {
    name: "UI/UX",
    organization: "Great Learning",
    is_public: true,
    display_order: 3,
  },
];

const services = [
  {
    title: "Manual Testing",
    description:
      "Comprehensive manual testing including functional, regression, smoke, sanity, UAT, and exploratory testing for web and mobile applications.",
    icon: "🧪",
    is_public: true,
    display_order: 1,
  },
  {
    title: "API Testing",
    description:
      "End-to-end API validation using Postman — verifying endpoints, payloads, status codes, and backend data integrity with SQL.",
    icon: "🔗",
    is_public: true,
    display_order: 2,
  },
  {
    title: "Performance Testing",
    description:
      "Load and stress testing with Apache JMeter to evaluate system behavior under high traffic and identify bottlenecks before production.",
    icon: "⚡",
    is_public: true,
    display_order: 3,
  },
  {
    title: "Test Automation",
    description:
      "Automated test suite development using Playwright and Selenium WebDriver for reliable regression coverage.",
    icon: "🤖",
    is_public: true,
    display_order: 4,
  },
  {
    title: "Test Documentation",
    description:
      "Writing clear, structured test plans, test cases, and defect reports that support effective communication across development and business teams.",
    icon: "📋",
    is_public: true,
    display_order: 5,
  },
  {
    title: "QA Consulting",
    description:
      "Helping teams define quality processes, review test strategies, and improve software delivery through systematic quality assurance practices.",
    icon: "💡",
    is_public: true,
    display_order: 6,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function run() {
  const client = await pool.connect();
  let inserted = 0;
  let skipped = 0;

  function log(table, count, skip) {
    inserted += count;
    skipped += skip;
    console.log(`  ${table.padEnd(20)} +${count} inserted, ${skip} skipped`);
  }

  try {
    console.log("\n🌱 Seeding Neon database...\n");

    // ── Profile ─────────────────────────────────────────────────────────────
    {
      const existing = await client.query("SELECT id FROM profiles LIMIT 1");
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO profiles
            (full_name, professional_title, short_intro, biography, email, phone, location, hero_text, is_public, display_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            profile.full_name, profile.professional_title, profile.short_intro,
            profile.biography, profile.email, profile.phone, profile.location,
            profile.hero_text, profile.is_public, profile.display_order,
          ]
        );
        log("profiles", 1, 0);
      } else {
        log("profiles", 0, 1);
      }
    }

    // ── Site Settings ────────────────────────────────────────────────────────
    {
      const existing = await client.query("SELECT id FROM site_settings LIMIT 1");
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO site_settings
            (site_title, meta_description, logo_text, footer_text, seo_keywords, is_public, display_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            settings.site_title, settings.meta_description, settings.logo_text,
            settings.footer_text, settings.seo_keywords, settings.is_public, settings.display_order,
          ]
        );
        log("site_settings", 1, 0);
      } else {
        log("site_settings", 0, 1);
      }
    }

    // ── Experiences ──────────────────────────────────────────────────────────
    {
      let ins = 0, skip = 0;
      for (const exp of experiences) {
        const res = await client.query(
          `INSERT INTO experiences
            (position, organization, location, start_date, is_current, responsibilities, achievements, is_public, display_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT DO NOTHING`,
          [
            exp.position, exp.organization, exp.location, exp.start_date,
            exp.is_current, exp.responsibilities, exp.achievements, exp.is_public, exp.display_order,
          ]
        );
        res.rowCount > 0 ? ins++ : skip++;
      }
      log("experiences", ins, skip);
    }

    // ── Education ────────────────────────────────────────────────────────────
    {
      let ins = 0, skip = 0;
      for (const edu of education) {
        const res = await client.query(
          `INSERT INTO education
            (degree, institution, start_year, end_year, grade, description, achievements, is_public, display_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT DO NOTHING`,
          [
            edu.degree, edu.institution, edu.start_year, edu.end_year,
            edu.grade, edu.description, edu.achievements, edu.is_public, edu.display_order,
          ]
        );
        res.rowCount > 0 ? ins++ : skip++;
      }
      log("education", ins, skip);
    }

    // ── Skill Categories + Skills ────────────────────────────────────────────
    {
      let catIns = 0, catSkip = 0, skillIns = 0, skillSkip = 0;
      for (const cat of skillCategories) {
        // Upsert category
        const catRes = await client.query(
          `INSERT INTO skill_categories (name, is_public, display_order)
           VALUES ($1, true, $2)
           ON CONFLICT (name) DO UPDATE SET display_order = EXCLUDED.display_order
           RETURNING id`,
          [cat.name, cat.display_order]
        );
        const categoryId = catRes.rows[0].id;
        catIns++;

        for (let i = 0; i < cat.skills.length; i++) {
          const skillName = cat.skills[i];
          const res = await client.query(
            `INSERT INTO skills (category_id, name, is_public, display_order)
             VALUES ($1,$2,true,$3)
             ON CONFLICT (category_id, name) DO NOTHING`,
            [categoryId, skillName, i + 1]
          );
          res.rowCount > 0 ? skillIns++ : skillSkip++;
        }
      }
      log("skill_categories", catIns, catSkip);
      log("skills", skillIns, skillSkip);
    }

    // ── Projects ─────────────────────────────────────────────────────────────
    {
      let ins = 0, skip = 0;
      for (const proj of projects) {
        const res = await client.query(
          `INSERT INTO projects
            (title, slug, description, full_description, technologies, category, featured, is_public, display_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (slug) DO NOTHING`,
          [
            proj.title, proj.slug, proj.description, proj.full_description,
            proj.technologies, proj.category, proj.featured, proj.is_public, proj.display_order,
          ]
        );
        res.rowCount > 0 ? ins++ : skip++;
      }
      log("projects", ins, skip);
    }

    // ── Certifications ───────────────────────────────────────────────────────
    {
      let ins = 0, skip = 0;
      for (const cert of certifications) {
        const res = await client.query(
          `INSERT INTO certifications
            (name, organization, issue_date, description, is_public, display_order)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT DO NOTHING`,
          [
            cert.name, cert.organization ?? null, cert.issue_date ?? null,
            cert.description ?? null, cert.is_public, cert.display_order,
          ]
        );
        res.rowCount > 0 ? ins++ : skip++;
      }
      log("certifications", ins, skip);
    }

    // ── Services ─────────────────────────────────────────────────────────────
    {
      let ins = 0, skip = 0;
      for (const svc of services) {
        const res = await client.query(
          `INSERT INTO services (title, description, icon, is_public, display_order)
           VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT DO NOTHING`,
          [svc.title, svc.description, svc.icon, svc.is_public, svc.display_order]
        );
        res.rowCount > 0 ? ins++ : skip++;
      }
      log("services", ins, skip);
    }

    console.log(`\n✅ Done. ${inserted} rows inserted, ${skipped} already existed.\n`);

  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
