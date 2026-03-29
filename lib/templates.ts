export type FormField = {
  name: string;
  type: "text" | "email" | "textarea" | "select" | "radio" | "url" | "number";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type Template = {
  id: string;
  name: string;
  description: string;
  category: "General" | "HR" | "Support" | "Marketing";
  fields: FormField[];
};

export const FORM_TEMPLATES: Template[] = [
  // --- GENERAL ---
  {
    id: "tpl_contact_basic",
    name: "Basic Contact Form",
    description: "A simple, clean contact form to capture leads and inquiries.",
    category: "General",
    fields: [
      {
        name: "name",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "John Doe",
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "john@example.com",
      },
      {
        name: "message",
        type: "textarea",
        label: "Message",
        required: true,
        placeholder: "How can we help you?",
      },
    ],
  },
  {
    id: "tpl_newsletter",
    name: "Newsletter Subscription",
    description: "Grow your audience with a simple newsletter signup form.",
    category: "General",
    fields: [
      {
        name: "firstName",
        type: "text",
        label: "First Name",
        required: false,
        placeholder: "John",
      },
      {
        name: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "you@awesome.com",
      },
      {
        name: "frequency",
        type: "radio",
        label: "How often do you want to hear from us?",
        required: true,
        options: ["Weekly", "Monthly", "Only big updates"],
      },
    ],
  },
  {
    id: "tpl_saas_onboarding",
    name: "User Onboarding Survey",
    description: "Understand your new users better right after they sign up.",
    category: "General",
    fields: [
      {
        name: "role",
        type: "select",
        label: "What is your role?",
        required: true,
        options: ["Founder/CEO", "Developer", "Designer", "Marketer", "Other"],
      },
      {
        name: "companySize",
        type: "select",
        label: "Company Size",
        required: true,
        options: ["1-10", "11-50", "51-200", "201+"],
      },
      {
        name: "primaryGoal",
        type: "textarea",
        label: "What is your main goal with our product?",
        required: true,
        placeholder: "I want to solve...",
      },
    ],
  },

  // --- HR ---
  {
    id: "tpl_job_application",
    name: "Job Application",
    description:
      "Collect candidate details, resumes, and portfolio links easily.",
    category: "HR",
    fields: [
      {
        name: "firstName",
        type: "text",
        label: "First Name",
        required: true,
        placeholder: "Jane",
      },
      {
        name: "lastName",
        type: "text",
        label: "Last Name",
        required: true,
        placeholder: "Doe",
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        required: true,
        placeholder: "jane@example.com",
      },
      {
        name: "role",
        type: "select",
        label: "Role Applying For",
        required: true,
        options: [
          "Frontend Developer",
          "Backend Developer",
          "Designer",
          "Product Manager",
        ],
      },
      {
        name: "portfolioUrl",
        type: "url",
        label: "Portfolio / LinkedIn URL",
        required: false,
        placeholder: "https://...",
      },
      {
        name: "coverLetter",
        type: "textarea",
        label: "Cover Letter",
        required: true,
        placeholder: "Tell us why you are a good fit...",
      },
    ],
  },
  {
    id: "tpl_employee_survey",
    name: "Employee Satisfaction",
    description: "Internal HR form to measure team morale and gather feedback.",
    category: "HR",
    fields: [
      {
        name: "department",
        type: "select",
        label: "Department",
        required: true,
        options: ["Engineering", "Sales", "Marketing", "HR", "Operations"],
      },
      {
        name: "satisfaction",
        type: "radio",
        label: "How satisfied are you with your work environment?",
        required: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
      },
      {
        name: "feedback",
        type: "textarea",
        label: "Any anonymous feedback for the management?",
        required: false,
        placeholder: "I think we should improve...",
      },
    ],
  },

  // --- SUPPORT ---
  {
    id: "tpl_customer_feedback",
    name: "Customer Feedback",
    description: "Gather valuable insights and ratings from your customers.",
    category: "Support",
    fields: [
      {
        name: "rating",
        type: "radio",
        label: "How would you rate our service?",
        required: true,
        options: ["Excellent", "Good", "Average", "Poor"],
      },
      {
        name: "feedback",
        type: "textarea",
        label: "What can we improve?",
        required: true,
        placeholder: "Share your thoughts...",
      },
      {
        name: "email",
        type: "email",
        label: "Email (Optional)",
        required: false,
        placeholder: "For follow-up",
      },
    ],
  },
  {
    id: "tpl_bug_report",
    name: "Software Bug Report",
    description: "Allow users to report bugs and technical issues.",
    category: "Support",
    fields: [
      {
        name: "bugTitle",
        type: "text",
        label: "Issue Title",
        required: true,
        placeholder: "e.g. Login page crashing",
      },
      {
        name: "severity",
        type: "select",
        label: "Severity",
        required: true,
        options: [
          "Low - Cosmetic",
          "Medium - Workaround exists",
          "High - Feature broken",
          "Critical - System down",
        ],
      },
      {
        name: "stepsToReproduce",
        type: "textarea",
        label: "Steps to Reproduce",
        required: true,
        placeholder: "1. Go to... \n2. Click on...",
      },
      {
        name: "browser",
        type: "text",
        label: "Browser/OS",
        required: true,
        placeholder: "Chrome on Windows 11",
      },
    ],
  },
  {
    id: "tpl_support_ticket",
    name: "IT Helpdesk Ticket",
    description: "Internal or external IT support request form.",
    category: "Support",
    fields: [
      {
        name: "requesterName",
        type: "text",
        label: "Your Name",
        required: true,
      },
      {
        name: "issueCategory",
        type: "select",
        label: "Category",
        required: true,
        options: [
          "Hardware",
          "Software",
          "Network/Internet",
          "Access/Permissions",
        ],
      },
      {
        name: "description",
        type: "textarea",
        label: "Describe the problem",
        required: true,
      },
    ],
  },

  // --- MARKETING ---
  {
    id: "tpl_event_registration",
    name: "Event Registration",
    description:
      "Register attendees for your upcoming webinar or physical event.",
    category: "Marketing",
    fields: [
      { name: "fullName", type: "text", label: "Full Name", required: true },
      { name: "email", type: "email", label: "Work Email", required: true },
      { name: "company", type: "text", label: "Company Name", required: true },
      {
        name: "dietaryReq",
        type: "select",
        label: "Dietary Requirements",
        required: false,
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"],
      },
    ],
  },
  {
    id: "tpl_waitlist",
    name: "Startup Waitlist",
    description: "Capture early interest for your new SaaS or product launch.",
    category: "Marketing",
    fields: [
      {
        name: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "Enter your best email",
      },
      {
        name: "useCase",
        type: "textarea",
        label: "How do you plan to use our product?",
        required: false,
        placeholder: "I want to use it for...",
      },
    ],
  },
  {
    id: "tpl_lead_gen",
    name: "B2B Lead Generation",
    description: "Capture high-quality leads with company and contact details.",
    category: "Marketing",
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "workEmail", type: "email", label: "Work Email", required: true },
      {
        name: "companyName",
        type: "text",
        label: "Company Name",
        required: true,
      },
      {
        name: "phoneNumber",
        type: "text",
        label: "Phone Number",
        required: false,
      },
      {
        name: "interest",
        type: "select",
        label: "Product of Interest",
        required: true,
        options: [
          "Enterprise Plan",
          "Pro Plan",
          "Custom Integration",
          "Partnership",
        ],
      },
    ],
  },
];
