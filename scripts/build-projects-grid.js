/**
 * Generates partials/projects-grid.html from js/projects-data.js (dev helper).
 * Run: node scripts/build-projects-grid.js
 */
const fs = require("fs");
const path = require("path");

const GRID_PATTERN = ["small", "big", "big", "small", "small", "big"];
const DESKTOP_SIZE = { small: [638, 350], big: [902, 500] };

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function btnArrow() {
  return (
    '<span class="btn__arrow" aria-hidden="true">' +
    '<span class="btn__arrow-viewport"><span class="btn__arrow-track">' +
    '<img class="btn__arrow-icon" src="assets/icons/arrow-black.svg" alt="" width="17" height="17" />' +
    '<img class="btn__arrow-icon btn__arrow-icon--incoming" src="assets/icons/arrow-black.svg" alt="" width="17" height="17" aria-hidden="true" />' +
    "</span></span></span>"
  );
}

function desktopCard(project, size) {
  const [w, h] = DESKTOP_SIZE[size];
  const mod = size === "big" ? "project-card--big" : "project-card--small";
  const href = esc(project.link || "#");

  return (
    `<article class="project-card ${mod} projects__card">\n` +
    '  <div class="project-card__media">\n' +
    '    <div class="project-card__photo">\n' +
    `      <img class="project-card__image" src="${esc(project.image)}" alt="${esc(project.alt)}" width="${w}" height="${h}" loading="lazy" />\n` +
    "    </div>\n" +
    '    <div class="project-card__overlay"></div>\n' +
    '    <div class="project-card__eagle-fx" aria-hidden="true">\n' +
    '      <div class="project-card__eagle-blur">\n' +
    `        <img class="project-card__eagle-blur-img" src="${esc(project.image)}" alt="" width="${w}" height="${h}" loading="lazy" />\n` +
    "      </div>\n" +
    "    </div>\n" +
    `    <span class="tag tag--desktop project-card__tag">${esc(project.tag)}</span>\n` +
    '    <div class="project-card__action">\n' +
    `      <a class="btn btn--white btn--desktop" href="${href}">\n` +
    '        <span class="btn__label">Explore</span>\n' +
    `        ${btnArrow()}\n` +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    `  <h2 class="project-card__title">${esc(project.title)}</h2>\n` +
    "</article>"
  );
}

function mobileCard(project) {
  const href = esc(project.link || "#");

  return (
    '<article class="project-card project-card--mobile projects__card projects__card--mobile">\n' +
    '  <div class="project-card__media">\n' +
    `    <img class="project-card__image" src="${esc(project.image)}" alt="${esc(project.alt)}" width="351" height="351" loading="lazy" />\n` +
    '    <div class="project-card__overlay"></div>\n' +
    `    <span class="tag tag--mobile project-card__tag">${esc(project.tag)}</span>\n` +
    '    <div class="project-card__action">\n' +
    `      <a class="btn btn--white btn--mobile" href="${href}">\n` +
    '        <span class="btn__label">Explore</span>\n' +
    `        ${btnArrow()}\n` +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    `  <h2 class="project-card__title">${esc(project.title)}</h2>\n` +
    "</article>"
  );
}

const dataPath = path.join(__dirname, "../js/projects-data.js");
const code = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
const vm = require("vm");
vm.runInNewContext(code, sandbox);
const projects = sandbox.window.ProjectsData.projects;

const items = projects
  .map((project, index) => {
    const size = GRID_PATTERN[index % GRID_PATTERN.length];
    const categories = project.categories.join(" ");
    return (
      `<li class="projects__item" data-project-item data-project-categories="${esc(categories)}">\n` +
      `${desktopCard(project, size)}\n` +
      `${mobileCard(project)}\n` +
      "</li>"
    );
  })
  .join("\n\n");

const output =
  "<!--\n" +
  "  Project cards for the Featured Projects page.\n" +
  "  WordPress: loop CPT `project` and include partials/project-card.html per post.\n" +
  "  Each <li> needs data-project-categories with taxonomy slugs (space-separated).\n" +
  "-->\n" +
  `<ul class="projects__grid" data-projects-grid aria-live="polite">\n${items}\n</ul>\n`;

fs.writeFileSync(path.join(__dirname, "../partials/projects-grid.html"), output);

const filters = sandbox.window.ProjectsData.filters;
const allFilter = filters.find((f) => f.id === "all");
const categoryFilters = filters.filter((f) => f.id !== "all");

const filtersHtml =
  "<!--\n" +
  "  Filter tabs — Featured Projects (Figma 9846:3942 desktop / 9874:6234 mobile).\n" +
  "  WordPress: loop taxonomy terms into .projects__filters-group.\n" +
  "-->\n" +
  '<div class="projects__filters" data-projects-filters aria-label="Filter projects">\n' +
  '  <div class="projects__filters-row">\n' +
  '    <div class="projects__filters-primary">\n' +
  `      <button class="tab tab--desktop projects__filter tab--active" type="button" data-filter="all" aria-pressed="true">${esc(allFilter.label)}</button>\n` +
  "    </div>\n" +
  '    <button class="projects__filters-toggle" type="button" data-projects-filter-toggle aria-expanded="false" aria-controls="projects-filter-panel">\n' +
  '      <img class="projects__filters-toggle-icon" src="assets/icons/filter-chevron-down.svg" alt="" width="10" height="5" />\n' +
  '      <span class="projects__filters-toggle-label" data-projects-filter-toggle-label>Filter</span>\n' +
  "    </button>\n" +
  "  </div>\n" +
  '  <div class="projects__filters-group" id="projects-filter-panel" data-projects-filter-panel role="group" aria-label="Project categories">\n' +
  categoryFilters
    .map(
      (f) =>
        `    <button class="tab tab--desktop projects__filter" type="button" data-filter="${esc(f.id)}" aria-pressed="false">${esc(f.label)}</button>`
    )
    .join("\n") +
  "\n  </div>\n" +
  "</div>\n";

fs.writeFileSync(path.join(__dirname, "../partials/projects-filters.html"), filtersHtml);
console.log("Wrote partials/projects-filters.html");
