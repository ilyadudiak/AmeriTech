async function loadPartial(targetId, partialPath) {

  const target = document.getElementById(targetId);

  if (!target) return;



  try {

    const response = await fetch(partialPath);

    if (!response.ok) throw new Error(`Failed to load ${partialPath}`);

    target.outerHTML = await response.text();

  } catch (error) {

    console.error(error);

  }

}



function initMenu() {

  const header = document.querySelector(".header");

  const burger = document.querySelector(".header__burger");

  const overlay = document.querySelector(".menu-overlay");

  const mobileRoot = header?.querySelector("[data-menu-mobile]");

  if (!header || !burger || !mobileRoot) return;



  const isMobileViewport = () => window.matchMedia("(max-width: 1023px)").matches;

  const isDesktopViewport = () => window.matchMedia("(min-width: 1024px)").matches;

  const groups = mobileRoot.querySelectorAll(".mobile-menu__group");

  const expandTriggers = mobileRoot.querySelectorAll("[data-menu-expand]");

  const sublinks = mobileRoot.querySelectorAll(".mobile-menu__sublink, .mobile-menu__row--link");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;



  const isMobileOpen = () => header.classList.contains("header--menu-open");



  const setGroupOpen = (group, open) => {

    group.classList.toggle("mobile-menu__group--open", open);

    const trigger = group.querySelector("[data-menu-expand]");

    if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");

  };



  const collapseAllGroups = () => {

    groups.forEach((group) => setGroupOpen(group, false));

  };



  const openMobileMenu = () => {

    if (!isMobileViewport()) return;



    header.classList.add("header--menu-open");

    mobileRoot.setAttribute("aria-hidden", "false");

    document.body.classList.add("is-menu-open");

    burger.setAttribute("aria-expanded", "true");

    burger.setAttribute("aria-label", "Close menu");

  };



  const closeMobileMenu = () => {

    header.classList.remove("header--menu-open");

    mobileRoot.setAttribute("aria-hidden", "true");

    document.body.classList.remove("is-menu-open");

    burger.setAttribute("aria-expanded", "false");

    burger.setAttribute("aria-label", "Open menu");

    collapseAllGroups();

  };



  const toggleMobileMenu = () => {

    if (!isMobileViewport()) return;

    if (isMobileOpen()) closeMobileMenu();

    else openMobileMenu();

  };



  burger.addEventListener("click", toggleMobileMenu);



  expandTriggers.forEach((trigger) => {

    trigger.addEventListener("click", () => {

      const group = trigger.closest(".mobile-menu__group");

      if (!group) return;



      const willOpen = !group.classList.contains("mobile-menu__group--open");

      groups.forEach((other) => {

        if (other !== group) setGroupOpen(other, false);

      });

      setGroupOpen(group, willOpen);



      if (willOpen && !prefersReducedMotion) {

        requestAnimationFrame(() => {

          group.scrollIntoView({ block: "nearest", behavior: "smooth" });

        });

      }

    });

  });



  sublinks.forEach((link) => {

    link.addEventListener("click", closeMobileMenu);

  });



  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && isMobileOpen()) closeMobileMenu();

  });



  window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {

    if (event.matches && isMobileOpen()) closeMobileMenu();

  });



  if (!overlay || typeof MENU_SECTIONS === "undefined") return;



  const linksRoot = overlay.querySelector("[data-menu-links]");
  const linksColumn = overlay.querySelector(".menu-overlay__links-column");
  const visualImg = overlay.querySelector("[data-menu-visual-img]");
  const visualVideo = overlay.querySelector("[data-menu-visual-video]");

  const overlayTriggers = overlay.querySelectorAll("[data-menu-trigger]");

  const headerTriggers = document.querySelectorAll(".header__link[data-menu-trigger]");

  const desktopClose = overlay.querySelectorAll("[data-menu-close]");

  const overlayPlainLinks = overlay.querySelectorAll(

    ".menu-overlay__nav-link:not([data-menu-trigger])"

  );

  let activeSection = null;



  const isDesktopOpen = () => overlay.classList.contains("menu-overlay--open");

  const updateLinksScrollFades = () => {
    if (!linksRoot || !linksColumn || !isDesktopViewport()) return;

    const viewportMax = Number(linksColumn.dataset.menuLinksViewport) || 380;

    linksColumn.classList.remove(
      "menu-overlay__links-column--scrollable",
      "menu-overlay__links-column--fade-top",
      "menu-overlay__links-column--fade-bottom"
    );
    linksRoot.classList.remove("menu-overlay__links--scrollable");
    linksRoot.style.removeProperty("max-height");

    const contentHeight = linksRoot.scrollHeight;
    const canScroll = contentHeight > viewportMax + 1;

    if (!canScroll) {
      linksRoot.scrollTop = 0;
      return;
    }

    linksColumn.classList.add("menu-overlay__links-column--scrollable");
    linksRoot.classList.add("menu-overlay__links--scrollable");
    linksRoot.style.maxHeight = `${viewportMax}px`;

    const { scrollTop, clientHeight, scrollHeight } = linksRoot;
    const atTop = scrollTop <= 1;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

    linksColumn.classList.toggle("menu-overlay__links-column--fade-top", !atTop);
    linksColumn.classList.toggle("menu-overlay__links-column--fade-bottom", !atBottom);
  };

  const markWrappedLinks = () => {
    if (!linksRoot) return;

    const maxTextWidth = 694;

    linksRoot.querySelectorAll(".menu-overlay__link").forEach((anchor) => {
      const text = anchor.querySelector(".menu-link__text");
      anchor.classList.remove("menu-overlay__link--wrap");

      if (!text) return;

      const lineHeight = parseFloat(getComputedStyle(text).lineHeight) || 54;
      const previousWidth = text.style.width;
      text.style.width = `${maxTextWidth}px`;
      const wraps = text.scrollHeight > lineHeight + 2;
      text.style.width = previousWidth;

      if (wraps) anchor.classList.add("menu-overlay__link--wrap");
    });
  };

  const scheduleLinksScrollFades = () => {
    markWrappedLinks();
    requestAnimationFrame(() => {
      updateLinksScrollFades();
      requestAnimationFrame(updateLinksScrollFades);
    });
  };

  if (linksRoot) {
    linksRoot.addEventListener("scroll", updateLinksScrollFades, { passive: true });
    new ResizeObserver(updateLinksScrollFades).observe(linksRoot);
  }

  window.addEventListener("resize", updateLinksScrollFades);



  const setActiveNav = (sectionId) => {
    activeSection = sectionId;

    overlay.querySelectorAll(".menu-overlay__nav-link").forEach((link) => {
      if (link.dataset.menuTrigger) {
        const isActive = link.dataset.menuTrigger === sectionId;
        link.classList.toggle("menu-overlay__nav-link--active", isActive);
        link.classList.toggle("menu-overlay__nav-link--inactive", !isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
        return;
      }

      link.classList.add("menu-overlay__nav-link--inactive");
      link.removeAttribute("aria-current");
    });

    headerTriggers.forEach((link) => {
      const isActive = link.dataset.menuTrigger === sectionId;
      link.classList.toggle("header__link--active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };



  const renderMenuVisual = (section) => {
    if (section.video && visualVideo) {
      if (visualImg) visualImg.hidden = true;
      visualVideo.hidden = false;
      visualVideo.src = section.video;
      visualVideo.load();
      visualVideo.play().catch(() => {});
      return;
    }

    if (visualVideo) {
      visualVideo.hidden = true;
      visualVideo.pause();
      visualVideo.removeAttribute("src");
      visualVideo.load();
    }

    if (visualImg) {
      visualImg.hidden = false;
      visualImg.src = section.image;
      visualImg.alt = section.imageAlt || "";
    }
  };

  const renderMenuLinks = (sectionId) => {
    const section = MENU_SECTIONS[sectionId];
    if (!section || !linksRoot) return;

    linksRoot.innerHTML = "";

    section.links.forEach((link) => {
      const entry = document.createElement("div");
      entry.className = "menu-overlay__entry";

      const anchor = document.createElement("a");
      anchor.className = "menu-link menu-overlay__link";
      anchor.href = link.href;
      anchor.innerHTML = `
        <span class="menu-link__text">${link.text}</span>
        <span class="menu-link__arrow" aria-hidden="true">
          <img class="menu-link__icon--hover" src="assets/icons/arrow-menu-hover.svg" alt="" width="32" height="32" />
        </span>
      `;
      anchor.addEventListener("click", closeDesktopMenu);

      entry.appendChild(anchor);
      linksRoot.appendChild(entry);
    });

    renderMenuVisual(section);

    linksRoot.scrollTop = 0;
    scheduleLinksScrollFades();
  };



  const openDesktopMenu = (sectionId) => {

    if (!isDesktopViewport() || !MENU_SECTIONS[sectionId]) return;



    renderMenuLinks(sectionId);

    setActiveNav(sectionId);

    overlay.classList.add("menu-overlay--open");

    overlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("is-menu-open");

    scheduleLinksScrollFades();

  };



  const closeDesktopMenu = () => {

    overlay.classList.remove("menu-overlay--open");

    overlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("is-menu-open");

    activeSection = null;

    if (visualVideo) {
      visualVideo.pause();
      visualVideo.hidden = true;
    }

    if (visualImg) {
      visualImg.hidden = false;
    }

    overlayTriggers.forEach((link) => {

      link.classList.remove("menu-overlay__nav-link--active", "menu-overlay__nav-link--inactive");

      link.removeAttribute("aria-current");

    });

    overlay.querySelectorAll(".menu-overlay__nav-link:not([data-menu-trigger])").forEach((link) => {

      link.classList.remove("menu-overlay__nav-link--inactive");

    });



    headerTriggers.forEach((link) => {

      link.classList.remove("header__link--active");

      link.removeAttribute("aria-current");

    });

    linksColumn?.classList.remove(
      "menu-overlay__links-column--scrollable",
      "menu-overlay__links-column--fade-top",
      "menu-overlay__links-column--fade-bottom"
    );

    linksRoot?.classList.remove("menu-overlay__links--scrollable");
    linksRoot?.style.removeProperty("max-height");

  };



  const handleMenuTrigger = (event, sectionId) => {

    if (!isDesktopViewport()) return;



    event.preventDefault();



    if (isDesktopOpen() && activeSection === sectionId) return;



    if (isDesktopOpen()) {

      renderMenuLinks(sectionId);

      setActiveNav(sectionId);

      return;

    }



    openDesktopMenu(sectionId);

  };



  headerTriggers.forEach((link) => {

    link.addEventListener("click", (event) => {

      handleMenuTrigger(event, link.dataset.menuTrigger);

    });

  });



  overlayTriggers.forEach((link) => {

    link.addEventListener("click", (event) => {

      handleMenuTrigger(event, link.dataset.menuTrigger);

    });

  });



  overlayPlainLinks.forEach((link) => {

    link.addEventListener("click", closeDesktopMenu);

  });



  desktopClose.forEach((el) => el.addEventListener("click", closeDesktopMenu));



  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && isDesktopOpen()) closeDesktopMenu();

  });



  window.matchMedia("(max-width: 1023px)").addEventListener("change", (event) => {

    if (event.matches && isDesktopOpen()) closeDesktopMenu();

  });

}



function initCompetenciesAnimation() {

  const list = document.querySelector(".competencies__list");

  if (!list) return;



  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

    list.classList.add("competencies__list--visible");

    return;

  }



  const observer = new IntersectionObserver(

    ([entry]) => {

      if (!entry.isIntersecting) return;

      list.classList.add("competencies__list--visible");

      observer.disconnect();

    },

    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }

  );



  observer.observe(list);

}



document.addEventListener("DOMContentLoaded", async () => {

  await loadPartial("site-header", "partials/header.html");

  await loadPartial("header-mobile-menu", "partials/mobile-menu.html");

  await loadPartial("site-menu", "partials/menu.html");

  await loadPartial("site-about", "partials/about.html");

  await loadPartial("site-competencies", "partials/competencies.html");

  await loadPartial("site-portfolio", "partials/portfolio.html");

  await loadPartial("site-footer", "partials/footer.html");

  initMenu();

  initCompetenciesAnimation();

});


