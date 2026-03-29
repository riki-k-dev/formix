export type FormField = {
  id: string;
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
        id: "name",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "John Doe",
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "john@example.com",
      },
      {
        id: "message",
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
        id: "firstName",
        type: "text",
        label: "First Name",
        required: false,
        placeholder: "John",
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "you@awesome.com",
      },
      {
        id: "frequency",
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
        id: "role",
        type: "select",
        label: "What is your role?",
        required: true,
        options: ["Founder/CEO", "Developer", "Designer", "Marketer", "Other"],
      },
      {
        id: "companySize",
        type: "select",
        label: "Company Size",
        required: true,
        options: ["1-10", "11-50", "51-200", "201+"],
      },
      {
        id: "primaryGoal",
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
        id: "firstName",
        type: "text",
        label: "First Name",
        required: true,
        placeholder: "Jane",
      },
      {
        id: "lastName",
        type: "text",
        label: "Last Name",
        required: true,
        placeholder: "Doe",
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        required: true,
        placeholder: "jane@example.com",
      },
      {
        id: "role",
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
        id: "portfolioUrl",
        type: "url",
        label: "Portfolio / LinkedIn URL",
        required: false,
        placeholder: "https://...",
      },
      {
        id: "coverLetter",
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
        id: "department",
        type: "select",
        label: "Department",
        required: true,
        options: ["Engineering", "Sales", "Marketing", "HR", "Operations"],
      },
      {
        id: "satisfaction",
        type: "radio",
        label: "How satisfied are you with your work environment?",
        required: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
      },
      {
        id: "feedback",
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
        id: "rating",
        type: "radio",
        label: "How would you rate our service?",
        required: true,
        options: ["Excellent", "Good", "Average", "Poor"],
      },
      {
        id: "feedback",
        type: "textarea",
        label: "What can we improve?",
        required: true,
        placeholder: "Share your thoughts...",
      },
      {
        id: "email",
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
        id: "bugTitle",
        type: "text",
        label: "Issue Title",
        required: true,
        placeholder: "e.g. Login page crashing",
      },
      {
        id: "severity",
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
        id: "stepsToReproduce",
        type: "textarea",
        label: "Steps to Reproduce",
        required: true,
        placeholder: "1. Go to... \n2. Click on...",
      },
      {
        id: "browser",
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
      { id: "requesterName", type: "text", label: "Your Name", required: true },
      {
        id: "issueCategory",
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
        id: "description",
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
      { id: "fullName", type: "text", label: "Full Name", required: true },
      { id: "email", type: "email", label: "Work Email", required: true },
      { id: "company", type: "text", label: "Company Name", required: true },
      {
        id: "dietaryReq",
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
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "Enter your best email",
      },
      {
        id: "useCase",
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
      { id: "firstName", type: "text", label: "First Name", required: true },
      { id: "lastName", type: "text", label: "Last Name", required: true },
      { id: "workEmail", type: "email", label: "Work Email", required: true },
      {
        id: "companyName",
        type: "text",
        label: "Company Name",
        required: true,
      },
      {
        id: "phoneNumber",
        type: "text",
        label: "Phone Number",
        required: false,
      },
      {
        id: "interest",
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
