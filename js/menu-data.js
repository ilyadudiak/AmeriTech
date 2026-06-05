const MENU_SECTIONS = {
  home: {
    label: "Home",
    video: "assets/videos/video1.mp4",
    links: [
      { text: "Our Company", href: "/#our-company" },
      { text: "Core Competencies", href: "/#core-competencies" },
      { text: "Our Work", href: "/#our-work" },
    ],
  },
  about: {
    label: "About",
    image: "assets/images/menu-about-image.jpg",
    imageAlt: "",
    links: [
      { text: "Our Roots", href: "/about/our-roots" },
      { text: "Leadership Team", href: "/about/leadership-team" },
      { text: "Management Team", href: "/about/management-team" },
      { text: "Photo Timeline", href: "/about/photo-timeline" },
      { text: "Awards", href: "/about/awards" },
    ],
  },
  capabilities: {
    label: "Capabilities",
    image: "assets/images/menu-capabilities-image.jpg",
    imageAlt: "Construction site with workers in safety gear",
    links: [
      { text: "Pre-construction & Planning", href: "/capabilities/pre-construction-planning" },
      { text: "Construction Management", href: "/capabilities/construction-management" },
      { text: "Federal Compliance", href: "/capabilities/federal-compliance" },
      {
        text: "Safety, Risk, and Environmental Management",
        href: "/capabilities/safety-risk-environmental",
      },
      { text: "Construction Technology", href: "/capabilities/construction-technology" },
    ],
  },
  markets: {
    label: "Markets",
    image: "assets/images/menu-capabilities-image.jpg",
    imageAlt: "",
    links: [
      { text: "Federal Government", href: "/markets/federal-government" },
      { text: "Healthcare", href: "/markets/healthcare" },
    ],
  },
  careers: {
    label: "Careers",
    image: "assets/images/menu-about-image.jpg",
    imageAlt: "",
    links: [
      { text: "Apply", href: "/careers/apply" },
      { text: "Subcontractors", href: "/careers/subcontractors" },
      { text: "Internship", href: "/careers/internship" },
      { text: "Skillbridge", href: "/careers/skillbridge" },
    ],
  },
};

const MENU_TRIGGER_IDS = Object.keys(MENU_SECTIONS);
