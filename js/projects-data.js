/**
 * PROJECT DATA — static demo content only.
 *
 * WordPress / CMS: replace this file with server-rendered HTML in
 * partials/projects-grid.html and partials/projects-filters.html.
 * Map fields:
 *   slug/id     → post slug
 *   title       → post title
 *   tag         → ACF tag or primary category label
 *   categories  → taxonomy slugs (must match filter button data-filter values)
 *   image, alt  → featured image
 *   link        → permalink
 *
 * Dev helper: node scripts/build-projects-grid.js regenerates the grid partial.
 */
window.ProjectsData = {
  filters: [
    { id: "all", label: "All Projects" },
    { id: "preventative-maintenance", label: "Preventative Maintenance" },
    { id: "facilities-management-services", label: "Facilities Management Services" },
    { id: "disaster-response-recover", label: "Disaster Response & Recover" },
    { id: "emergency-response", label: "Emergency Response and Rapid Mobilization" },
    { id: "shrine-restoration", label: "Shrine Restoration" },
    { id: "roofing-exterior", label: "Roofing and Exterior Envelope" },
    { id: "occupied-facility", label: "Occupied Facility and Mission-Critical Work" },
    { id: "milcon", label: "Military Construction (MILCON)" },
  ],

  projects: [
    {
      slug: "vamc-steam-trap",
      title: "VAMC Steam Trap Replacement",
      tag: "Mechanical Upgrades",
      categories: ["preventative-maintenance", "occupied-facility"],
      image: "assets/images/portfolio/portfolio-steam-trap.jpg",
      alt: "Construction worker on wooden beams at a VA medical center",
      link: "#",
    },
    {
      slug: "vamc-manchester",
      title: "VAMC Manchester",
      tag: "Preventative Maintenance",
      categories: ["preventative-maintenance", "facilities-management-services"],
      image: "assets/images/portfolio/portfolio-manchester.jpg",
      alt: "Worker pouring concrete at VAMC Manchester",
      link: "project-vamc-manchester.html",
    },
    {
      slug: "west-roxbury-pool-roof",
      title: "West Roxbury Pool Roof",
      tag: "Security",
      categories: ["roofing-exterior", "emergency-response"],
      image: "assets/images/portfolio/portfolio-pool-roof.jpg",
      alt: "Worker installing ceiling fixtures at West Roxbury pool roof project",
      link: "#",
    },
    {
      slug: "natick-nssc-fence",
      title: "Natick NSSC Fence",
      tag: "Infrastructure",
      categories: ["milcon", "disaster-response-recover"],
      image: "assets/images/portfolio/portfolio-natick-fence.jpg",
      alt: "Aerial view of workers on the Natick NSSC fence project",
      link: "#",
    },
    {
      slug: "vamc-mechanical-upgrade",
      title: "VAMC Mechanical Systems Upgrade",
      tag: "Mechanical Upgrades",
      categories: ["preventative-maintenance", "occupied-facility"],
      image: "assets/images/portfolio/portfolio-steam-trap.jpg",
      alt: "Technicians servicing mechanical systems at a VA facility",
      link: "#",
    },
    {
      slug: "shrine-restoration-demo",
      title: "Historic Shrine Restoration",
      tag: "Shrine Restoration",
      categories: ["shrine-restoration"],
      image: "assets/images/portfolio/portfolio-pool-roof.jpg",
      alt: "Restoration work inside a historic shrine building",
      link: "#",
    },
    {
      slug: "emergency-roof-repair",
      title: "Emergency Roof Stabilization",
      tag: "Roofing and Exterior Envelope",
      categories: ["roofing-exterior", "emergency-response"],
      image: "assets/images/portfolio/portfolio-pool-roof.jpg",
      alt: "Emergency roof repair at a federal facility",
      link: "#",
    },
    {
      slug: "disaster-recovery-hq",
      title: "Disaster Recovery Headquarters",
      tag: "Disaster Response",
      categories: ["disaster-response-recover", "emergency-response"],
      image: "assets/images/portfolio/portfolio-manchester.jpg",
      alt: "Rapid mobilization construction at a disaster recovery site",
      link: "#",
    },
    {
      slug: "milcon-barracks",
      title: "MILCON Barracks Modernization",
      tag: "Military Construction",
      categories: ["milcon", "occupied-facility"],
      image: "assets/images/portfolio/portfolio-natick-fence.jpg",
      alt: "Military construction crew working on barracks modernization",
      link: "#",
    },
    {
      slug: "facilities-hvac",
      title: "Federal Campus HVAC Retrofit",
      tag: "Facilities Management",
      categories: ["facilities-management-services", "preventative-maintenance"],
      image: "assets/images/portfolio/portfolio-manchester.jpg",
      alt: "HVAC retrofit project at a federal campus",
      link: "#",
    },
    {
      slug: "occupied-clinic-renovation",
      title: "Occupied Clinic Renovation",
      tag: "Mission-Critical Work",
      categories: ["occupied-facility", "preventative-maintenance"],
      image: "assets/images/portfolio/portfolio-steam-trap.jpg",
      alt: "Renovation inside an active medical clinic",
      link: "#",
    },
    {
      slug: "perimeter-security-upgrade",
      title: "Perimeter Security Upgrade",
      tag: "Security",
      categories: ["emergency-response", "milcon"],
      image: "assets/images/portfolio/portfolio-natick-fence.jpg",
      alt: "Security perimeter upgrade at a government facility",
      link: "#",
    },
  ],
};
