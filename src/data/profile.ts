export const profile = {
  name: "Your Name",
  tagline: "Software Engineer — Building reliable, scalable systems",
  focus:
    "Specializing in backend development, cloud infrastructure, and data-intensive applications",
  about: [
    "Experienced software engineer with a strong foundation in computer science principles and a passion for building robust, maintainable systems. Proven track record of delivering high-quality software solutions in collaborative environments.",
    "Committed to writing clean, well-tested code and continuously learning new technologies to solve complex problems effectively.",
  ],
  contact: [
    {
      label: "Email",
      value: "email@example.com",
      href: "mailto:email@example.com",
    },
    {
      label: "GitHub",
      value: "github.com/username",
      href: "https://github.com/username",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/username",
      href: "https://linkedin.com/in/username",
    },
  ],
};

export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);
