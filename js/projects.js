/**
 * Projects page — filter + pagination only.
 *
 * Filters support multi-select (OR): a project shows if it matches any active category.
 * "All Projects" clears the selection and shows everything.
 *
 * Required markup:
 *   section[data-projects-page]
 *   [data-projects-filters] button[data-filter="category-slug"]
 *   ul[data-projects-grid] > li[data-project-item][data-project-categories="slug-a slug-b"]
 *   nav[data-projects-pagination]
 */
(function () {
  "use strict";

  var GRID_SLOTS = 6;
  var DEFAULT_PAGE_SIZE = 6;
  var MOBILE_MAX = 767;

  function isMobileViewport() {
    return window.matchMedia("(max-width: " + MOBILE_MAX + "px)").matches;
  }

  function getPageSize(root) {
    if (isMobileViewport()) {
      var mobileAttr = parseInt(root.getAttribute("data-projects-page-size-mobile"), 10);
      if (mobileAttr > 0) return mobileAttr;
      if (window.ProjectsConfig && window.ProjectsConfig.pageSizeMobile > 0) {
        return window.ProjectsConfig.pageSizeMobile;
      }
    }

    var fromAttr = parseInt(root.getAttribute("data-projects-page-size"), 10);
    if (fromAttr > 0) return fromAttr;
    if (window.ProjectsConfig && window.ProjectsConfig.pageSize > 0) {
      return window.ProjectsConfig.pageSize;
    }
    return DEFAULT_PAGE_SIZE;
  }

  function parseCategories(item) {
    return (item.getAttribute("data-project-categories") || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  function assignGridSlots(items) {
    items.forEach(function (item, index) {
      var slot = (index % GRID_SLOTS) + 1;
      item.classList.remove(
        "projects__item--slot-1",
        "projects__item--slot-2",
        "projects__item--slot-3",
        "projects__item--slot-4",
        "projects__item--slot-5",
        "projects__item--slot-6"
      );
      item.classList.add("projects__item--slot-" + slot);
    });
  }

  function paginationItems(totalPages, currentPage) {
    if (totalPages <= 7) {
      var pages = [];
      for (var i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    var items = [1];
    if (currentPage > 3) items.push("ellipsis");

    for (var p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      if (items.indexOf(p) === -1) items.push(p);
    }

    if (currentPage < totalPages - 2) items.push("ellipsis");
    if (totalPages > 1) items.push(totalPages);

    return items;
  }

  function initProjectsPage(root) {
    var filtersRoot = root.querySelector("[data-projects-filters]");
    var gridEl = root.querySelector("[data-projects-grid]");
    var paginationEl = root.querySelector("[data-projects-pagination]");
    var emptyEl = root.querySelector("[data-projects-empty]");

    if (!gridEl || !paginationEl) return;

    var allItems = Array.prototype.slice.call(gridEl.querySelectorAll("[data-project-item]"));
    if (!allItems.length) return;

    var pageSize = getPageSize(root);
    var state = { categories: [], page: 1 };

    function hasActiveFilters() {
      return state.categories.length > 0;
    }

    function isCategoryActive(slug) {
      return state.categories.indexOf(slug) !== -1;
    }

    function itemMatchesFilters(item) {
      if (!hasActiveFilters()) return true;

      var itemCategories = parseCategories(item);
      for (var i = 0; i < state.categories.length; i++) {
        if (itemCategories.indexOf(state.categories[i]) !== -1) return true;
      }
      return false;
    }

    function getFilteredItems() {
      return allItems.filter(itemMatchesFilters);
    }

    function clearFilters() {
      state.categories = [];
    }

    function toggleCategory(slug) {
      var index = state.categories.indexOf(slug);
      if (index === -1) {
        state.categories.push(slug);
      } else {
        state.categories.splice(index, 1);
      }
    }

    function updateFilters() {
      if (!filtersRoot) return;

      var filterToggle = filtersRoot.querySelector("[data-projects-filter-toggle]");

      filtersRoot.querySelectorAll("[data-filter]").forEach(function (button) {
        var slug = button.getAttribute("data-filter");
        var isActive = slug === "all" ? !hasActiveFilters() : isCategoryActive(slug);
        button.classList.toggle("tab--active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      if (filterToggle) {
        filterToggle.classList.toggle("projects__filters-toggle--has-selection", hasActiveFilters());

        var toggleLabel = filterToggle.querySelector(".projects__filters-toggle-label");
        if (toggleLabel) {
          toggleLabel.textContent = hasActiveFilters() ? "Filters" : "Filter";
        }
      }
    }

    function renderPagination(totalPages) {
      if (totalPages <= 1) {
        paginationEl.innerHTML = "";
        paginationEl.hidden = true;
        return;
      }

      paginationEl.hidden = false;

      var pagesHtml = paginationItems(totalPages, state.page)
        .map(function (item) {
          if (item === "ellipsis") {
            return '<span class="projects-pagination__ellipsis" aria-hidden="true">…</span>';
          }

          var activeClass = item === state.page ? " projects-pagination__page--active" : "";
          return (
            '<button class="projects-pagination__page' +
            activeClass +
            '" type="button" data-page="' +
            item +
            '" aria-label="Page ' +
            item +
            '" aria-current="' +
            (item === state.page ? "page" : "false") +
            '">' +
            item +
            "</button>"
          );
        })
        .join("");

      paginationEl.innerHTML =
        '<button class="slider-btn projects-pagination__arrow projects-pagination__arrow--prev" type="button" data-page-prev aria-label="Previous page"' +
        (state.page <= 1 ? " disabled" : "") +
        ">" +
        '<img class="slider-btn__icon slider-btn__icon--default" src="assets/icons/arrow-slider-default.svg" alt="" width="12" height="6" />' +
        '<img class="slider-btn__icon slider-btn__icon--hover" src="assets/icons/arrow-slider-hover.svg" alt="" width="12" height="6" />' +
        "</button>" +
        pagesHtml +
        '<button class="slider-btn projects-pagination__arrow projects-pagination__arrow--next" type="button" data-page-next aria-label="Next page"' +
        (state.page >= totalPages ? " disabled" : "") +
        ">" +
        '<img class="slider-btn__icon slider-btn__icon--default" src="assets/icons/arrow-slider-default.svg" alt="" width="12" height="6" />' +
        '<img class="slider-btn__icon slider-btn__icon--hover" src="assets/icons/arrow-slider-hover.svg" alt="" width="12" height="6" />' +
        "</button>";
    }

    function selectCategory(slug) {
      if (isMobileViewport()) {
        // Mobile panel: one category at a time (Figma active state); tap again to clear.
        if (isCategoryActive(slug)) {
          clearFilters();
        } else {
          state.categories = [slug];
        }
        return;
      }

      toggleCategory(slug);
    }

    function applyView() {
      pageSize = getPageSize(root);

      var filtered = getFilteredItems();
      var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

      if (state.page > totalPages) state.page = totalPages;

      var start = (state.page - 1) * pageSize;
      var pageItems = filtered.slice(start, start + pageSize);
      var visibleSet = new Set(pageItems);

      allItems.forEach(function (item) {
        var isVisible = visibleSet.has(item);
        item.hidden = !isVisible;
        item.setAttribute("aria-hidden", isVisible ? "false" : "true");
      });

      assignGridSlots(pageItems);

      if (emptyEl) emptyEl.hidden = pageItems.length > 0;

      updateFilters();
      renderPagination(totalPages);
    }

    if (filtersRoot) {
      var filterToggle = filtersRoot.querySelector("[data-projects-filter-toggle]");
      var filterPanel = filtersRoot.querySelector("[data-projects-filter-panel]");

      if (filterToggle && filterPanel) {
        filterToggle.addEventListener("click", function () {
          var isOpen = filterPanel.classList.toggle("projects__filters-group--open");
          filterToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
      }

      filtersRoot.addEventListener("click", function (event) {
        if (event.target.closest("[data-projects-filter-toggle]")) return;

        var button = event.target.closest("[data-filter]");
        if (!button) return;

        var slug = button.getAttribute("data-filter");

        if (slug === "all") {
          clearFilters();
        } else {
          selectCategory(slug);
        }

        state.page = 1;
        applyView();

        if (isMobileViewport() && filterPanel && slug !== "all") {
          filterPanel.classList.remove("projects__filters-group--open");
          if (filterToggle) filterToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    window.addEventListener("resize", function () {
      applyView();
    });

    paginationEl.addEventListener("click", function (event) {
      var pageButton = event.target.closest("[data-page]");
      if (pageButton) {
        state.page = Number(pageButton.getAttribute("data-page"));
        applyView();
        root.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (event.target.closest("[data-page-prev]")) {
        state.page = Math.max(1, state.page - 1);
        applyView();
        return;
      }

      if (event.target.closest("[data-page-next]")) {
        var totalPages = Math.max(1, Math.ceil(getFilteredItems().length / pageSize));
        state.page = Math.min(totalPages, state.page + 1);
        applyView();
      }
    });

    applyView();
  }

  function init() {
    document.querySelectorAll("[data-projects-page]").forEach(initProjectsPage);
  }

  window.ProjectsApp = { init: init };
})();
