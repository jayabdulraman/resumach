import { ResumeData } from ".";

export const sampleResume: ResumeData = {
  basics: {
    name: "John Doe",
    headline: "Creative and Innovative Web Developer",
    email: "john.doe@gmail.com",
    phone: "(555) 123-4567",
    location: "Pleasantville, CA 94588",
    url: {
      label: "",
      href: "https://johndoe.me/",
    },
  },
  sections: {
    summary: {
      name: "Summary",
      visible: true,
      identifier: "summary",
      content:
        "<p>Innovative Web Developer with 5 years of experience in building impactful and user-friendly websites and applications. Specializes in <strong>front-end technologies</strong> and passionate about modern web standards and cutting-edge development techniques. Proven track record of leading successful projects from concept to deployment.</p>",
    },
    awards: {
      name: "Awards",
      visible: true,
      identifier: "awards",
      items: [],
    },
    certifications: {
      name: "Certifications",
      visible: true,
      identifier: "certifications",
      items: [
        {
          id: "spdhh9rrqi1gvj0yqnbqunlo",
          name: "Full-Stack Web Development",
          issuer: "CodeAcademy",
          visible: true,
          date: "2020",
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
        {
          id: "n838rddyqv47zexn6cxauwqp",
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          date: "2019",
          visible: true,
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    education: {
      name: "Education",
      visible: true,
      identifier: "education",
      items: [
        {
          id: "yo3p200zo45c6cdqc6a2vtt3",
          institution: "University of California",
          studyType: "Bachelor's in Computer Science",
          area: "Berkeley, CA",
          score: "",
          date: "August 2012 to May 2016",
          visible: true,
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    experience: {
      name: "Experience",
      visible: true,
      identifier: "experience",
      items: [
        {
          id: "lhw25d7gf32wgdfpsktf6e0x",
          company: "Creative Solutions Inc.",
          position: "Senior Web Developer",
          location: "San Francisco, CA",
          date: "January 2019 to Present",
          visible: true,
          summary:
            "<ul><li><p>Spearheaded the redesign of the main product website, resulting in a 40% increase in user engagement.</p></li><li><p>Developed and implemented a new responsive framework, improving cross-device compatibility.</p></li><li><p>Mentored a team of four junior developers, fostering a culture of technical excellence.</p></li></ul>",
          url: {
            label: "",
            href: "https://creativesolutions.inc/",
          },
        },
        {
          id: "r6543lil53ntrxmvel53gbtm",
          company: "TechAdvancers",
          position: "Web Developer",
          location: "San Jose, CA",
          date: "June 2016 to December 2018",
          visible: true,
          summary:
            "<ul><li><p>Collaborated in a team of 10 to develop high-quality web applications using React.js and Node.js.</p></li><li><p>Managed the integration of third-party services such as Stripe for payments and Twilio for SMS services.</p></li><li><p>Optimized application performance, achieving a 30% reduction in load times.</p></li></ul>",
          url: {
            label: "",
            href: "https://techadvancers.com/",
          },
        },
      ],
    },
    volunteer: {
      name: "Volunteering",
      visible: true,
      identifier: "volunteer",
      items: [],
    },
    profiles: {
      name: "Profiles",
      visible: true,
      identifier: "profiles",
      items: [
        {
          id: "cnbk5f0aeqvhx69ebk7hktwd",
          network: "LinkedIn",
          username: "johndoe",
          visible: true,
          icon: "linkedin",
          url: {
            label: "",
            href: "https://linkedin.com/in/johndoe",
          },
        },
        {
          id: "ukl0uecvzkgm27mlye0wazlb",
          network: "GitHub",
          username: "johndoe",
          visible: true,
          icon: "github",
          url: {
            label: "",
            href: "https://github.com/johndoe",
          },
        },
      ],
    },
    projects: {
      name: "Projects",
      visible: true,
      identifier: "projects",
      items: [
        {
          id: "yw843emozcth8s1ubi1ubvlf",
          name: "E-Commerce Platform",
          description: "Project Lead",
          visible: true,
          date: "",
          summary:
            "<p>Led the development of a full-stack e-commerce platform, improving sales conversion by 25%.</p>",
          keywords: [],
          url: {
            label: "",
            href: "",
          },
        },
        {
          id: "ncxgdjjky54gh59iz2t1xi1v",
          name: "Interactive Dashboard",
          description: "Frontend Developer",
          date: "",
          visible: true,
          summary:
            "<p>Created an interactive analytics dashboard for a SaaS application, enhancing data visualization for clients.</p>",
          keywords: [],
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    publications: {
      name: "Publications",
      visible: true,
      identifier: "publications",
      items: [],
    },
    references: {
      name: "References",
      visible: false,
      identifier: "references",
      items: [
        {
          id: "f2sv5z0cce6ztjl87yuk8fak",
          name: "Available upon request",
          description: "",
          visible: true,
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    skills: {
      name: "Skills",
      visible: true,
      identifier: "skills",
      items: [
        {
          id: "hn0keriukh6c0ojktl9gsgjm",
          name: "Web Technologies",
          description: "Advanced",
          visible: true,
          keywords: ["HTML5", "JavaScript", "PHP", "Python"],
        },
        {
          id: "r8c3y47vykausqrgmzwg5pur",
          name: "Web Frameworks",
          description: "Intermediate",
          visible: true,
          keywords: ["React.js", "Angular", "Vue.js", "Laravel", "Django"],
        },
        {
          id: "b5l75aseexqv17quvqgh73fe",
          name: "Tools",
          description: "Intermediate",
          visible: true,
          keywords: ["Webpack", "Git", "Jenkins", "Docker", "JIRA"],
        },
      ],
    },
    custom: {},
  },
  metadata: {
    template: "kakuna",
    layout: [
      [
        ["summary", "experience", "education", "projects", "references"],
        [
          "profiles",
          "skills",
          "certifications",
          "interests",
          "languages",
          "awards",
          "volunteer",
          "publications",
        ],
      ],
    ],
    page: {
      margin: 14,
      format: "a4",
      options: {
        breakLine: true,
        pageNumbers: true,
      },
    },
    typography: {
      font: {
        family: "Merriweather",
        subset: "latin",
        variants: ["regular"],
        size: 13,
      }
    },
    notes: "",
  },
};
