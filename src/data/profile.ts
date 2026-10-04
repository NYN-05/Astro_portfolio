export const profile = {
  name: "JHASHANK NAYAN",
  tagline: "Computer Science (Data Science) Undergraduate | Software Development, Backend Engineering & AI/ML",
  focus:
    "Software development, backend engineering, REST API development, computer vision, AI/ML systems, inference pipelines, and performance-oriented system integration.",
  about: [
    "Computer Science (Data Science) undergraduate with hands-on experience in software development, backend engineering, REST API development, and AI/ML systems. Experienced in building practical software systems that integrate machine learning models with backend and frontend components.",
    "Focused on developing reliable AI/ML and software engineering systems, with practical experience in inference pipelines, computer vision, physiological signal analysis, API integration, model evaluation, concurrency, caching, and workflow optimization.",
  ],
  contact: [
    {
      label: "Email",
      value: "jnyn2005@gmail.com",
      href: "mailto:jnyn2005@gmail.com",
    },
    {
      label: "Phone",
      value: "+91 9632867181",
      href: "tel:+919632867181",
    },
    {
      label: "GitHub",
      value: "github.com/NYN-05",
      href: "https://github.com/NYN-05",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/jhashanknayan",
      href: "https://linkedin.com/in/jhashanknayan",
    },
  ],
};

export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);