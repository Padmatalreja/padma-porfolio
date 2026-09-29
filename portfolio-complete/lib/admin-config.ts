export type FieldType =
  | "text"
  | "textarea"
  | "richtext"   // TipTap WYSIWYG — outputs HTML
  | "email"
  | "url"
  | "date"
  | "number"
  | "checkbox"
  | "array"
  | "select"
  | "file"
  | "multiple-files"
  | "image-upload"; // Cloudinary drag-drop uploader

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
};

export type SectionConfig = {
  table: string;
  label: string;
  singular: string;
  singleton?: boolean;
  fields: Field[];
  orderable?: boolean;
};

export const sectionConfigs: Record<string, SectionConfig> = {
  profile: {
    table: "profiles",
    label: "Profile",
    singular: "Profile",
    singleton: true,
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true },
      { name: "professional_title", label: "Professional title", type: "text", required: true },
      { name: "short_intro", label: "Short introduction", type: "textarea", required: true },
      { name: "biography", label: "Biography", type: "richtext", required: true },
      { name: "email", label: "Public email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "hero_text", label: "Hero text", type: "textarea" },
      { name: "availability_status", label: "Availability status", type: "text" },
      { name: "profile_image_url", label: "Profile image", type: "image-upload" },
      { name: "resume_url", label: "CV / resume (PDF)", type: "image-upload" },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  experience: {
    table: "experiences",
    label: "Experience",
    singular: "Experience entry",
    orderable: true,
    fields: [
      { name: "position", label: "Position", type: "text", required: true },
      { name: "organization", label: "Organization", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "is_current", label: "Currently working here", type: "checkbox" },
      { name: "description", label: "Description", type: "richtext" },
      { name: "responsibilities", label: "Responsibilities (one per line)", type: "array" },
      { name: "achievements", label: "Achievements (one per line)", type: "array" },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  education: {
    table: "education",
    label: "Education",
    singular: "Education record",
    orderable: true,
    fields: [
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "field", label: "Field of study", type: "text" },
      { name: "start_year", label: "Start year", type: "number" },
      { name: "end_year", label: "End year", type: "number" },
      { name: "grade", label: "Grade / GPA", type: "text" },
      { name: "description", label: "Description", type: "richtext" },
      { name: "achievements", label: "Achievements (one per line)", type: "array" },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  "skill-categories": {
    table: "skill_categories",
    label: "Skill Categories",
    singular: "Skill category",
    orderable: true,
    fields: [
      { name: "name", label: "Category name", type: "text", required: true },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  skills: {
    table: "skills",
    label: "Skills",
    singular: "Skill",
    orderable: true,
    fields: [
      { name: "category_id", label: "Category", type: "select", required: true },
      { name: "name", label: "Skill name", type: "text", required: true },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  services: {
    table: "services",
    label: "Services",
    singular: "Service",
    orderable: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "richtext" },
      {
        name: "icon",
        label: "Icon (emoji or text, e.g. 🧪)",
        type: "text",
        placeholder: "🧪",
      },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  projects: {
    table: "projects",
    label: "Projects",
    singular: "Project",
    orderable: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug (auto-generated if blank)", type: "text" },
      { name: "description", label: "Short description", type: "textarea" },
      { name: "full_description", label: "Full description", type: "richtext" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { label: "— None —", value: "" },
          { label: "UI/UX", value: "UI/UX" },
          { label: "Web", value: "Web" },
          { label: "Mobile", value: "Mobile" },
          { label: "Testing / QA", value: "Testing / QA" },
          { label: "Automation", value: "Automation" },
          { label: "Development", value: "Development" },
          { label: "Branding", value: "Branding" },
          { label: "Other", value: "Other" },
        ],
      },
      {
        name: "technologies",
        label: "Technologies (one per line or comma-separated)",
        type: "array",
      },
      { name: "role", label: "Your role", type: "text" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "github_url", label: "GitHub URL", type: "url" },
      { name: "live_url", label: "Live URL", type: "url" },
      { name: "thumbnail_url", label: "Thumbnail image", type: "image-upload" },
      { name: "featured", label: "Mark as featured", type: "checkbox" },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  publications: {
    table: "publications",
    label: "Publications",
    singular: "Publication",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "authors", label: "Authors (one per line)", type: "array" },
      { name: "journal", label: "Journal", type: "text" },
      { name: "conference", label: "Conference", type: "text" },
      { name: "year", label: "Year", type: "number" },
      { name: "volume", label: "Volume", type: "text" },
      { name: "issue", label: "Issue", type: "text" },
      { name: "pages", label: "Pages", type: "text" },
      { name: "doi", label: "DOI", type: "text" },
      { name: "url", label: "Publication URL", type: "url" },
      { name: "abstract", label: "Abstract", type: "richtext" },
      {
        name: "publication_type",
        label: "Type",
        type: "select",
        options: [
          { label: "— None —", value: "" },
          { label: "Journal Article", value: "Journal Article" },
          { label: "Conference Paper", value: "Conference Paper" },
          { label: "Book Chapter", value: "Book Chapter" },
          { label: "Thesis", value: "Thesis" },
          { label: "Other", value: "Other" },
        ],
      },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  certifications: {
    table: "certifications",
    label: "Certifications",
    singular: "Certification",
    orderable: true,
    fields: [
      { name: "name", label: "Certification name", type: "text", required: true },
      { name: "organization", label: "Issuing organization", type: "text" },
      { name: "issue_date", label: "Issue date", type: "date" },
      { name: "credential_id", label: "Credential ID", type: "text" },
      { name: "credential_url", label: "Credential URL", type: "url" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "certificate_image_url", label: "Certificate image", type: "image-upload" },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  awards: {
    table: "awards",
    label: "Awards & Achievements",
    singular: "Award / achievement",
    orderable: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "organization", label: "Organization", type: "text" },
      { name: "award_date", label: "Date", type: "date" },
      { name: "description", label: "Description", type: "richtext" },
      { name: "image_url", label: "Award image", type: "image-upload" },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  testimonials: {
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    orderable: true,
    fields: [
      { name: "author_name", label: "Author name", type: "text", required: true },
      { name: "author_title", label: "Author title / role", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "content", label: "Testimonial text", type: "richtext", required: true },
      {
        name: "rating",
        label: "Rating (1–5)",
        type: "select",
        options: [
          { label: "5 — Excellent", value: "5" },
          { label: "4 — Good", value: "4" },
          { label: "3 — Average", value: "3" },
          { label: "2 — Below average", value: "2" },
          { label: "1 — Poor", value: "1" },
        ],
      },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  "social-links": {
    table: "social_links",
    label: "Social Links",
    singular: "Social link",
    orderable: true,
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true, placeholder: "LinkedIn" },
      { name: "url", label: "URL", type: "url", required: true },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  "contact-info": {
    table: "contact_info",
    label: "Contact Info",
    singular: "Contact info",
    singleton: true,
    fields: [
      { name: "phone",          label: "Phone",          type: "text",     placeholder: "+1 234 567 8900" },
      { name: "email",          label: "Email",          type: "email",    placeholder: "hello@example.com" },
      { name: "address",        label: "Address",        type: "textarea", placeholder: "123 Main St, City, Country" },
      { name: "business_hours", label: "Business Hours", type: "textarea", placeholder: "Mon–Fri: 9 AM – 6 PM" },
      {
        name:        "social_links_text",
        label:       "Social Links (one per line: Platform | URL)",
        type:        "textarea",
        placeholder: "LinkedIn | https://linkedin.com/in/yourprofile\nGitHub | https://github.com/yourprofile",
      },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },

  settings: {
    table: "site_settings",
    label: "Site Settings / SEO",
    singular: "Site settings",
    singleton: true,
    fields: [
      { name: "site_title", label: "Website title", type: "text", required: true },
      { name: "meta_description", label: "Meta description", type: "textarea", required: true },
      { name: "logo_text", label: "Logo text / initials", type: "text" },
      { name: "footer_text", label: "Footer tagline", type: "text" },
      { name: "hero_text", label: "Default hero text", type: "textarea" },
      { name: "seo_keywords", label: "SEO keywords (one per line)", type: "array" },
      { name: "availability_status", label: "Availability status", type: "text" },
      { name: "is_public", label: "Public", type: "checkbox" },
    ],
  },
};
